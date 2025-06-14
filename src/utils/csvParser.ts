
// Helper function to parse CSV line with quoted fields
export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // Add the last field
  return result;
};

// Find column indices in CSV headers
export const findColumnIndices = (headers: string[], columnNames: string[]): number[] => {
  return columnNames.map(name => headers.findIndex(h => h.trim().replace(/"/g, '') === name));
};

// Validate that all required columns exist
export const validateRequiredColumns = (indices: number[], columnNames: string[]): void => {
  const missingColumns = columnNames.filter((_, index) => indices[index] === -1);
  if (missingColumns.length > 0) {
    throw new Error(`Required columns not found in CSV file: ${missingColumns.join(', ')}`);
  }
};
