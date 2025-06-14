
import React from 'react';
import { Download, RefreshCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ResultsCardProps {
  isComplete: boolean;
  selectedBank: string;
  transactionCount: number;
  onDownload: () => void;
  onNewTransformation: () => void;
}

export const ResultsCard = ({ isComplete, selectedBank, transactionCount, onDownload, onNewTransformation }: ResultsCardProps) => {
  const hasNoData = transactionCount === 0;

  return (
    <div className={`transition-all duration-700 transform ${isComplete ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${isComplete ? 'block' : 'hidden'}`}>
      <Card className={`max-w-2xl mx-auto mt-8 shadow-2xl border-0 ${hasNoData ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-emerald-500'} text-white`}>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              {hasNoData ? (
                <AlertCircle className="h-8 w-8" />
              ) : (
                <Download className="h-8 w-8" />
              )}
            </div>
            {hasNoData ? (
              <>
                <h3 className="text-2xl font-bold mb-2">No Data Found!</h3>
                <p className="text-red-100">
                  No transactions were found in your {selectedBank} file for the starting date.
                </p>
                <p className="text-red-100 text-sm mt-2">
                  Please choose a different starting date.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-2">Transformation Complete!</h3>
                <p className="text-green-100">
                  Your {selectedBank} transactions have been successfully processed
                </p>
                <p className="text-green-100 text-sm mt-2">
                  {transactionCount} transactions processed
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!hasNoData && (
              <Button
                variant="secondary"
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 py-3 shadow-lg"
                onClick={onDownload}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Processed File
              </Button>
            )}
            <Button
              variant="outline"
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-current font-semibold px-6 py-3 shadow-lg"
              onClick={onNewTransformation}
            >
              <RefreshCcw className="mr-2 h-5 w-5" />
              New Transformation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
