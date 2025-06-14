
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcessingButtonProps {
  isProcessing: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const ProcessingButton = ({ isProcessing, disabled, onClick }: ProcessingButtonProps) => {
  return (
    <div className="text-center">
      <Button
        onClick={onClick}
        disabled={disabled}
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
  );
};
