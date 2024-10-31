
import React, { useState } from 'react';
import MacdGraph from './MacdGraph';

function App() {
  const [ticker, setTicker] = useState("ETC-USD");
  const [submittedTicker, setSubmittedTicker] = useState("ETC-USD");
  const [selectedPeriod, setSelectedPeriod] = useState('6mo'); // Default period
  const [selectedInterval, setSelectedInterval] = useState('1mo'); // Default interval
  const [finalPeriod, setFinalPeriod] = useState(selectedPeriod);
  const [finalInterval, setFinalInterval] = useState(selectedInterval);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedTicker(ticker);
    setFinalPeriod(selectedPeriod);
    setFinalInterval(selectedInterval);
  };
  return (
    <div>
      <h1>Stock Analysis App</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Ticker Symbol:
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
        </label>


        {/* Priod radio */} 
        <div>
          <h3>Select Period</h3>
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

export default App;