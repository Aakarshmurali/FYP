import axios from 'axios';

interface MVOResult {
  tickers: string[];
  weights: number[];
  sharpe: number;
  annualVolatility: number;
  expectedAnnualReturn: number;
}

export async function getMVOResults(portfolioId: string): Promise<MVOResult> {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/mvo/${portfolioId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching MVO results:', error);
    throw new Error('Failed to fetch MVO results. Please try again later.');
  }
}