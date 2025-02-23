import yfinance as yf
import time
from db import *
from sqlalchemy.sql import insert, desc


def fetch_and_store_fundamental():
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
                'Market_Cap': info.get('marketCap')/1000000000,
                'Name': name
            }

            data = {k: v for k, v in data.items() if v is not None}

            if not data:
                print(f"No data returned for {ticker}")
                continue

            stmt = insert(stonk_fundamental).values(data)
            connection.execute(stmt)

            time.sleep(0.1)
        connection.commit()

    except Exception as e:
        connection.rollback()
        print(f"Error updating data: {e}")
    finally:
        connection.close()

def get_fundamental_for_ticker(ticker):
    engine = create_engine(f'mysql+pymysql://root:{db_password}@localhost:3306/stonk_db')

    metadata = MetaData()
    stonk_fundamental = Table('stonk_fundamental', metadata, autoload_with=engine)

    query = select(stonk_fundamental).where(stonk_fundamental.c.Ticker == ticker)

 
    with engine.connect() as connection:
        result = connection.execute(query)
        row = result.fetchone()
        return row

def get_all_fundamentals():
    engine = create_engine(f'mysql+pymysql://root:{db_password}@localhost:3306/stonk_db')

    metadata = MetaData()

    stonk_fundamental = Table('stonk_fundamental', metadata, autoload_with=engine)
    query = select(stonk_fundamental).order_by(desc(stonk_fundamental.c.Market_Cap))

    with engine.connect() as connection:
        result = connection.execute(query)
        rows = result.fetchall()
        fundamentals = [dict(row._mapping) for row in rows]
        return fundamentals