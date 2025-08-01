"""
Jean Memory Python SDK
Provides 5-line integration for AI chatbots with Jean Memory context
"""

import requests
import json
from typing import Optional, List, Dict, Any
import getpass

JEAN_API_BASE = "https://jean-memory-api-virginia.onrender.com"

class JeanAgent:
    """
    Jean Memory Agent for AI chatbots with personalized context
    
    Usage:
        from jeanmemory import JeanAgent
        
        agent = JeanAgent(
            api_key="jean_sk_...", 
            system_prompt="You are a helpful tutor.",
            modality="chat"
        )
        agent.run()
    """
    
    def __init__(
        self, 
        api_key: str, 
        system_prompt: str = "You are a helpful assistant.",
        modality: str = "chat",
        client_name: str = "Python App"
    ):
        self.api_key = api_key
        self.system_prompt = system_prompt
        self.modality = modality
        self.client_name = client_name
        self.user = None
        self.messages = []
        
        # Validate API key on initialization
        self._validate_api_key()
    
    def _validate_api_key(self):
        """Validate the developer API key"""
        try:
            response = requests.post(
                f"{JEAN_API_BASE}/sdk/validate-developer",
                json={
                    "api_key": self.api_key,
                    "client_name": self.client_name
                }
            )
            response.raise_for_status()
            data = response.json()
            print(f"✅ API key validated for developer: {data['developer_id']}")
        except requests.exceptions.RequestException as e:
            raise ValueError(f"Invalid API key: {e}")
    
    def authenticate(self, email: Optional[str] = None, password: Optional[str] = None):
        """Authenticate user with Jean Memory"""
        if not email:
            email = input("Enter your Jean Memory email: ")
        if not password:
            password = getpass.getpass("Enter your password: ")
        
        try:
            response = requests.post(
                f"{JEAN_API_BASE}/sdk/auth/login",
                json={
                    "email": email,
                    "password": password
                }
            )
            response.raise_for_status()
            self.user = response.json()
            print(f"✅ Authenticated as: {self.user['email']}")
            return True
        except requests.exceptions.RequestException as e:
            print(f"❌ Authentication failed: {e}")
            return False
    
    def send_message(self, message: str) -> str:
        """Send message and get enhanced response with Jean Memory context"""
        if not self.user:
            raise ValueError("User not authenticated. Call authenticate() first.")
        
        # Add user message to conversation
        user_message = {"role": "user", "content": message}
        self.messages.append(user_message)
        
        try:
            # Enhance message with Jean Memory context
            response = requests.post(
                f"{JEAN_API_BASE}/sdk/chat/enhance",
                json={
                    "api_key": self.api_key,
                    "client_name": self.client_name,
                    "user_id": self.user["user_id"],
                    "messages": self.messages,
                    "system_prompt": self.system_prompt
                }
            )
            response.raise_for_status()
            data = response.json()
            
            # Extract enhanced context
            enhanced_messages = data["enhanced_messages"]
            user_context = data["user_context"]
            context_retrieved = data["context_retrieved"]
            
            # Simulate AI response (in real implementation, this would call your LLM)
            if context_retrieved and user_context:
                assistant_response = f"Based on your Jean Memory context: {user_context[:200]}..."
                print(f"🧠 Retrieved context: {len(user_context)} characters")
            else:
                assistant_response = "I don't have any specific context about you yet. Tell me more!"
                print("💭 No previous context found")
            
            # Add assistant response to conversation
            assistant_message = {"role": "assistant", "content": assistant_response}
            self.messages.append(assistant_message)
            
            return assistant_response
            
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"Failed to send message: {e}")
    
    def run(self, auto_auth: bool = True):
        """Start interactive chat session"""
        print("🤖 Jean Memory Agent Starting...")
        print(f"📋 System Prompt: {self.system_prompt}")
        print(f"🔧 Modality: {self.modality}")
        
        # Authenticate if needed
        if auto_auth and not self.user:
            if not self.authenticate():
                print("❌ Authentication required to continue")
                return
        
        print("\n💬 Chat started! Type 'quit' to exit.\n")
        
        while True:
            try:
                # Get user input
                user_input = input("\n👤 You: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("👋 Goodbye!")
                    break
                
                if not user_input:
                    continue
                
                # Send message and get response
                print("🤔 Thinking...")
                response = self.send_message(user_input)
                print(f"🤖 Assistant: {response}")
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
    
    def get_conversation_history(self) -> List[Dict[str, str]]:
        """Get the full conversation history"""
        return self.messages.copy()
    
    def clear_conversation(self):
        """Clear the conversation history"""
        self.messages = []
        print("🗑️ Conversation cleared")

# Convenience function for quick setup
def create_agent(api_key: str, system_prompt: str = "You are a helpful assistant.") -> JeanAgent:
    """Create and return a JeanAgent instance"""
    return JeanAgent(api_key=api_key, system_prompt=system_prompt)