import React, { useState } from 'react';
import { exportGameData, importGameData, clearGameData, getStorageInfo } from '../utils/storage';

interface DataManagerProps {
  onDataImported?: () => void;
}

export function DataManager({ onDataImported }: DataManagerProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const storageInfo = getStorageInfo();

  const handleExport = () => {
    setIsExporting(true);
    try {
      const data = exportGameData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fantasy-family-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        importGameData(content);
        setImportError(null);
        onDataImported?.();
        // Reset file input
        event.target.value = '';
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'Failed to import data');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (showClearConfirm) {
      clearGameData();
      setShowClearConfirm(false);
      window.location.reload(); // Reload to reset state
    } else {
      setShowClearConfirm(true);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Data Management</h2>
      
      {storageInfo.hasData && storageInfo.lastSaved && (
        <div className="mb-4 text-sm text-gray-400">
          Last saved: {new Date(storageInfo.lastSaved).toLocaleString()}
        </div>
      )}

      <div className="space-y-4">
        {/* Export Data */}
        <div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isExporting ? 'Exporting...' : 'Export Backup'}
          </button>
          <p className="text-xs text-gray-400 mt-1">
            Download your game data as a JSON file for backup
          </p>
        </div>

        {/* Import Data */}
        <div>
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <span className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer block text-center">
              Import Backup
            </span>
          </label>
          <p className="text-xs text-gray-400 mt-1">
            Restore game data from a backup file
          </p>
          {importError && (
            <p className="text-red-400 text-xs mt-1">{importError}</p>
          )}
        </div>

        {/* Clear Data */}
        <div>
          <button
            onClick={handleClearData}
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              showClearConfirm
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {showClearConfirm ? 'Click Again to Confirm' : 'Clear All Data'}
          </button>
          <p className="text-xs text-gray-400 mt-1">
            {showClearConfirm 
              ? 'This will permanently delete all game data!'
              : 'Reset the game and remove all saved data'
            }
          </p>
          {showClearConfirm && (
            <button
              onClick={() => setShowClearConfirm(false)}
              className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}