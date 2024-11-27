import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
import time
import io
import base64
from io import BytesIO
from db import *

matplotlib.use("Agg")

def calculate_rsi(data: pd.DataFrame, window: int = 14):
    delta = data['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    data['RSI'] = 100 - (100 / (1 + rs))
    return data

def calculate_macd(data: pd.DataFrame):
    # Calculate MACD and Signal line
    data['EMA_12'] = data['Close'].ewm(span=12, adjust=False).mean()
    data['EMA_26'] = data['Close'].ewm(span=26, adjust=False).mean()
    data['MACD'] = data['EMA_12'] - data['EMA_26']
    data['Signal'] = data['MACD'].ewm(span=9, adjust=False).mean()
    data['Histogram'] = data['MACD'] - data['Signal']
    
    return data[['MACD', 'Signal', 'Histogram']]

def calculate_and_plot_bollinger_bands(data: pd.DataFrame, window=20, num_of_std=2):
    data['SMA'] = data['Close'].rolling(window=window).mean()
    data['Std Dev'] = data['Close'].rolling(window=window).std()
    data['Upper Band'] = data['SMA'] + (data['Std Dev'] * num_of_std)
    data['Lower Band'] = data['SMA'] - (data['Std Dev'] * num_of_std)

    plt.figure(figsize=(15, 6))
    plt.plot(data['Close'], label='Close Price', color='blue', alpha=0.5)
    plt.plot(data['SMA'], label='20-Day SMA', color='orange', alpha=0.75)
    plt.plot(data['Upper Band'], label='Upper Band (Bollinger)', color='red', linestyle='--')
    plt.plot(data['Lower Band'], label='Lower Band (Bollinger)', color='green', linestyle='--')
    
    plt.fill_between(data.index, data['Upper Band'], data['Lower Band'], color='lightgray', alpha=0.5)
    
    plt.title('Bollinger Bands')
    plt.xlabel('Date')
    plt.ylabel('Price')
    plt.legend()

    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()

    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    return img_base64

def plot_rsi(data):
    fig, ax = plt.subplots(figsize=(15, 6))
    
    # Plot RSI
    ax.plot(data['RSI'], label='RSI', color='purple')
    ax.axhline(70, color='red', linestyle='--', linewidth=0.5, label='70')
    ax.axhline(50, color='green', linestyle='--', linewidth=0.5, label='50')
    ax.axhline(30, color='green', linestyle='--', linewidth=0.5, label='30')
    ax.set_title('Relative Strength Index (RSI)')
    ax.set_ylabel('RSI')
    ax.set_xlabel('Date')
    ax.legend()
    

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close(fig)
    
    return image_base64


def plot_macd_with_histogram(data):
    fig, ax = plt.subplots(figsize=(15, 6))
    
    ax.plot(data['MACD'], label='MACD', color='blue')
    ax.plot(data['Signal'], label='Signal Line', color='orange')

    # Plot Histogram
    ax.bar(data.index, data['Histogram'], color='green', alpha=0.5, label='Histogram', width=0.4)

    ax.axhline(0, color='black', lw=1, linestyle='--')
    ax.legend()
    ax.set_title('MACD')
    ax.set_xlabel('Date')
    ax.set_ylabel('MACD')
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)


    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close(fig)

    return image_base64


def get_annual_return():
    tickers_and_names = fetch_tickers_from_db()
    returns = []
    for ticker, name in tickers_and_names:
        data = fetch_data_for_ticker_as_df(ticker, period='1y')

        if not data.empty:
            start_price = float(data['Close'].iloc[0])
            end_price = float(data['Close'].iloc[-1])
            annual_return = ((end_price - start_price) / start_price) * 100
            max_price = float(data['Close'].max())
            min_price = float(data['Close'].min())
            maximum_return = ((max_price - min_price) / min_price) * 100
            returns.append({
                'ticker': ticker,
                'annual_return': annual_return,
                'maximum_return': maximum_return
            })

        else:
            print(f"No data available for {ticker}")

    sorted_returns = sorted(returns, key=lambda x: x.get('annual_return', 0), reverse=True)
    return sorted_returns

def get_price_proximity(ticker):
    data = fetch_data_for_ticker_as_df(ticker, period='1y')
    
    if not data.empty:
        current_price = data['Close'].iloc[-1]
        low_price = data['Close'].min()
        proximity_score = (current_price - low_price) / low_price
        return proximity_score
    else:
        return None 
    

def rank_tickers_by_proximity():
    tickers_and_names = fetch_tickers_from_db()
    proximity_scores = {}
    
    for ticker, name in tickers_and_names:
        proximity_score = get_price_proximity(ticker)
        
        if proximity_score is not None:
            proximity_scores[ticker] = proximity_score
        else:
            print(f"No data available for {ticker}")

    sorted_proximity = sorted(proximity_scores.items(), key=lambda x: x[1])

    return sorted_proximity


def get_rsi_ranking():
    tickers_and_names = fetch_tickers_from_db()
    rsi_data = []

    for ticker, name in tickers_and_names:
        data = fetch_data_for_ticker_as_df(ticker, period='1y')
        if not data.empty:
            rsi = calculate_rsi(data)
            rsi_data.append({
                'ticker': ticker,
                'rsi': rsi
            })
        else:
            print(f"No data available for {ticker}")

    sorted_rsi = sorted(rsi_data, key=lambda x: x.get('rsi'))
    print(sorted_rsi)
    return sorted_rsi


def get_past_30_volume(ticker: str):
    data = fetch_data_for_ticker_as_df(ticker, period='1mo')
    plt.figure(figsize=(12.4, 6))
    plt.bar(data.index, data['Volume'], color='blue')
    plt.title(f'Trading Volume for {ticker} - Last 30 Days')
    plt.xlabel('Date')
    plt.ylabel('Volume')
    plt.xticks(rotation=45)
    plt.grid(True)
    plt.tight_layout()

    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()

    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return img_base64

def calculate_volume_ranking():
    tickers_and_names = fetch_tickers_from_db()

    volume_percentage_lst = []

    for ticker, name in tickers_and_names:
        data = fetch_data_for_ticker_as_df(ticker, period='1mo')
        if data.empty:
            print("Data is empty. No volume data to process.")
            return
        average_volume = data['Volume'].mean()
        latest_volume = data['Volume'].iloc[-1]

        if average_volume == 0:
            return "Average volume is zero, cannot calculate percentage difference."
        
        volume_percentage = ((latest_volume - average_volume) / average_volume) * 100

        volume_percentage_lst.append({
                'ticker': ticker,
                'volume_percentage': float(volume_percentage)
        })


    sorted_volume_precentage = sorted(volume_percentage_lst, key=lambda x: x.get('volume_percentage'), reverse=True)
    print(sorted_volume_precentage)
    return sorted_volume_precentage
