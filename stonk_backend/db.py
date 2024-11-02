import mysql.connector
from mysql.connector import Error


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