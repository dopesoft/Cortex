"""
MCP OAuth Proxy for Claude Web

This endpoint implements a lean, stateless proxy that:
1. Authenticates Claude using OAuth Bearer tokens (JWT)
2. Extracts user_id and client from the JWT
3. Proxies requests to the proven V2 HTTP transport logic
4. Returns responses directly without sessions or SSE overhead

This combines OAuth security with V2's superior performance and reliability.
"""

import logging
import json

from fastapi import APIRouter, Request, Response, Depends, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse

from app.clients import get_client_profile
from app.context import user_id_var, client_name_var, background_tasks_var
from app.oauth_simple_new import get_current_user

logger = logging.getLogger(__name__)

oauth_mcp_router = APIRouter(tags=["oauth-mcp"])


async def handle_mcp_request(
    message: dict,
    user: dict,
    background_tasks: BackgroundTasks,
):
    """
    Handles a single JSON-RPC message directly.
    """
    method_name = message.get("method")
    params = message.get("params", {})
    request_id = message.get("id")
    client_name = user["client"]

    logger.error(f"🔥🔥🔥 HANDLE_MCP_REQUEST CALLED:")
    logger.error(f"   - Method: {method_name}")
    logger.error(f"   - Params: {params}")
    logger.error(f"   - Request ID: {request_id}")
    logger.error(f"   - Client: {client_name}")
    logger.error(f"   - User: {user.get('email', 'unknown')}")
    logger.error(f"   - Full message: {message}")

    logger.info(f"Handling MCP method '{method_name}' for client '{client_name}'")

    client_profile = get_client_profile(client_name)

    if method_name == "initialize":
        logger.error(f"🔥🔥🔥 INITIALIZE REQUEST PROCESSING:")
        # Use client's exact protocol version to avoid version mismatch issues
        client_protocol_version = params.get("protocolVersion", "2024-11-05")
        protocol_version = client_protocol_version
        logger.error(f"   - Client protocol version: {client_protocol_version}")
        logger.warning(f"🔥 CLIENT REQUESTED PROTOCOL: {client_protocol_version}")
        
        # For newer protocols, include tools directly in initialize response
        if client_protocol_version in ["2025-06-18", "2025-03-26"]:
            logger.error(f"   - Using modern protocol with direct tools")
            tools_schema = client_profile.get_tools_schema(include_annotations=True)
            logger.error(f"   - Retrieved tools schema: {tools_schema}")
            capabilities = {
                "tools": tools_schema,
                "logging": {},
                "sampling": {}
            }
            logger.error(f"   - Built capabilities: {capabilities}")
            logger.warning(f"🔥 SENDING {len(tools_schema)} TOOLS IN INITIALIZE RESPONSE")
        else:
            logger.error(f"   - Using legacy protocol with tools/list")
            # Older protocols use separate tools/list call
            capabilities = {
                "tools": {"listChanged": True},
                "logging": {},
                "sampling": {}
            }
            logger.error(f"   - Built legacy capabilities: {capabilities}")
        
        initialize_response = {
            "jsonrpc": "2.0",
            "result": {
                "protocolVersion": protocol_version,
                "capabilities": capabilities,
                "serverInfo": {"name": "Jean Memory", "version": "1.0.0"}
            },
            "id": request_id
        }
        logger.error(f"🔥🔥🔥 INITIALIZE RESPONSE BUILT:")
        logger.error(f"   - Full response: {initialize_response}")
        return initialize_response

    elif method_name == "tools/list":
        logger.error(f"🔥🔥🔥 TOOLS/LIST REQUEST PROCESSING:")
        logger.warning(f"🔥🔥🔥 EXPLICIT TOOLS/LIST CALLED! Client: {client_name}")
        tools_schema = client_profile.get_tools_schema(include_annotations=True)
        logger.error(f"   - Retrieved tools schema: {tools_schema}")
        logger.warning(f"🔥🔥🔥 RETURNING {len(tools_schema)} TOOLS FOR EXPLICIT TOOLS/LIST")
        tools_response = {"jsonrpc": "2.0", "result": {"tools": tools_schema}, "id": request_id}
        logger.error(f"🔥🔥🔥 TOOLS/LIST RESPONSE BUILT:")
        logger.error(f"   - Full response: {tools_response}")
        return tools_response

    elif method_name == "tools/call":
        tool_name = params.get("name")
        tool_args = params.get("arguments", {})
        try:
            result = await client_profile.handle_tool_call(tool_name, tool_args, user["user_id"])
            return client_profile.format_tool_response(result, request_id)
        except Exception as e:
            logger.error(f"Error calling tool '{tool_name}': {e}", exc_info=True)
            return {
                "jsonrpc": "2.0",
                "error": {"code": -32603, "message": str(e)},
                "id": request_id
            }

    elif method_name in ["notifications/initialized", "notifications/cancelled"]:
        logger.info(f"Received notification '{method_name}'")
        # For notifications, a response isn't strictly required, but we can acknowledge.
        # However, the proxy was returning None, so we do that here as well for single messages.
        # For batch, it was skipped. Let's return a special value to indicate no response.
        return None


    elif method_name in ["resources/list", "prompts/list"]:
        logger.warning(f"🔥🔥🔥 {method_name.upper()} CALLED! Client: {client_name}")
        result_key = method_name.split('/')[0]
        response = {"jsonrpc": "2.0", "result": {result_key: []}, "id": request_id}
        logger.warning(f"🔥🔥🔥 RETURNING EMPTY {result_key.upper()} LIST")
        return response

    elif method_name == "resources/templates/list":
        return {"jsonrpc": "2.0", "result": {"templates": []}, "id": request_id}

    else:
        return {
            "jsonrpc": "2.0",
            "error": {"code": -32601, "message": f"Method not found: {method_name}"},
            "id": request_id
        }


