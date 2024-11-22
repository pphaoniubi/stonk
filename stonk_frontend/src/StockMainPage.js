import React, { useEffect, useState } from 'react';
import MacdGraph from './MacdGraph';
import axios from 'axios';

const StockMainPage = () => {

    const [tickers, setTickers] = useState([
      { label: 'Bitcoin (BTC)', value: 'BTC-USD' },
      { label: 'Ripple (XRP)', value: 'XRP-USD' },
      { label: 'Tesla (TSLA)', value: 'TSLA' },
      { label: 'Ethereum (ETH)', value: 'ETH-USD' },
      { label: 'Dogecoin (DOGE)', value: 'DOGE-USD' },
      { label: 'Solana (SOL)', value: 'SOL-USD' },
      { label: 'Nvidia (NVDA)', value: 'NVDA' },
      { label: 'Apple (AAPL)', value: 'AAPL' },
      { label: 'Microsoft (MSFT)', value: 'MSFT' },
      { label: 'Amazon (AMZN)', value: 'AMZN' },
      { label: 'Alphabet Inc. (GOOGL)', value: 'GOOGL' },
      { label: 'Intel Corporation (INTC)', value: 'INTC' },
      { label: 'Meta Platforms (FB)', value: 'META' },
      { label: 'Berkshire Hathaway (BRK-B)', value: 'BRK-B' },
      { label: 'Mastercard (MA)', value: 'MA' },
      { label: 'Netflix (NFLX)', value: 'NFLX' },
      { label: 'Adobe Inc. (ADBE)', value: 'ADBE' },
      { label: 'AT&T Inc. (T)', value: 'T' },
      { label: 'Cardano (ADA)', value: 'ADA-USD' },
      { label: 'Avalanche (AVAX)', value: 'AVAX-USD' },
      { label: 'Shiba Inu (SHIB)', value: 'SHIB-USD' },
      { label: 'Ethereum Classic (ETC)', value: 'ETC-USD' },
      { label: 'Aave (AAVE)', value: 'AAVE-USD' },
      { label: 'TD Bank', value: 'TD.TO' }
    ]);
        const [filteredTickers, setFilteredTickers] = useState(tickers);
        const [ticker, setTicker] = useState("ETH-USD");
        const [submittedTicker, setSubmittedTicker] = useState("ETH-USD");
        const [selectedPeriod, setSelectedPeriod] = useState('1y'); // Default period
        const [selectedInterval, setSelectedInterval] = useState('1d'); // Default interval
        const [finalPeriod, setFinalPeriod] = useState(selectedPeriod);
        const [finalInterval, setFinalInterval] = useState(selectedInterval);
        const [searchQuery, setSearchQuery] = useState('');

        const handleButtonClick = () => {
          axios.post('http://localhost:8000/stock/update') // Replace with your actual API URL
              .then(response => {
                  console.log('Data fetched successfully:', response.data);
                  // You can set this data to state or perform other actions
              })
              .catch(error => {
                  console.error('Error fetching data:', error);
              });
      };
      
        // Update filtered tickers based on search query
        useEffect(() => {
          if (searchQuery === '') {
            setFilteredTickers(tickers);
          } else {
            const filtered = tickers.filter(ticker =>
              ticker.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredTickers(filtered);
          }
        }, [searchQuery, tickers]);
      
        const handleSubmit = (e) => {
          e.preventDefault();
          setSubmittedTicker(ticker);
          setFinalPeriod(selectedPeriod);
          setFinalInterval(selectedInterval);
        };

  return (
    <div>
    <h1>Stock Analysis Page</h1>
    <button onClick={handleButtonClick}>Update</button>
    <form onSubmit={handleSubmit}>
      <label>
        Ticker Symbol:
        {/* Search input */}
        <input
          type="text"
          placeholder="Search tickers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Dropdown for filtered tickers */}
        <select value={ticker} onChange={(e) => setTicker(e.target.value)}>
          {filteredTickers.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {/* Period radio */}
      <div>
        <h3>Select Period</h3>
        <label>
          <input
            type="radio"
            value="1d"
            checked={selectedPeriod === "1d"}
            onChange={() => setSelectedPeriod("1d")}
          />
          1 Day
        </label>
        <label>
          <input
            type="radio"
            value="5d"
            checked={selectedPeriod === "5d"}
            onChange={() => setSelectedPeriod("5d")}
          />
          5 Day
        </label>
        <label>
          <input
            type="radio"
            value="1mo"
            checked={selectedPeriod === "1mo"}
            onChange={() => setSelectedPeriod("1mo")}
          />
          1 Month
        </label>
        <label>
          <input
            type="radio"
            value="3mo"
            checked={selectedPeriod === "3mo"}
            onChange={() => setSelectedPeriod("3mo")}
          />
          3 Months
        </label>
        <label>
          <input
            type="radio"
            value="6mo"
            checked={selectedPeriod === "6mo"}
            onChange={() => setSelectedPeriod("6mo")}
          />
          6 Months
        </label>
        <label>
          <input
            type="radio"
            value="1y"
            checked={selectedPeriod === "1y"}
            onChange={() => setSelectedPeriod("1y")}
          />
          1 Year
        </label>
      </div>

      {/* Interval radio */}
      <div>
        <h3>Select Interval</h3>
        <label>
          <input
            type="radio"
            value="1h"
            checked={selectedInterval === "1h"}
            onChange={() => setSelectedInterval("1h")}
          />
          1 Hour
        </label>
        <label>
          <input
            type="radio"
            value="1d"
            checked={selectedInterval === "1d"}
            onChange={() => setSelectedInterval("1d")}
          />
          1 Day
        </label>
        <label>
          <input
            type="radio"
            value="1wk"
            checked={selectedInterval === "1wk"}
            onChange={() => setSelectedInterval("1wk")}
          />
          1 Week
        </label>
        <label>
          <input
            type="radio"
            value="1mo"
            checked={selectedInterval === "1mo"}
            onChange={() => setSelectedInterval("1mo")}
          />
          1 Month
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
    <MacdGraph ticker={submittedTicker} period={finalPeriod} interval={finalInterval}/>
  </div>
  );

}
export default StockMainPage;
