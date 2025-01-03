import React, { useEffect, useState } from 'react';
import TechnicalGraph from './TechnicalGraph';
import axios from 'axios';
import './StockMainPage.css'

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
        const [selectedPeriod, setSelectedPeriod] = useState('1y');
        const [selectedInterval, setSelectedInterval] = useState('1d');
        const [finalPeriod, setFinalPeriod] = useState(selectedPeriod);
        const [finalInterval, setFinalInterval] = useState(selectedInterval);
        const [searchQuery, setSearchQuery] = useState('');
        const [doneMessage, setDoneMessage] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const [isPopupVisible, setIsPopupVisible] = useState(false); // Controls popup visibility


        const handleUpdateClick = () => {
          setIsLoading(true);
          axios.post('http://localhost:8000/stock/update')
              .then(response => {
                setDoneMessage(response.data.message);
                setIsPopupVisible(true);
                })
              .catch(error => {
                  console.error('Error fetching data:', error);
              }).finally(() => {
                setIsLoading(false); // Stop the spinner
              });;
        };
        const handleUpdateClickFund = () => {
          setIsLoading(true);
          axios.post('http://localhost:8000/stock/updateFundamental') // Replace with your actual API URL
              .then(response => {
                setDoneMessage(response.data.message);
                setIsPopupVisible(true);
              })
              .catch(error => {
                  console.error('Error fetching data:', error);
              }).finally(() => {
                setIsLoading(false); // Stop the spinner
              });;
        };

        const handlePopupClose = () => {
          setIsPopupVisible(false); // Close the popup
          setDoneMessage(""); // Clear the message
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
    <form onSubmit={handleSubmit}  style={{ display: 'inline', marginRight: '25px' }}>
      <label>
        <span className="ticker-label">Ticker Symbol:</span>
        <input
          type="text"
          placeholder="Search tickers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginLeft: '8px' }}
          className="search-bar"
        />
        {/* Dropdown for filtered tickers */}
        <select value={ticker} onChange={(e) => setTicker(e.target.value)} className="select-dropdown">
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
      <br/>
      <button type="submit" className="light-blue-button">Submit</button>
    </form>
    <button onClick={handleUpdateClick} className="light-blue-button">Update</button>
    
    <button onClick={handleUpdateClickFund} className="light-blue-button" style={{ marginLeft: '25px' }}>Update Fund</button>
    {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup">
            <p>{doneMessage}</p>
            <button onClick={handlePopupClose}>Done</button>
          </div>
        </div>
      )}

    {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    <TechnicalGraph ticker={submittedTicker} period={finalPeriod} interval={finalInterval}/>
  </div>
  );

}
export default StockMainPage;
