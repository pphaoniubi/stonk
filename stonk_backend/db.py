import mysql.connector
from mysql.connector import Error
import yfinance as yf
import pandas as pd
from sqlalchemy import create_engine, Table, MetaData, Column, String, Float, Integer, Date, select
from datetime import datetime, timedelta

db_password = '123456'
def fetch_tickers_from_db():
    try:
        # Connect to your MySQL database
        conn = mysql.connector.connect(
            host="localhost",
            database="stonk_db",
            user="root",
            password=db_password
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Execute SQL query to retrieve all tickers
            cursor.execute("SELECT ticker, name FROM ticker;")
            
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
    # Connection and engine setup
    engine = create_engine(f'mysql+pymysql://root:{db_password}@localhost:3306/stonk_db', echo=True)
    metadata = MetaData()
    connection = engine.connect()
    transaction = connection.begin()

    try:
        stonk = Table('stonk', metadata,
                      Column('id', Integer, autoincrement=True, primary_key=True),  # Adjusted for new primary key
                      Column('Ticker', String(10)),
                      Column('Date', Date),
                      Column('Open', Float),
                      Column('High', Float),
                      Column('Low', Float),
                      Column('Close', Float),
                      Column('Volume', Integer),
                      Column('Name', String(30)))

        metadata.create_all(engine)
        tickers_and_names = fetch_tickers_from_db()

        for ticker, Name in tickers_and_names:
            stock = yf.Ticker(ticker)
            data = stock.history(period="1y", interval="1d")
            if data.empty:
                print(f"No data returned for {ticker}")
                continue
            
            # Prepare and execute insert statements for each day's data
            for index, row in data.iterrows():
                insert_stmt = stonk.insert().values(
                    Ticker=ticker,
                    Date=index.date(),
                    Open=float(row['Open']),
                    High=float(row['High']),
                    Low=float(row['Low']),
                    Close=float(row['Close']),
                    Volume=int(row['Volume']),  # Ensure type consistency
                    Name=Name
                )
                connection.execute(insert_stmt) 
        transaction.commit()

    except Exception as e:
        transaction.rollback()
        print(f"Error updating data: {e}")
    finally:
        connection.close()


def fetch_data_for_ticker(ticker_symbol : str) -> pd.DataFrame:
    engine = create_engine(f'mysql+pymysql://root:{db_password}@localhost:3306/stonk_db')

    # Bind metadata to the existing database
    metadata = MetaData()

    # Reflect the table from the database
    stonk = Table('stonk', metadata, autoload_with=engine)

    # Create a select statement
    query = select(stonk).where(stonk.c.Ticker == ticker_symbol)

    # Execute the query
    with engine.connect() as connection:
        result = connection.execute(query)
        # Fetch all results
        rows = result.fetchall()
        return rows


def fetch_data_for_ticker_as_df(ticker_symbol : str, period : str) -> pd.DataFrame:
    records = fetch_data_for_ticker(ticker_symbol)
    # Convert records to a DataFrame
    df = pd.DataFrame(records, columns=['id', 'Ticker', 'Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Name'])
    
    # df = df.dropna(subset=['Open'])
    df['Date'] = pd.to_datetime(df['Date'])  # Ensure 'Date' is a datetime type
    df.set_index('Date', inplace=True)  # Set 'Date' as the index

    if period == '6mo':
        six_months_date = datetime.now() - timedelta(days=182)
        df = df[df.index >= six_months_date]
    
    elif period == '3mo':
        three_months_date = datetime.now() - timedelta(days=91)
        df = df[df.index >= three_months_date]
    elif period == '1mo':
        one_months_date = datetime.now() - timedelta(days=30)
        df = df[df.index >= one_months_date]

    return df