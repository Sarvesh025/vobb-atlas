'use client';

import Navbar from '@/components/Navbar';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure your application preferences
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Application Settings</h3>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">View Preferences</h4>
              <p className="text-sm text-gray-600 mb-4">
                Your view preferences are automatically saved and will persist across sessions.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Data Management</h4>
              <p className="text-sm text-gray-600 mb-4">
                All deal data is stored locally in your browser and will persist until cleared.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">About</h4>
              <p className="text-sm text-gray-600">
                Vobb OS Atlas - Deal Management Interface v1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
