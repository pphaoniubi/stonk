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
    ('MA', 'Mastercard (MA)'),
    ('NFLX', 'Netflix (NFLX)'),
    ('ADBE', 'Adobe Inc. (ADBE)'),
    ('INTC', 'Intel Corporation (INTC)'),
    ('T', 'AT&T Inc. (T)'),
    ('BNB-USD', 'Binance Coin (BNB)'),
    ('SOL-USD', 'Solana (SOL)'),
    ('ADA-USD', 'Cardano (ADA)'),
    ('DOT-USD', 'Polkadot (DOT)'),
    ('AVAX-USD', 'Avalanche (AVAX)'),
    ('SHIB-USD', 'Shiba Inu (SHIB)'),
    ('ALGO-USD', 'Algorand (ALGO)'),
    ('AAVE-USD', 'Aave (AAVE)');