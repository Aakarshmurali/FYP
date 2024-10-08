// Generate random stock data
function generateRandomStockData(days: number): number[] {
  const startPrice = Math.random() * 100 + 50; // Random start price between 50 and 150
  const data: number[] = [startPrice];
  
  for (let i = 1; i < days; i++) {
    const change = (Math.random() - 0.5) * 5; // Random change between -2.5 and 2.5
    const newPrice = Math.max(0, data[i-1] + change); // Ensure price doesn't go below 0
    data.push(Number(newPrice.toFixed(2)));
  }
  
  return data;
}

export async function getStockData(symbol: string): Promise<number[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate 252 days of mock data (approximately one trading year)
  return generateRandomStockData(252);
}

export async function validateTicker(symbol: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Randomly validate the ticker (80% chance of being valid)
  return Math.random() < 0.8;
}