/**
 * Format a date string to a more readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  // Format options
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-PH', options);
}

/**
 * Format a price to Philippine Peso
 * @param {number} price - The price to format
 * @returns {string} Formatted price with peso sign
 */
export function formatPrice(price) {
  if (price === undefined || price === null) return 'N/A';
  
  return `₱${parseFloat(price).toFixed(2)}`;
}
