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

def get_stock_data(ticker: str, period: str = '1y', interval: str = '1d') -> pd.DataFrame:
    stock = yf.Ticker(ticker)
    data = stock.history(period=period, interval=interval)
    return data


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
    data['Histogram'] = data['MACD'] - data['Signal']  # This is the histogram
    
    # Drop helper columns to keep only necessary ones
    return data[['MACD', 'Signal', 'Histogram']]

def calculate_and_plot_bollinger_bands(data: pd.DataFrame, window=20, num_of_std=2):
    # Calculate the Simple Moving Average (SMA)
    data['SMA'] = data['Close'].rolling(window=window).mean()

    # Calculate the standard deviation
    data['Std Dev'] = data['Close'].rolling(window=window).std()

    # Calculate the upper and lower Bollinger Bands
    data['Upper Band'] = data['SMA'] + (data['Std Dev'] * num_of_std)
    data['Lower Band'] = data['SMA'] - (data['Std Dev'] * num_of_std)

    # Plotting the close price and Bollinger Bands
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

    # Save the figure to a BytesIO object
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)  # Go to the start of the BytesIO buffer
    plt.close()  # Close the plot to free memory

    # Convert the image to base64
    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    # Return the base64 string to be sent to the controller
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
    
    # Save the plot to a BytesIO buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close(fig)  # Close the figure to free memory
    
    return image_base64


def check_rsi_below_30_yesterday(ticker, df):
    # Calculate RSI
    df = calculate_rsi(ticker, df)

    # Get yesterday's RSI
    if len(df) > 1:  # Ensure we have enough data points
        yesterdays_rsi = df['RSI'].iloc[-2]
        if yesterdays_rsi < 30:
            print(f"({ticker})'s RSI ({yesterdays_rsi}) was below 30")
        #else: 
            #print(f"({ticker})'s RSI ({yesterdays_rsi}) was above 30")
    else:
        print("Not enough data to check yesterday's RSI.")

def get_20_lowest(ticker, df):
    lowest_prices_df = df.nsmallest(20, 'Close')
    
    print(f'{ticker}: 20 lowests:')
    print(f'{lowest_prices_df['Close']}')

def plot_macd_with_histogram(data):
    fig, ax = plt.subplots(figsize=(15, 6))
    
    # Plot MACD and Signal lines
    ax.plot(data['MACD'], label='MACD', color='blue')
    ax.plot(data['Signal'], label='Signal Line', color='orange')

    # Plot Histogram
    ax.bar(data.index, data['Histogram'], color='green', alpha=0.5, label='Histogram', width=0.4)

    ax.axhline(0, color='black', lw=1, linestyle='--')  # Add a horizontal line at 0
    ax.legend()
    ax.set_title('MACD Indicator with Histogram')
    ax.set_xlabel('Date')
    ax.set_ylabel('MACD')
    
    # Save the plot to a BytesIO buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)

    # Encode the buffer to a base64 string
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close(fig)  # Close the figure to free memory

    return image_base64

def constant_check(period, interval):
    while (True):
        stocks_i_hold = ["td.to", "etc-usd", "eth-usd", "ac.to"]
        for stock in stocks_i_hold:
                stock_data = yf.Ticker(stock)
                data = stock_data.history(period, interval=interval)
                lowest_close = data['Close'].min()
                low_threshold = lowest_close * 1.05
                current_close = data['Close'].iloc[-1]
                if current_close < low_threshold:
                    print(f"{stock} is below lowest * 1.05 -- current value is {current_close} --- 3 mo low is {lowest_close}")


        time.sleep(1800)

def get_returns():
    tickers_and_names = fetch_tickers_from_db()
    returns = {}

    for ticker, name in tickers_and_names:
        print(ticker)
        # Fetch data
        data = fetch_data_for_ticker_as_df(ticker)
        
        # Check if data is available
        if not data.empty:
            # Calculate return
            start_price = float(data['Close'].iloc[0])            ########
            end_price = float(data['Close'].iloc[-1])
            annual_return = ((end_price - start_price) / start_price) * 100
            returns[ticker] = annual_return
        else:
            returns[ticker] = None
            print(f"No data available for {ticker}")

    # Sort the returns in descending order
    sorted_returns = sorted(returns.items(), key=lambda x: x[1], reverse=True)

    # Display sorted results
    for ticker, ret in sorted_returns:
        if ret is not None:
            print(f"The annual return for {ticker} is {ret:.2f}%")
        else:
            print(f"No return data available for {ticker}")

