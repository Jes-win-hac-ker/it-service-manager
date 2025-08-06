import React, { useState } from 'react';
import { Download, Upload, Trash2, Database } from 'lucide-react';
import { localStorageApiService } from '../services/localStorageApi';
import toast from 'react-hot-toast';

const DataManagement: React.FC = () => {
  const [importData, setImportData] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleExport = () => {
    try {
      const data = localStorageApiService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `it-service-reports-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImport = () => {
    try {
      localStorageApiService.importData(importData);
      toast.success('Data imported successfully!');
      setImportData('');
      setShowImportDialog(false);
      // Refresh the page to show imported data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to import data: Invalid format');
    }
  };

  const handleClearAll = () => {
    try {
      localStorageApiService.clearAllData();
      toast.success('All data cleared successfully!');
      setShowClearDialog(false);
      // Refresh the page to reflect changes
      window.location.reload();
    } catch (error) {
      toast.error('Failed to clear data');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Database className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Data Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Download className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Export Data</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Download all your reports as a JSON file for backup or transfer.
            </p>
            <button
              onClick={handleExport}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export Reports
            </button>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Upload className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Import Data</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Import reports from a previously exported JSON file.
            </p>
            <button
              onClick={() => setShowImportDialog(true)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Import Reports
            </button>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Trash2 className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-gray-900">Clear All Data</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Remove all reports from local storage. This cannot be undone.
            </p>
            <button
              onClick={() => setShowClearDialog(true)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Data is stored locally in your browser's storage</li>
            <li>• Clearing browser data will remove all reports</li>
            <li>• Export your data regularly for backup</li>
            <li>• Data is not shared between different browsers or devices</li>
          </ul>
        </div>
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Upload className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Import Data</h3>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste JSON data here:
              </label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Paste your exported JSON data here..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleImport}
                disabled={!importData.trim()}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Import Data
              </button>
              
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportData('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Clear All Data</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete all reports? This action cannot be undone.
              </p>
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ This will permanently delete all your service reports!
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleClearAll}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Clear All
              </button>
              
              <button
                onClick={() => setShowClearDialog(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;
