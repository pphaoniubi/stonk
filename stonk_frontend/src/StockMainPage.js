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
    <form onSubmit={handleSubmit}  style={{ marginLeft: '20px' }}>
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
      <button type="submit" className="light-green-button" style={{ marginLeft: '18px' }}>Submit</button>


      {/* Period radio */}
      <div className="radio-group">
        <h3>Select Period</h3>
        <div className="radio-options">
          <input
            type="radio"
            id="3mo"
            value="3mo"
            checked={selectedPeriod === "3mo"}
            onChange={() => setSelectedPeriod("3mo")}
            className="hidden-radio"
          />
          <label htmlFor="3mo" className="radio-label">3 Months</label>

          <input
            type="radio"
            id="6mo"
            value="6mo"
            checked={selectedPeriod === "6mo"}
            onChange={() => setSelectedPeriod("6mo")}
            className="hidden-radio"
          />
          <label htmlFor="6mo" className="radio-label">6 Months</label>

          <input
            type="radio"
            id="1y"
            value="1y"
            checked={selectedPeriod === "1y"}
            onChange={() => setSelectedPeriod("1y")}
            className="hidden-radio"
          />
          <label htmlFor="1y" className="radio-label">1 Year</label>
        </div>
      </div>
      <br/>
    </form>
    <button onClick={handleUpdateClick} className="light-green-button" style={{ marginLeft: '20px' }}>Update</button>
    <button onClick={handleUpdateClickFund} className="light-green-button" style={{ marginLeft: '25px' }}>Update Fund</button>
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
