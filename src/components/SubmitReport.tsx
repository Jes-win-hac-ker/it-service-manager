import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Calendar, PlusCircle, Bell } from 'lucide-react';
import { addReport } from '../services/api';
import { ReportFormData } from '../types/Report';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SubmitReport: React.FC = () => {
  // ... (state and functions remain the same)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Save className="h-6 w-6 text-brand-grey" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submit New Report</h2>
        </div>
        
        <form /* ... */>
          {/* ... */}
          <div className="flex space-x-4 pt-4">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-brand-grey text-white py-2 px-4 rounded-lg hover:bg-brand-grey-light">
              Submit Report
            </button>
            <button type="button" onClick={handleClear} className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700">
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport;
