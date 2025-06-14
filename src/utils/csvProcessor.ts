
export interface TransactionData {
  date: string;
  payee: string;
  amount: string;
}

export const processMetaMaskCSV = (csvContent: string, startDate?: Date): TransactionData[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  // Find the indices of the required columns
  const timestampIndex = headers.findIndex(h => h.trim() === 'Timestamp');
  const merchantIndex = headers.findIndex(h => h.trim() === 'Merchant');
  const fundingTokensIndex = headers.findIndex(h => h.trim() === 'Funding Tokens');
  
  if (timestampIndex === -1 || merchantIndex === -1 || fundingTokensIndex === -1) {
    throw new Error('Required columns not found in CSV file');
  }
  
  const transactions: TransactionData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(',');
    
    if (columns.length < Math.max(timestampIndex, merchantIndex, fundingTokensIndex) + 1) {
      continue; // Skip malformed rows
    }
    
    const timestamp = columns[timestampIndex].trim();
    const merchant = columns[merchantIndex].trim();
    const fundingTokens = columns[fundingTokensIndex].trim();
    
    // Parse date from timestamp (format: YYYY-MM-DD)
    const transactionDate = new Date(timestamp);
    
    // Filter by start date if provided
    if (startDate && transactionDate < startDate) {
      continue;
    }
    
    // Extract amount from funding tokens (first number before "usdc")
    const amountMatch = fundingTokens.match(/^([\d.]+)\s+usdc/);
    if (!amountMatch) {
      continue; // Skip if we can't extract amount
    }
    
    const amount = parseFloat(amountMatch[1]);
    
    // Format date as YYYY/MM/DD to match output format
    const formattedDate = timestamp.replace(/-/g, '/');
    
    transactions.push({
      date: formattedDate,
      payee: merchant,
      amount: `-${amount.toFixed(2)}` // Negative because these are expenses
    });
  }
  
  return transactions;
};

export const generateOutputCSV = (transactions: TransactionData[]): string => {
  const headers = ['Date', 'Payee', 'Amount'];
  const csvLines = [headers.join(',')];
  
  transactions.forEach(transaction => {
    const line = [
      transaction.date,
      transaction.payee,
      transaction.amount
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
  }
};
