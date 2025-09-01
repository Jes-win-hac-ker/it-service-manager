import React, { useState } from 'react';
import { Download, Upload, Database, Loader2 } from 'lucide-react';
import { supabaseApiService } from '../services/supabaseApi';
import toast from 'react-hot-toast';

const DataManagement: React.FC = () => {
  const [importData, setImportData] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

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
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to import data.');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto px-2 sm:px-4">
      <div className="bg-white dark:bg-[#454545] rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Database className="h-6 w-6 text-brand-grey dark:text-gray-200" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Management</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-[#454545] p-4 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Export Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Download all reports as a JSON file.</p>
            </div>
            <button onClick={handleExport} disabled={isBusy} className="bg-brand-grey text-white py-2 px-4 rounded-lg hover:bg-brand-grey-light disabled:opacity-50 flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>

          <div className="flex items-center justify-between bg-gray-50 dark:bg-[#454545] p-4 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Import Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Import reports from a JSON file.</p>
            </div>
            <button onClick={() => setShowImportDialog(true)} disabled={isBusy} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
               <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>

      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#454545] rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Import Data</h3>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full h-40 p-2 border rounded-lg dark:bg-[#454545] dark:border-gray-600"
              placeholder="Paste your exported JSON data here..."
            />
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button onClick={handleImport} disabled={!importData.trim() || isBusy} className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50">
                {isBusy ? <Loader2 className="animate-spin mx-auto" /> : 'Import'}
              </button>
              <button onClick={() => setShowImportDialog(false)} className="w-full sm:w-auto bg-gray-300 dark:bg-[#454545] text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700">
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
