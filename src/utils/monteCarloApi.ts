import axios from 'axios';

interface MonteCarloResult {
  tickers: string[];
  weights: number[];
  sharpe: number;
}

export async function getMonteCarloResults(portfolioId: string): Promise<MonteCarloResult> {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/monte/${portfolioId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Monte Carlo results:', error);
    throw new Error('Failed to fetch Monte Carlo results. Please try again later.');
  }
}