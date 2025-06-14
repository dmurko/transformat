
import React, { useState } from 'react';
import { Upload, FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [selectedBank, setSelectedBank] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    }
  };

  const handleSubmit = async () => {
    if (!selectedBank || !file) return;
    
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Transformator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your raw bank CSV files into perfectly formatted data for your personal finance app
          </p>
        </div>

        {/* Main Form */}
        <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Bank Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select your bank</h3>
              <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
                <div className="grid grid-cols-3 gap-4">
                  {['N26', 'Revolut', 'DH'].map((bank) => (
                    <div key={bank} className="relative">
                      <RadioGroupItem value={bank} id={bank} className="peer sr-only" />
                      <Label
                        htmlFor={bank}
                        className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-green-300 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700"
                      >
                        <span className="font-medium">{bank}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* File Upload */}
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

            {/* Submit Button */}
            <div className="text-center">
              <Button
                onClick={handleSubmit}
                disabled={!selectedBank || !file || isProcessing}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Transform File'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className={`transition-all duration-700 transform ${isComplete ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${isComplete ? 'block' : 'hidden'}`}>
          <Card className="max-w-2xl mx-auto mt-8 shadow-2xl border-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <Download className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Transformation Complete!</h3>
                <p className="text-green-100">
                  Your {selectedBank} transactions have been successfully processed
                </p>
              </div>
              <Button
                variant="secondary"
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 py-3 shadow-lg"
                onClick={() => {
                  // This will be implemented later with actual file processing
                  console.log('Download processed file');
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Processed File
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
