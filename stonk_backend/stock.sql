show databases;

create database stonk_db;

use stonk_db;

CREATE TABLE ticker (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Ticker VARCHAR(30),
    Name VARCHAR(30)
)

CREATE TABLE stonk (
	id INT AUTO_INCREMENT PRIMARY KEY,
    Ticker VARCHAR(10),
    Date DATE,
    Open DOUBLE,
    High DOUBLE,
    Low DOUBLE,
    Close DOUBLE,
    Volume BIGINT,
	Name VARCHAR(30)
);

INSERT INTO ticker (ticker, name) VALUES
    ('ETC-USD', 'Ethereum Classic (ETC)'),
    ('BTC-USD', 'Bitcoin (BTC)'),
    ('LTC-USD', 'Litecoin (LTC)'),
    ('XRP-USD', 'Ripple (XRP)'),
    ('AC.TO', 'Air Canada (AC)'),
    ('TSLA', 'Tesla (TSLA)'),
    ('TD.TO', 'TD Bank'),
    ('ETH-USD', 'Ethereum (ETH)'),
    ('DOGE-USD', 'Dogecoin (DOGE)'),
    ('NVDA', 'Nvidia (NVDA)'),
    ('AAPL', 'Apple (AAPL)'),
    ('MSFT', 'Microsoft (MSFT)'),
    ('AMZN', 'Amazon (AMZN)'),
    ('GOOGL', 'Alphabet Inc. (GOOGL)'),
    ('META', 'Meta Platforms (FB)'),
    ('BRK-B', 'Berkshire Hathaway (BRK-B)'),
    ('JPM', 'JPMorgan Chase (JPM)'),
    ('V', 'Visa Inc. (V)'),
    ('JNJ', 'Johnson & Johnson (JNJ)'),
    ('WMT', 'Walmart (WMT)'),
    ('PG', 'Procter & Gamble (PG)'),
    ('MA', 'Mastercard (MA)'),
    ('DIS', 'Disney (DIS)'),
    ('PYPL', 'PayPal (PYPL)'),
    ('NFLX', 'Netflix (NFLX)'),
    ('ADBE', 'Adobe Inc. (ADBE)'),
    ('INTC', 'Intel Corporation (INTC)'),
    ('CMCSA', 'Comcast Corporation (CMCSA)'),
    ('PEP', 'PepsiCo (PEP)'),
    ('KO', 'Coca-Cola (KO)'),
    ('MRK', 'Merck & Co. (MRK)'),
    ('PFE', 'Pfizer (PFE)'),
    ('BABA', 'Alibaba (BABA)'),
    ('CSCO', 'Cisco Systems (CSCO)'),
    ('ORCL', 'Oracle Corporation (ORCL)'),
    ('T', 'AT&T Inc. (T)'),
    ('XOM', 'Exxon Mobil (XOM)'),
    ('CVX', 'Chevron Corporation (CVX)'),
    ('BNB-USD', 'Binance Coin (BNB)'),
    ('SOL-USD', 'Solana (SOL)'),
    ('ADA-USD', 'Cardano (ADA)'),
    ('DOT-USD', 'Polkadot (DOT)'),
    ('UNI-USD', 'Uniswap (UNI)'),
    ('LINK-USD', 'Chainlink (LINK)'),
    ('XLM-USD', 'Stellar (XLM)'),
    ('AVAX-USD', 'Avalanche (AVAX)'),
    ('ATOM-USD', 'Cosmos (ATOM)'),
    ('MATIC-USD', 'Polygon (MATIC)'),
    ('FIL-USD', 'Filecoin (FIL)'),
    ('TRX-USD', 'Tron (TRX)'),
    ('EOS-USD', 'EOS.IO (EOS)'),
    ('VET-USD', 'VeChain (VET)'),
    ('SHIB-USD', 'Shiba Inu (SHIB)'),
    ('ICP-USD', 'Internet Computer (ICP)'),
    ('NEAR-USD', 'Near Protocol (NEAR)'),
    ('ALGO-USD', 'Algorand (ALGO)'),
    ('AAVE-USD', 'Aave (AAVE)'),
    ('PEPE24478-USD', 'PEPE Coin (PEPE)');
    



    

"""select * from stonk;

  
select * from stonk LIMIT 1000000;


SELECT 
    table_name AS `Table`, 
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS `Size in MB`
FROM information_schema.TABLES 
WHERE table_schema = 'stonk_db'
    AND table_name = 'stonk';"""
    