def validate_origin(request: Request) -> bool:
    """Validate Origin header to prevent DNS rebinding attacks"""
    origin = request.headers.get("origin")
    if not origin:
        return True  # Allow requests without Origin header
    
    # Allow our known domains
    allowed_origins = [
        "https://claude.ai",
        "https://app.claude.ai", 
        "https://api.claude.ai",
        "https://jean-memory-api-virginia.onrender.com",
        "http://localhost",
        "https://localhost"
    ]
    
    return any(origin.startswith(allowed) for allowed in allowed_origins)


@oauth_mcp_router.post("/mcp")
async def mcp_oauth_proxy(
    request: Request,
    background_tasks: BackgroundTasks,
    user: dict = Depends(get_current_user)
):
    logger.error(f"🔥🔥🔥 MCP POST REQUEST RECEIVED:")
    logger.error(f"   - Method: POST")
    logger.error(f"   - URL: {request.url}")
    logger.error(f"   - Headers: {dict(request.headers)}")
    logger.error(f"   - User: {user.get('email', 'unknown')}")
    logger.error(f"   - Client: {user.get('client', 'unknown')}")
    logger.error(f"   - User ID: {user.get('user_id', 'unknown')}")
    """
    MCP OAuth Proxy - Stateless HTTP Transport (MCP 2025-06-18)
    
    URL: https://jean-memory-api-virginia.onrender.com/mcp
    Authentication: OAuth 2.1 + Bearer token per RFC 6749 Section 5.1.1
    Transport: Stateless HTTP (request-reply per call)
    
    Implements MCP 2025-06-18 specification with:
    - OAuth 2.1 + PKCE authentication 
    - Resource parameter binding (RFC 8707)
    - Tools discovery in initialize response
    - Bearer token validation per OAuth 2.1 Section 5.2
    - Adherence to stateless HTTP transport; each request is self-contained.
    """
    
    # Validate Origin header (security requirement)
    origin = request.headers.get('origin')
    if not validate_origin(request):
        logger.error(f"🚨 ORIGIN VALIDATION FAILED:")
        logger.error(f"   - Origin: {origin}")
        logger.error(f"   - User-Agent: {request.headers.get('user-agent')}")
        logger.error(f"   - All headers: {dict(request.headers)}")
        raise HTTPException(status_code=403, detail="Invalid origin")
    else:
        logger.info(f"✅ Origin validation passed: {origin}")
    
    logger.info(f"🚀 MCP Stateless HTTP Transport: {user['client']} for user {user['user_id']} ({user['email']}) - Protocol 2025-06-18")
    
    # Set context variables for the duration of this request
    user_token = user_id_var.set(user["user_id"])
    client_token = client_name_var.set(user["client"])
    tasks_token = background_tasks_var.set(background_tasks)

    try:
        # Parse request body (single message or batch)
        body = await request.json()
        logger.error(f"🔥🔥🔥 REQUEST BODY PARSED:")
        logger.error(f"   - Body type: {type(body)}")
        logger.error(f"   - Body content: {body}")
        
        # Log all incoming methods to debug what Claude is calling
        if isinstance(body, list):
            methods = [msg.get('method', 'unknown') for msg in body]
            logger.warning(f"🔍 BATCH REQUEST: Methods: {methods}")
            # Check for tools/list in batch
            if any('tools/list' in method for method in methods):
                logger.warning(f"🔥🔥🔥 CLAUDE CALLED TOOLS/LIST IN BATCH! Methods: {methods} 🔥🔥🔥")
        else:
            method = body.get('method', 'unknown')
            logger.warning(f"🔍 SINGLE REQUEST: Method: {method}")
            if method == 'tools/list':
                logger.warning(f"🔥🔥🔥 CLAUDE IS CALLING TOOLS/LIST ON OAUTH PROXY! 🔥🔥🔥")
            elif method == 'initialize':
                logger.warning(f"🔥 INITIALIZE REQUEST: params={body.get('params', {})}")
        
        # Handle batch requests
        if isinstance(body, list):
            logger.error(f"🔥🔥🔥 PROCESSING BATCH REQUEST:")
            logger.error(f"   - Batch size: {len(body)} messages")
            responses = []
            
            for i, message in enumerate(body):
                logger.error(f"🔥🔥🔥 BATCH MESSAGE {i+1}:")
                logger.error(f"   - Message: {message}")
                response = await handle_mcp_request(message, user, background_tasks)
                logger.error(f"🔥🔥🔥 BATCH RESPONSE {i+1}:")
                logger.error(f"   - Response: {response}")
                if response:  # Only add non-None responses
                    responses.append(response)
            
            logger.error(f"🔥🔥🔥 FINAL BATCH RESPONSE:")
            logger.error(f"   - Total responses: {len(responses)}")
            logger.error(f"   - Responses: {responses}")
            return JSONResponse(content=responses)
        
        # Handle single message
        else:
            logger.error(f"🔥🔥🔥 PROCESSING SINGLE REQUEST:")
            logger.error(f"   - Message: {body}")
            response = await handle_mcp_request(body, user, background_tasks)
            logger.error(f"🔥🔥🔥 SINGLE RESPONSE:")
            logger.error(f"   - Response: {response}")
            if response is None:
                logger.error(f"🔥🔥🔥 RETURNING 204 NO CONTENT")
                # For notifications, no response is sent back to the client.
                return Response(status_code=204)
            logger.error(f"🔥🔥🔥 RETURNING JSON RESPONSE:")
            logger.error(f"   - Final response: {response}")
            return JSONResponse(content=response)
            
    except json.JSONDecodeError as e:
        logger.error(f"🔥🔥🔥 JSON DECODE ERROR:")
        logger.error(f"   - Error: {e}")
        logger.error(f"   - Request URL: {request.url}")
        logger.error(f"   - Request headers: {dict(request.headers)}")
        error_response = {
            "jsonrpc": "2.0",
            "error": {"code": -32700, "message": "Parse error"},
            "id": None
        }
        logger.error(f"🔥🔥🔥 RETURNING JSON DECODE ERROR RESPONSE:")
        logger.error(f"   - Response: {error_response}")
        return JSONResponse(
            status_code=400,
            content=error_response
        )
    except Exception as e:
        logger.error(f"🔥🔥🔥 GENERAL EXCEPTION IN MCP PROXY:")
        logger.error(f"   - Exception: {e}")
        logger.error(f"   - Exception type: {type(e)}")
        logger.error(f"   - Request URL: {request.url}")
        logger.error(f"   - Request headers: {dict(request.headers)}")
        logger.error(f"   - User: {user}")
        logger.error(f"   - Full traceback:", exc_info=True)
        error_response = {
            "jsonrpc": "2.0", 
            "error": {"code": -32603, "message": "Internal error"},
            "id": None
        }
        logger.error(f"🔥🔥🔥 RETURNING GENERAL ERROR RESPONSE:")
        logger.error(f"   - Response: {error_response}")
        return JSONResponse(
            status_code=500,
            content=error_response
        )
    finally:
        # Ensure context variables are reset
        user_id_var.reset(user_token)
        client_name_var.reset(client_token)
        background_tasks_var.reset(tasks_token)


