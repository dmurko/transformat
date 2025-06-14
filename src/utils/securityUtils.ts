
// Security utilities for CSV processing
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

// Sanitize cell values to prevent CSV injection
export const sanitizeCSVCell = (value: string): string => {
  if (!value || typeof value !== 'string') return '';
  
  // Check if the cell starts with dangerous characters
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
  const firstChar = value.charAt(0);
  
  if (dangerousChars.includes(firstChar)) {
    // Prefix with single quote to neutralize formula injection
    return `'${value}`;
  }
  
  // Escape any existing quotes by doubling them
  return value.replace(/"/g, '""');
};

// Validate file size
export const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

// Validate file extension
export const validateFileExtension = (file: File): boolean => {
  const allowedExtensions = ['.csv'];
  const fileName = file.name.toLowerCase();
  return allowedExtensions.some(ext => fileName.endsWith(ext));
};

// Basic CSV structure validation
export const validateCSVStructure = (content: string): boolean => {
  if (!content || content.trim().length === 0) return false;
  
  const lines = content.split('\n');
  if (lines.length < 2) return false; // Must have at least header + 1 data row
  
  // Check for suspiciously long lines (potential attack)
  const maxLineLength = 10000;
  return lines.every(line => line.length <= maxLineLength);
};

// Sanitize error messages for user display
export const sanitizeErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Remove potentially sensitive information from error messages
    const message = error.message;
    
    // Common patterns to sanitize
    const sanitizedMessage = message
      .replace(/file:\/\/.*?:/g, '') // Remove file paths
      .replace(/at\s+.*?\s+\(/g, '') // Remove stack trace info
      .replace(/\(.*?:\d+:\d+\)/g, '') // Remove line numbers
      .trim();
    
    return sanitizedMessage || 'An error occurred while processing the file';
  }
  
  return 'An unexpected error occurred';
};
