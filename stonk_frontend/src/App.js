
import React, { useState } from 'react';
import MacdGraph from './MacdGraph';

function App() {
  const [ticker, setTicker] = useState("ETC-USD");
  const [submittedTicker, setSubmittedTicker] = useState("ETC-USD");

  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedTicker(ticker); // Updates the ticker for MacdGraph
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
        <button type="submit">Submit</button>
      </form>
      <MacdGraph ticker={submittedTicker} />
    </div>
  );
}

export default App;