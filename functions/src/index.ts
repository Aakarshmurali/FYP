import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();

const db = admin.firestore();

export const getStockData = functions.https.onCall(async (data, context) => {
  const { symbol } = data;
  if (!symbol) {
    throw new functions.https.HttpsError('invalid-argument', 'Symbol is required');
  }

  try {
    // Check if we have recent data in Firestore
    const stockRef = db.collection('stockData').doc(symbol);
    const stockDoc = await stockRef.get();
    
    if (stockDoc.exists) {
      const data = stockDoc.data();
      if (data && data.lastUpdated && (Date.now() - data.lastUpdated.toMillis()) < 24 * 60 * 60 * 1000) {
        // If data is less than 24 hours old, return it
        return data.prices;
      }
    }

    // If no recent data, fetch from Yahoo Finance
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`);
    const prices = response.data.chart.result[0].indicators.quote[0].close;

    // Store the data in Firestore
    await stockRef.set({
      prices,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    return prices;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch stock data');
  }
});