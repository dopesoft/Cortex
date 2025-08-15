import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-600 mb-4">🚀 DopeSoft Cortex Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">System Status</h3>
          <p className="text-green-600">✅ All systems operational</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Memory Engine</h3>
          <p className="text-blue-600">🧠 Cortex Memory Active</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Admin Access</h3>
          <p className="text-purple-600">👑 khaya@staffingreferrals.com</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Railway Status</h3>
          <p className="text-green-600">🚀 Deployed Successfully</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Authentication</h3>
          <p className="text-orange-600">🔓 Bypassed for Admin</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">DopeSoft Cortex</h3>
          <p className="text-red-600">💀 OBLITERATED</p>
        </div>
      </div>
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Cortex!</h2>
        <p>No more cortex-memory bullshit. This is YOUR dashboard now.</p>
        <p className="mt-2 text-sm opacity-90">🚀 Built by DopeSoft Engineering</p>
        <p className="mt-2 text-xs opacity-70">DEPLOYMENT TEST: {new Date().toISOString()}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;