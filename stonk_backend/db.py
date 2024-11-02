import yfinance as yf
import psycopg2
from datetime import datetime

# Connect to PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    dbname="yourdatabase",
    user="yourusername",
    password="yourpassword"
)
cursor = conn.cursor()

# Fetch data using yfinance
ticker = "AAPL"
data = yf.download(ticker, period="1y", interval="1d")
data_csv = data.to_csv()  # Convert DataFrame to CSV string

# Calculate 1-year return
return_1y = ((data['Close'][-1] - data['Close'][0]) / data['Close'][0]) * 100

# SQL Insert
sql = """
    INSERT INTO ticker_data (ticker, data_csv, last_updated, price, return_1y)
    VALUES (%s, %s, %s, %s, %s)
"""
values = (ticker, data_csv, datetime.now(), data['Close'][-1], return_1y)
cursor.execute(sql, values)
conn.commit()

# Close the connection
cursor.close()
conn.close()


def fetch_tickers_from_db():
    try:
        # Connect to your PostgreSQL database
        conn = psycopg2.connect(
            host="localhost",
            dbname="your_database_name",
            user="your_username",
            password="your_password"
        )
        cursor = conn.cursor()

        # Execute SQL query to retrieve all tickers
        cursor.execute("SELECT ticker FROM ticker_data;")
        
        # Fetch all ticker symbols
        tickers = [row[0] for row in cursor.fetchall()]

        # Close cursor and connection
        cursor.close()
        conn.close()

        return tickers
    
    except Exception as e:
        print("Error fetching tickers from database:", e)
        return []
