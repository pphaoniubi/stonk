# app.py

from fastapi import FastAPI, HTTPException
from stock_utils import *
from pydantic import BaseModel
from typing import Optional
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


# Allow CORS
origins = [
    "http://localhost:3000",  # React app on localhost:3000
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockRequest(BaseModel):
    ticker: str
    period: Optional[str] = '1y'  # Defaults to 1 year
    interval: Optional[str] = '1d'  # Defaults to daily data


@app.get("/")
def read_root():
    return {"message": "Welcome to the Stock Analysis API"}


@app.post("/stock/macd")
def get_macd(request: StockRequest):
    data = get_stock_data(request.ticker, request.period, request.interval)
    if data.empty:
        raise HTTPException(status_code=404, detail="Stock data not found.")
    macd_data = calculate_macd(data)
    return macd_data.dropna().to_dict(orient='records')


@app.post("/stock/rsi")
def get_rsi(request: StockRequest):
    data = get_stock_data(request.ticker, request.period, request.interval)
    if data.empty:
        raise HTTPException(status_code=404, detail="Stock data not found.")
    rsi_data = calculate_rsi(data)
    return rsi_data.dropna().to_dict()

@app.post("/stock/macd-rsi")
async def get_macd_graph(request: StockRequest):

    data = get_stock_data(request.ticker, request.period, request.interval)
    
    # Calculate MACD and plot
    macd_data = calculate_macd(data)
    macd_image = plot_macd_with_histogram(macd_data)

    # calculate RSI
    rsi_data = calculate_rsi(data)
    rsi_image = plot_rsi(rsi_data)
    
    
    return JSONResponse(content={
        "macd_image": macd_image,
        "rsi_image": rsi_image 
    })

@app.post("/stock/high-low-current")
async def get_high_low_current(request: StockRequest):
    data = get_stock_data(request.ticker, request.period, request.interval)

    # Calculate high, low, and current price for the period
    highest_price = data['High'].max()
    lowest_price = data['Low'].min()
    current_price = data['Close'].iloc[-1]  # Last closing price

    return JSONResponse(content={"highest_price": highest_price, "lowest_price": lowest_price, "current_price": current_price})


@app.post("/stock/bollingerband")
async def get_candlestick_chart(request: StockRequest):
    try:
        data = get_stock_data(request.ticker, request.period, request.interval)
        bollingerband_image = calculate_and_plot_bollinger_bands(data)
        # Return the image data
        return {"bollingerband_image": bollingerband_image}
    except ValueError as ve:
        # Handle specific errors related to stock data
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        # Handle generic errors
        raise HTTPException(status_code=500, detail="An error occurred while generating the candlestick chart.")