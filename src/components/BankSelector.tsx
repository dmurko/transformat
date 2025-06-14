
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface BankSelectorProps {
  selectedBank: string;
  onBankChange: (bank: string) => void;
  disabled?: boolean;
}

export const BankSelector = ({ selectedBank, onBankChange, disabled = false }: BankSelectorProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select your bank</h3>
      <RadioGroup value={selectedBank} onValueChange={disabled ? undefined : onBankChange}>
        <div className="grid grid-cols-3 gap-4">
          {['N26', 'MetaMask', 'DH'].map((bank) => (
            <div key={bank} className="relative">
              <RadioGroupItem value={bank} id={bank} className="peer sr-only" disabled={disabled} />
              <Label
                htmlFor={bank}
                className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all ${
                  disabled 
                    ? 'cursor-not-allowed opacity-50 bg-gray-50' 
                    : 'cursor-pointer hover:border-green-300'
                } ${
                  selectedBank === bank 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200'
                }`}
              >
                <span className="font-medium">{bank}</span>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};
