
import React from 'react';
import { Upload, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateFileSize, validateFileExtension, MAX_FILE_SIZE } from '@/utils/securityUtils';

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export const FileUploader = ({ file, onFileSelect, disabled = false }: FileUploaderProps) => {
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const validateFile = (uploadedFile: File): boolean => {
    setValidationError(null);

    // Check file extension
    if (!validateFileExtension(uploadedFile)) {
      setValidationError('Please upload a CSV file with .csv extension');
      return false;
    }

    // Check file size
    if (!validateFileSize(uploadedFile)) {
      setValidationError(`File size must be less than ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`);
      return false;
    }

    // Check MIME type
    if (uploadedFile.type !== 'text/csv' && uploadedFile.type !== 'application/vnd.ms-excel') {
      setValidationError('Please upload a valid CSV file');
      return false;
    }

    return true;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && validateFile(uploadedFile)) {
      onFileSelect(uploadedFile);
    } else if (uploadedFile) {
      onFileSelect(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    if (disabled) return;
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      onFileSelect(droppedFile);
    } else if (droppedFile) {
      onFileSelect(null);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Upload your CSV file</h3>
      
      {validationError && (
        <Alert variant="destructive" className="mb-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
          disabled 
            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
            : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'
        }`}
      >
        {file ? (
          <div className="flex items-center justify-center space-x-3">
            <FileText className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        ) : (
          <div>
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-base font-medium text-gray-700 mb-1">
              Drop your CSV file here
            </p>
            <p className="text-sm text-gray-500 mb-3">
              or click to browse (max {Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB)
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={disabled}
            />
            <Button
              variant="outline"
              onClick={() => !disabled && document.getElementById('file-upload')?.click()}
              className={`border-green-300 text-green-700 hover:bg-green-50 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={disabled}
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
