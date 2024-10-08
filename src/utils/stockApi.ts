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

export async function getStockData(symbol: string): Promise<number[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        outputsize: 'full',
        apikey: API_KEY
      }
    });
    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('No time series data available');
    }
    const closePrices = Object.values(timeSeries).map((day: any) => parseFloat(day['4. close']));
    return closePrices.reverse(); // Most recent first
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw new Error(`Failed to fetch data for ${symbol}. Please try again later.`);
  }
}