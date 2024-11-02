import mysql.connector
from mysql.connector import Error
import yfinance as yf

def fetch_and_store_data():
    try:
        # Connect to PostgreSQL (use mysql.connector.connect for MySQL)
        conn = mysql.connector.connect(
            host="localhost",
            database="stonk_db",
            user="root",
            password="12345678pP!"
        )
        cursor = conn.cursor()

        # Query the database to get the list of tickers
        cursor.execute("SELECT ticker FROM stonk;")
        tickers = [row[0] for row in cursor.fetchall()]

        # Fetch and store CSV data for each ticker
        for ticker in tickers:
            print(f"Fetching data for {ticker}")
            stock_data = yf.download(ticker, period="1y", interval="1d")
            csv_data = stock_data.to_csv(index=True)

            # Update data_csv column for each ticker
            cursor.execute("""
                UPDATE stonk
                SET data_csv = %s
                WHERE ticker = %s;
            """, (csv_data, ticker))
        # Commit the transaction
        conn.commit()

        # Close connection
        cursor.close()
        conn.close()

        print("Data updated successfully.")

    except Exception as e:
        print("Error updating data:", e)



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
            cursor.execute("SELECT ticker FROM stonk;")
            
            # Fetch all ticker symbols
            tickers = [row[0] for row in cursor.fetchall()]

            # Close cursor and connection
            cursor.close()
            conn.close()

            return tickers

    except Error as e:
        print("Error fetching tickers from database:", e)
        return []