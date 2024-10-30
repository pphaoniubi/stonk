import React, { useState, useEffect } from 'react';

function MacdGraph({ ticker }) {
  const [macdImage, setMacdImage] = useState(null);
  const [rsiImage, setRsiImage] = useState(null);

  useEffect(() => {
    async function fetchMacdGraph() {
      try {
        const response = await fetch("http://127.0.0.1:8000/stock/macd-rsi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ticker: ticker, period: "5d", interval: "1h" })
        });
        const data = await response.json();
        setMacdImage(`data:image/png;base64,${data.macd_image}`);
        setRsiImage(`data:image/png;base64,${data.rsi_image}`);
      } catch (error) {
        console.error("Error fetching MACD graph:", error);
      }
    }
    
    fetchMacdGraph();
  }, [ticker]);

  return (
    <div>
      <h2>MACD Graph for {ticker}</h2>
      {macdImage ? <img src={macdImage} alt="MACD Graph" /> : <p>Loading Macd...</p>}
      {rsiImage ? <img src={rsiImage} alt="RSI Graph" /> : <p>Loading RSI...</p>}

    </div>
  );
}

export default MacdGraph;