@oauth_mcp_router.get("/mcp")
async def mcp_get_dummy(request: Request, user: dict = Depends(get_current_user)):
    logger.error(f"🔥🔥🔥 MCP GET REQUEST RECEIVED:")
    logger.error(f"   - Method: GET")
    logger.error(f"   - URL: {request.url}")
    logger.error(f"   - Headers: {dict(request.headers)}")
    logger.error(f"   - User: {user.get('email', 'unknown')}")
    logger.error(f"   - Client: {user.get('client', 'unknown')}")
    logger.error(f"   - User ID: {user.get('user_id', 'unknown')}")
    """
    Dummy GET endpoint to appease legacy Claude clients.
    
    The modern OAuth flow uses stateless POST requests exclusively. However, some
    Claude clients still attempt a GET request after initialization. Returning a 405
    causes the client to enter a retry loop.
    
    This dummy endpoint catches that GET, authenticates the user to ensure the token
    is valid, logs the event, and returns an empty 204 No Content. This satisfies
    the client's check without creating a protocol conflict.
    """
    logger.warning(
        f"⚠️ Dummy GET /mcp called by client for user {user['email']}. "
        "This is a legacy client behavior. Returning 204 No Content to prevent retry loops."
    )
    return Response(status_code=204)


# SSE endpoint removed - MCP 2025-06-18 uses a stateless HTTP transport only.
# The previous GET /mcp endpoint implemented a stateful SSE stream, which
# conflicted with the modern OAuth flow and caused client-side errors.
# All communication must happen through POST /mcp with a self-contained
# "Authorization: Bearer <access-token>" header on every HTTP request.


