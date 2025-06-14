
import { sanitizeCSVCell } from './securityUtils';
import { TransactionData } from './bankProcessors';

export const generateOutputCSV = (transactions: TransactionData[]): string => {
  const headers = ['Date', 'Payee', 'Amount'];
  const csvLines = [headers.join(',')];
  
  transactions.forEach(transaction => {
    const line = [
      sanitizeCSVCell(transaction.date),
      `"${sanitizeCSVCell(transaction.payee)}"`, // Quote payee field to handle commas
      sanitizeCSVCell(transaction.amount)
    ].join(',');
    csvLines.push(line);
  });
  
  return csvLines.join('\n');
};

export const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
};
