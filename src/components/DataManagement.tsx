import React, { useState } from 'react';
import { Download, Upload, Trash2, Database, Loader2 } from 'lucide-react';
import { supabaseApiService } from '../services/supabaseApi';
import toast from 'react-hot-toast';

const DataManagement: React.FC = () => {
  const [importData, setImportData] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleExport = async () => {
    setIsBusy(true);
    toast.loading('Exporting data...');
    try {
      const data = await supabaseApiService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `it-service-reports-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export data');
      console.error("Export Error:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleImport = async () => {
    setIsBusy(true);
    toast.loading('Importing data...');
    try {
      await supabaseApiService.importData(importData);
      toast.dismiss();
      toast.success('Data imported successfully! The page will now reload.');
      setImportData('');
      setShowImportDialog(false);
      // Refresh the page to show imported data
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to import data: Invalid format or database error.');
      console.error("Import Error:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleClearAll = async () => {
    setIsBusy(true);
    toast.loading('Clearing all data...');
    try {
      await supabaseApiService.clearAllData();
      toast.dismiss();
      toast.success('All data cleared successfully! The page will now reload.');
      setShowClearDialog(false);
      // Refresh the page to reflect changes
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to clear data');
      console.error("Clear Data Error:", error);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Database className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Data Management</h2>
        </div>
        
        <div className="space-y-4">
          {/* Export Row */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Export Data</h3>
              <p className="text-sm text-gray-600">Download all reports as a JSON file.</p>
            </div>
            <button onClick={handleExport} disabled={isBusy} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Import Row */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Import Data</h3>
              <p className="text-sm text-gray-600">Import reports from a JSON file.</p>
            </div>
            <button onClick={() => setShowImportDialog(true)} disabled={isBusy} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
               <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
          </div>

          {/* Clear Data Row */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Clear All Data</h3>
              <p className="text-sm text-gray-600">Permanently delete all reports.</p>
            </div>
            <button onClick={() => setShowClearDialog(true)} disabled={isBusy} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Data</h3>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full h-40 p-2 border rounded-lg"
              placeholder="Paste your exported JSON data here..."
            />
            <div className="flex space-x-3 mt-4">
              <button onClick={handleImport} disabled={!importData.trim() || isBusy} className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50">
                {isBusy ? <Loader2 className="animate-spin mx-auto" /> : 'Import'}
              </button>
              <button onClick={() => setShowImportDialog(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clear All Data</h3>
            <p className="text-gray-600">Are you sure you want to delete all reports? This cannot be undone.</p>
            <div className="flex space-x-3 mt-4">
              <button onClick={handleClearAll} disabled={isBusy} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50">
                {isBusy ? <Loader2 className="animate-spin mx-auto" /> : 'Yes, Clear All'}
              </button>
              <button onClick={() => setShowClearDialog(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
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
