import React, { useState, useEffect } from 'react';

function MacdGraph({ ticker, period, interval }) {
  const [macdImage, setMacdImage] = useState(null);
  const [rsiImage, setRsiImage] = useState(null);
  const [priceData, setPriceData] = useState(null);


  useEffect(() => {
    // Fetch MACD and RSI images
    async function fetchMacdAndRsiImages() {
      try {
        const response = await fetch("http://127.0.0.1:8000/stock/macd-rsi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ticker: ticker, period: period, interval: interval })
        });
        const data = await response.json();
        setMacdImage(`data:image/png;base64,${data.macd_image}`);
        setRsiImage(`data:image/png;base64,${data.rsi_image}`);
      } catch (error) {
        console.error("Error fetching MACD and RSI images:", error);
      }
    }

    // Fetch high, low, and current prices
    async function fetchHighLowCurrent() {
      try {
        const response = await fetch("http://127.0.0.1:8000/stock/high-low-current", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ticker: ticker, period: period, interval: interval })
        });
        const data = await response.json();
        setPriceData({
          lowest: data.lowest_price,
          current: data.current_price,
          highest: data.highest_price
        });
      } catch (error) {
        console.error("Error fetching high, low, and current prices:", error);
      }
    }

    // Call both functions
    fetchMacdAndRsiImages();
    fetchHighLowCurrent();
  }, [ticker, period, interval]);

  const calculateProgress = () => {
    if (!priceData) return 0;
    const { lowest, highest, current } = priceData;
    return ((current - lowest) / (highest - lowest)) * 100;
  };

  return (
    <div>
      <h2>MACD and RSI Graphs for {ticker}</h2>
      {macdImage ? <img src={macdImage} alt="MACD Graph" /> : <p>Loading MACD...</p>}
      {rsiImage ? <img src={rsiImage} alt="RSI Graph" /> : <p>Loading RSI...</p>}

      <h2>High, Low, and Current Price Progress for {ticker}</h2>
      {priceData ? (
        <div style={{ width: "100%", marginTop: "20px" }}>
          <div style={{ background: "#ccc", borderRadius: "5px", height: "30px", position: "relative" }}>
            <div
              style={{
                width: `${calculateProgress()}%`,
                background: "#4caf50",
                height: "100%",
                borderRadius: "5px 0 0 5px"
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: `${calculateProgress()}%`,
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
                color: "#fff"
              }}
            >
              {priceData.current}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginTop: "5px" }}>
            <span>Low: {priceData.lowest}</span>
            <span>High: {priceData.highest}</span>
          </div>
        </div>
      ) : (
        <p>Loading High-Low-Current Price...</p>
      )}
    </div>
  );
}

export default MacdGraph;
