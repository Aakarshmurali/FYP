import axios from 'axios';

const API_KEY = 'Z9HNOQH4LCHFZXMK';
const API_BASE_URL = 'https://www.alphavantage.co/query';

export async function validateTicker(symbol: string): Promise<boolean> {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: symbol,
        apikey: API_KEY
      }
    });
    const matches = response.data.bestMatches;
    return matches && matches.length > 0 && matches[0]['1. symbol'] === symbol;
  } catch (error) {
    console.error(`Error validating ticker ${symbol}:`, error);
    return false;
  }
}
