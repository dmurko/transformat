
import { validateCSVStructure, sanitizeCSVCell } from './securityUtils';
import { parseCSVLine, findColumnIndices, validateRequiredColumns } from './csvParser';

export interface TransactionData {
  date: string;
  payee: string;
  amount: string;
}

export const processMetaMaskCSV = (csvContent: string, startDate?: Date): TransactionData[] => {
  // Validate CSV structure first
  if (!validateCSVStructure(csvContent)) {
    throw new Error('Invalid CSV file structure');
  }

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
      payee: sanitizeCSVCell(merchant),
      amount: `-${amount.toFixed(2)}` // Negative because these are expenses
    });
  }
  
  return transactions;
};

export const processN26CSV = (csvContent: string, startDate?: Date): TransactionData[] => {
  // Validate CSV structure first
  if (!validateCSVStructure(csvContent)) {
    throw new Error('Invalid CSV file structure');
  }

  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  // Find the indices of the required columns
  const requiredColumns = ['Value Date', 'Partner Name', 'Amount (EUR)'];
  const [valueDateIndex, partnerNameIndex, amountIndex] = findColumnIndices(headers, requiredColumns);
  
  validateRequiredColumns([valueDateIndex, partnerNameIndex, amountIndex], requiredColumns);
  
  const transactions: TransactionData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue; // Skip empty lines
    
    // Parse CSV line accounting for quoted fields
    const columns = parseCSVLine(line);
    
    if (columns.length <= Math.max(valueDateIndex, partnerNameIndex, amountIndex)) {
      continue; // Skip malformed rows
    }
    
    const valueDate = columns[valueDateIndex]?.trim().replace(/"/g, '');
    const partnerName = columns[partnerNameIndex]?.trim().replace(/"/g, '');
    const amountStr = columns[amountIndex]?.trim().replace(/"/g, '');
    
    if (!valueDate || !partnerName || !amountStr) {
      continue; // Skip if essential data is missing
    }
    
    // Parse date from value date (format: YYYY-MM-DD)
    const transactionDate = new Date(valueDate);
    
    // Filter by start date if provided
    if (startDate && transactionDate < startDate) {
      continue;
    }
    
    // Parse amount
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      continue; // Skip if amount is not a valid number
    }
    
    // Format date as YYYY/MM/DD to match output format
    const formattedDate = valueDate.replace(/-/g, '/');
    
    transactions.push({
      date: formattedDate,
      payee: sanitizeCSVCell(partnerName),
      amount: amount.toFixed(2)
    });
  }
  
  return transactions;
};

export const processDHCSV = (csvContent: string, startDate?: Date): TransactionData[] => {
  // Validate CSV structure first
  if (!validateCSVStructure(csvContent)) {
    throw new Error('Invalid CSV file structure');
  }

  const lines = csvContent.trim().split('\n');
  
  // Find the header line that contains the column names
  let headerLineIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Datum valute') && lines[i].includes('Prejemnik')) {
      headerLineIndex = i;
      break;
    }
  }
  
  if (headerLineIndex === -1) {
    throw new Error('Required columns not found in CSV file. Expected: Datum valute, Prejemnik, Breme, Dobro');
  }
  
  const headers = lines[headerLineIndex].split(';');
  
  // Find the indices of the required columns
  const datumValuteIndex = headers.findIndex(h => h.trim() === 'Datum valute');
  const prejemnikIndex = headers.findIndex(h => h.trim().includes('Prejemnik'));
  const bremeIndex = headers.findIndex(h => h.trim() === 'Breme');
  const dobroIndex = headers.findIndex(h => h.trim() === 'Dobro');
  
  if (datumValuteIndex === -1 || prejemnikIndex === -1 || bremeIndex === -1 || dobroIndex === -1) {
    throw new Error('Required columns not found in CSV file. Expected: Datum valute, Prejemnik, Breme, Dobro');
  }
  
  const transactions: TransactionData[] = [];
  
  // Start processing from the line after the header
  for (let i = headerLineIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || !line.includes(';')) continue; // Skip empty lines or lines without semicolons
    
    const columns = line.split(';');
    
    if (columns.length <= Math.max(datumValuteIndex, prejemnikIndex, bremeIndex, dobroIndex)) {
      continue; // Skip malformed rows
    }
    
    const datumValute = columns[datumValuteIndex]?.trim();
    const prejemnik = columns[prejemnikIndex]?.trim();
    const bremeStr = columns[bremeIndex]?.trim();
    const dobroStr = columns[dobroIndex]?.trim();
    
    if (!datumValute || !prejemnik) {
      continue; // Skip if essential data is missing
    }
    
    // Parse date from datum valute (format: DD.MM.YYYY)
    const dateParts = datumValute.split('.');
    if (dateParts.length !== 3) {
      continue; // Skip if date format is incorrect
    }
    
    const transactionDate = new Date(
      parseInt(dateParts[2]), // year
      parseInt(dateParts[1]) - 1, // month (0-indexed)
      parseInt(dateParts[0]) // day
    );
    
    // Filter by start date if provided
    if (startDate && transactionDate < startDate) {
      continue;
    }
    
    // Parse amounts - handle both Breme (negative) and Dobro (positive)
    let amount = 0;
    
    if (bremeStr && bremeStr !== '') {
      // Parse Breme amount (negative)
      const bremeAmount = parseFloat(bremeStr.replace(/\./g, '').replace(',', '.'));
      if (!isNaN(bremeAmount)) {
        amount = -bremeAmount;
      }
    } else if (dobroStr && dobroStr !== '') {
      // Parse Dobro amount (positive)
      const dobroAmount = parseFloat(dobroStr.replace(/\./g, '').replace(',', '.'));
      if (!isNaN(dobroAmount)) {
        amount = dobroAmount;
      }
    }
    
    if (amount === 0) {
      continue; // Skip if no valid amount found
    }
    
    // Format date as YYYY/MM/DD to match output format
    const formattedDate = `${dateParts[2]}/${dateParts[1].padStart(2, '0')}/${dateParts[0].padStart(2, '0')}`;
    
    transactions.push({
      date: formattedDate,
      payee: sanitizeCSVCell(prejemnik),
      amount: amount.toFixed(2)
    });
  }
  
  return transactions;
};
