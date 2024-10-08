// Mock API service to simulate optimization results
const mockOptimizationApi = {
  getOptimizationResults: async (portfolioId: string): Promise<any> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data based on the portfolio ID
    const mockData = {
      "Nkkjw13FbXauvoDyDJCX": {
        "tickers": ["AAPL", "IBM", "NVDA", "RACE"],
        "weights": [0.0151409404821647, 0.0444184623618275, 0.916240874032088, 0.0241997231239194],
        "sharpe": 1.13036553082565
      },
      // Add more mock data for other portfolio IDs if needed
    };

    if (mockData[portfolioId]) {
      return mockData[portfolioId];
    } else {
      throw new Error("Portfolio not found");
    }
  }
};

export default mockOptimizationApi;