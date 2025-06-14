
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { processMetaMaskCSV, processN26CSV, generateOutputCSV, downloadCSV, TransactionData } from '@/utils/csvProcessor';
import { Header } from '@/components/Header';
import { BankSelector } from '@/components/BankSelector';
import { DateSelector } from '@/components/DateSelector';
import { FileUploader } from '@/components/FileUploader';
import { ProcessingButton } from '@/components/ProcessingButton';
import { ResultsCard } from '@/components/ResultsCard';

const Index = () => {
  const [selectedBank, setSelectedBank] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [processedTransactions, setProcessedTransactions] = useState<TransactionData[]>([]);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedBank || !file) return;
    
    setIsProcessing(true);
    
    try {
      const fileContent = await file.text();
      let transactions: TransactionData[] = [];
      
      switch (selectedBank) {
        case 'MetaMask':
          transactions = processMetaMaskCSV(fileContent, startDate);
          break;
        case 'N26':
          transactions = processN26CSV(fileContent, startDate);
          break;
        case 'DH':
          // TODO: Implement DH processing
          toast({
            title: "Not implemented", 
            description: "DH processing is not yet implemented",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        default:
          throw new Error('Unsupported bank selected');
      }
      
      console.log(`Processed ${transactions.length} transactions for ${selectedBank}`);
      setProcessedTransactions(transactions);
      
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
        toast({
          title: "Processing complete!",
          description: `Successfully processed ${transactions.length} transactions`
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error processing file:', error);
      setIsProcessing(false);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An error occurred while processing the file",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (processedTransactions.length === 0) return;
    
    const csvContent = generateOutputCSV(processedTransactions);
    const filename = `${selectedBank}_transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    downloadCSV(csvContent, filename);
    
    toast({
      title: "Download started",
      description: `Downloaded ${filename}`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <Header />

        {/* Main Form */}
        <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <BankSelector selectedBank={selectedBank} onBankChange={setSelectedBank} />
            <DateSelector startDate={startDate} onDateChange={setStartDate} />
            <FileUploader file={file} onFileSelect={setFile} />
            <ProcessingButton 
              isProcessing={isProcessing}
              disabled={!selectedBank || !file || isProcessing}
              onClick={handleSubmit}
            />
          </CardContent>
        </Card>

        <ResultsCard 
          isComplete={isComplete}
          selectedBank={selectedBank}
          transactionCount={processedTransactions.length}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};

export default Index;
