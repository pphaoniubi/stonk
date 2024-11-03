import mysql.connector
from mysql.connector import Error
import yfinance as yf
from io import StringIO
import pandas as pd
from sqlalchemy import create_engine


def fetch_tickers_from_db():
    try:
        # Connect to your MySQL database
        conn = mysql.connector.connect(
            host="localhost",
            database="stonk_db",
            user="root",
            password="12345678pP!"
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Execute SQL query to retrieve all tickers
            cursor.execute("SELECT ticker, name FROM stonk;")
            
            # Fetch all ticker symbols
            tickers_and_names = cursor.fetchall()

            # Close cursor and connection
            cursor.close()
            conn.close()

            return tickers_and_names

    except Error as e:
        print("Error fetching tickers from database:", e)
        return []
    
def fetch_and_store_data():
    try:
        engine = create_engine('mysql+pymysql://root:12345678pP!@localhost:3306/stonk_db')
        tickers_and_names = fetch_tickers_from_db()
        for ticker, Name in tickers_and_names:
            stock = yf.Ticker(ticker)
            data = stock.history(period="1y", interval="1d")

            for index, row in data.iterrows():
                data = data.drop(columns=["Dividends", "Stock Splits"])
                data['Ticker'] = ticker
                data['Name'] = Name
                data.reset_index(inplace=True)
                data = data[['Ticker', 'Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Name']]  # Reorder and select relevant columns
                data.to_sql(name='stonk', con=engine, index=False, if_exists='append', chunksize=1000)
            
        print("Success")
    
    except Exception as e:
        print("Error updating data:", e)

fetch_and_store_data()

def get_csv_from_db(ticker):
    conn = mysql.connector.connect(
    host="localhost",
    database="stonk_db",
    user="root",
    password="12345678pP!"
    )
    cursor = conn.cursor()

    # Fetch the CSV data from the database
    cursor.execute("SELECT data_csv FROM stonk WHERE ticker = %s;", (ticker,))
    csv_data = cursor.fetchone()[0]  # Assuming 'data_csv' is the first column

    data = StringIO(csv_data)  # Convert string data to a file-like object
    df = pd.read_csv(data)


    # Close the cursor and connection
    cursor.close()
    conn.close()
    
    return df