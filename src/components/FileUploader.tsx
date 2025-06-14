
import React from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const FileUploader = ({ file, onFileSelect }: FileUploaderProps) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      onFileSelect(uploadedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      onFileSelect(droppedFile);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload your CSV file</h3>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all hover:border-green-400 hover:bg-green-50/50"
      >
        {file ? (
          <div className="flex items-center justify-center space-x-3">
            <FileText className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        ) : (
          <div>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your CSV file here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse your files
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
