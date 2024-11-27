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
                'Market_Cap': info.get('marketCap'),
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

fetch_and_store_fundamental()