@oauth_mcp_router.get("/mcp/health")  
async def mcp_health(user: dict = Depends(get_current_user)):
    """Health check for MCP server with auth"""
    
    return {
        "status": "healthy",
        "user": user["email"],
        "client": user["client"],
        "transport": "oauth-proxy",
        "protocol": "MCP"
    }


@oauth_mcp_router.get("/mcp/status")
async def mcp_status():
    """Public MCP server status - no auth required for testing"""
    
    return {
        "status": "online",
        "transport": "oauth-proxy",
        "protocol_version": "2025-06-18",
        "protocol": "MCP",
        "oauth": "enabled",
        "serverInfo": {
            "name": "jean-memory",
            "version": "1.0.0"
        }
    }


@oauth_mcp_router.options("/mcp")
async def mcp_options():
    """Handle CORS preflight requests"""
    return JSONResponse(
        content={"status": "ok"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin",
            "Access-Control-Max-Age": "3600"
        }
    )


@oauth_mcp_router.head("/mcp")
async def mcp_head():
    """Handle HEAD requests for MCP endpoint discovery"""
    return Response(
        status_code=200,
        headers={
            "Content-Type": "application/json",
            "X-MCP-Protocol": "2025-06-18",
            "X-MCP-Transport": "http",
            "X-OAuth-Supported": "true",
            "Access-Control-Allow-Origin": "*"
        }
    )