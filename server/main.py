from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/stock/{ticker}")
async def get_stock_data(ticker: str):
    try:
        # Get data for the past year
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        
        # Fetch the stock data
        stock = yf.Ticker(ticker)
        df = stock.history(start=start_date, end=end_date)
        
        # Reset index to make date a column
        df = df.reset_index()
        
        # Rename columns to match the desired format
        df = df.rename(columns={
            "Date": "date",
            "Close": "close",
            "Volume": "volume",
            "Open": "open",
            "High": "high",
            "Low": "low"
        })
        
        # Add symbol column
        df["symbol"] = ticker
        
        # Select and order columns as per the desired format
        df = df[["date", "close", "volume", "open", "high", "low", "symbol"]]
        
        # Convert date to string format
        df["date"] = df["date"].dt.strftime("%Y-%m-%d")
        
        # Convert DataFrame to list of dictionaries
        data = df.to_dict("records")
        
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)