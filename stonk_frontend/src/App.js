
import React, { useState } from 'react';
import MacdGraph from './MacdGraph';

function App() {
  const [ticker, setTicker] = useState("AAPL");

  return (
    <div>
      <h1>Stock Analysis App</h1>
      <label>
        Ticker Symbol:
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
      </label>
      <MacdGraph ticker={ticker} />
    </div>
  );
}

export default App;