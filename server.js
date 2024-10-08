const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

app.get('/stock/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1y&interval=1d`);
    
    const stockData = response.data.chart.result[0];
    const timestamps = stockData.timestamp;
    const quotes = stockData.indicators.quote[0];
    
    const formattedData = timestamps.map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      close: quotes.close[index],
      volume: quotes.volume[index],
      open: quotes.open[index],
      high: quotes.high[index],
      low: quotes.low[index],
      symbol: ticker
    }));

    res.json({ data: formattedData });
  } catch (error) {
    console.error(`Error fetching data for ${req.params.ticker}:`, error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.listen(port, () => {
  console.log(`Stock data server listening at http://localhost:${port}`);
});