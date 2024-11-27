import yfinance as yf
import time
from db import *
from sqlalchemy.sql import insert


def fetch_and_store_fundamental():
    # Connection and engine setup
    engine = create_engine(f'mysql+pymysql://root:{db_password}@localhost:3306/stonk_db', echo=True)
    metadata = MetaData()
    connection = engine.connect()

    try:
        stonk_fundamental = Table('stonk_fundamental', metadata,
                      Column('id', Integer, autoincrement=True, primary_key=True),
                      Column('Ticker', String(10)),
                      Column('PE_Ratio', Float),
                      Column('EPS', Float),
                      Column('Dividend_Yield', Float),
                      Column('Market_Cap', Float),
                      Column('Name', String(30)))

        metadata.create_all(engine)

        connection.execute(delete(stonk_fundamental))
    
        tickers_and_names = fetch_tickers_from_db()

        for ticker, name in tickers_and_names:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            data = {
                'Ticker': ticker,
                'PE_Ratio': info.get('trailingPE'),
                'EPS': info.get('trailingEps'),
                'Dividend_Yield': info.get('dividendYield'),
                'Market_Cap': info.get('marketCap')/1000000,
                'Name': name
            }

            data = {k: v for k, v in data.items() if v is not None}

            if not data:
                print(f"No data returned for {ticker}")
                continue

            stmt = insert(stonk_fundamental).values(data)
            connection.execute(stmt)

            time.sleep(0.3)
        connection.commit()

    except Exception as e:
        connection.rollback()
        print(f"Error updating data: {e}")
    finally:
        connection.close()

def get_fundamental_for_ticker(ticker):
    engine = create_engine(f'mysql+pymysql://root:{db_password}@localhost:3306/stonk_db')

    # Bind metadata to the existing database
    metadata = MetaData()

    # Reflect the table from the database
    stonk_fundamental = Table('stonk_fundamental', metadata, autoload_with=engine)

    # Create a select statement
    query = select(stonk_fundamental).where(stonk_fundamental.c.Ticker == ticker)

    # Execute the query
    with engine.connect() as connection:
        result = connection.execute(query)
        # Fetch all results
        row = result.fetchone()
        return row

def get_all_fundamentals():
    engine = create_engine(f'mysql+pymysql://root:{db_password}@localhost:3306/stonk_db')

    # Bind metadata to the existing database
    metadata = MetaData()

    # Reflect the table from the database
    stonk_fundamental = Table('stonk_fundamental', metadata, autoload_with=engine)
    query = select(stonk_fundamental)

    with engine.connect() as connection:
        result = connection.execute(query)
        # Fetch all results
        rows = result.fetchall()
        fundamentals = [dict(row._mapping) for row in rows]
        # Return or process the results
        return fundamentals