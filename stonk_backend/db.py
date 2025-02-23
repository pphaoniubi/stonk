import time
import mysql.connector
from mysql.connector import Error
import yfinance as yf
import pandas as pd
from sqlalchemy import create_engine, Table, MetaData, Column, String, Float, Integer, Date, select, delete
from datetime import datetime, timedelta

db_password = '12345678pP!'
def fetch_tickers_from_db():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            database="stonk_db",
            user="root",
            password=db_password
        )
        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute("SELECT ticker, name FROM ticker;")
            tickers_and_names = cursor.fetchall()

            cursor.close()
            conn.close()

            return tickers_and_names

    except Error as e:
        print("Error fetching tickers from database:", e)
        return []


def fetch_and_store_data():
    engine = create_engine(f'mysql+pymysql://root:{db_password}@localhost:3306/stonk_db', echo=True)
    metadata = MetaData()
    connection = engine.connect()
    transaction = connection.begin()

    try:
        stonk = Table('stonk', metadata,
                      Column('id', Integer, autoincrement=True, primary_key=True),
                      Column('Ticker', String(10)),
                      Column('Date', Date),
                      Column('Open', Float),
                      Column('High', Float),
                      Column('Low', Float),
                      Column('Close', Float),
                      Column('Volume', Integer),
                      Column('Name', String(30)))

        metadata.create_all(engine)

        connection.execute(delete(stonk))

        tickers_and_names = fetch_tickers_from_db()

        for ticker, Name in tickers_and_names:
            stock = yf.Ticker(ticker)
            data = stock.history(period="1y", interval="1d")
            data = data.dropna()
            if data.empty:
                print(f"No data returned for {ticker}")
                continue
            
            for index, row in data.iterrows():
                insert_stmt = stonk.insert().values(
                    Ticker=ticker,
                    Date=index.date(),
                    Open=float(row['Open']),
                    High=float(row['High']),
                    Low=float(row['Low']),
                    Close=float(row['Close']),
                    Volume=int(row['Volume']),
                    Name=Name
                )
                connection.execute(insert_stmt)
            time.sleep(0.1)
        transaction.commit()
    except Exception as e:
        transaction.rollback()
        print(f"Error updating data: {e}")
    finally:
        connection.close()

def fetch_data_for_ticker(ticker_symbol : str) -> pd.DataFrame:
    engine = create_engine(f'mysql+pymysql://root:{db_password}@localhost:3306/stonk_db')

    metadata = MetaData()
    stonk = Table('stonk', metadata, autoload_with=engine)
    query = select(stonk).where(stonk.c.Ticker == ticker_symbol)

    with engine.connect() as connection:
        result = connection.execute(query)
        rows = result.fetchall()
        return rows


def fetch_data_for_ticker_as_df(ticker_symbol : str, period : str) -> pd.DataFrame:
    records = fetch_data_for_ticker(ticker_symbol)

    df = pd.DataFrame(records, columns=['id', 'Ticker', 'Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Name'])
    
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)

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