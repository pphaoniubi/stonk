import React, { useState, useEffect } from 'react';
import "./TechnicalGraph.css"

function TechnicalGraph({ ticker, period, interval }) {
  const [macdImage, setMacdImage] = useState(null);
  const [rsiImage, setRsiImage] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [bollingerbandImage, setBollingerbandImage] = useState(null);
  const [volumeImage, setVolumeImage] = useState(null);
  const [fundamental, setFundamental] = useState(null);


  useEffect(() => {

    async function fetchFundamental() {
      try {
        const response = await fetch("http://127.0.0.1:8000/stock/stockFundamental", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ticker: ticker })
        });
        const data = await response.json();
        setFundamental({
          pe_ratio: data.pe_ratio,
          eps: data.eps,
          dividend_yield: data.dividend_yield,
          market_cap: data.market_cap
      })
      } catch (error) {
        console.error("Error fetching chart:", error);
      }

    };
    async function fetchBollingerband() {
      try {
        const response = await fetch("http://127.0.0.1:8000/stock/bollingerband", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ticker: ticker, period: period, interval: interval })
        });
        const data = await response.json();
        setBollingerbandImage(`data:image/png;base64,${data.bollingerband_image}`);
      } catch (error) {
        console.error("Error fetching chart:", error);
      }
    };

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

    async function fetchVolumeImages() {
      try {
        const response = await fetch("http://127.0.0.1:8000/stock/getVolumeChart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ticker: ticker })
        });
        const data = await response.json();
        setVolumeImage(`data:image/png;base64,${data.volume_image}`);

      } catch (error) {
        console.error("Error fetching volume image:", error);
      }
    }

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

    fetchFundamental()
    fetchMacdAndRsiImages();
    fetchHighLowCurrent();
    fetchBollingerband();
    fetchVolumeImages();
  }, [ticker, period, interval]);

  const calculateProgress = () => {
    if (!priceData) return 0;
    const { lowest, highest, current } = priceData;
    return ((current - lowest) / (highest - lowest)) * 100;
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>{ticker.toUpperCase()}</h1>
      <table className="fundamental-table">
          <thead>
              <tr>
                  <th>P/E Ratio</th>
                  <th>EPS</th>
                  <th>Dividend Yield</th>
                  <th>Market Cap (billions)</th>
              </tr>
          </thead>
          <tbody>
              <tr>
              <td>{fundamental?.pe_ratio || 'N/A'}</td>
              <td>{fundamental?.eps || 'N/A'}</td>
              <td>{fundamental?.dividend_yield || 'N/A'}</td>
              <td>{fundamental?.market_cap.toLocaleString() || 'N/A'}</td>
              </tr>
          </tbody>
      </table>
      <div className="image-container">
      {bollingerbandImage ? <img src={bollingerbandImage}/> : <p>Loading Bollinger...</p>}
      {macdImage ? <img src={macdImage} alt="MACD Graph" /> : <p>Loading MACD...</p>}
      {rsiImage ? <img src={rsiImage} alt="RSI Graph" /> : <p>Loading RSI...</p>}
      {volumeImage ? <img src={volumeImage} alt="Volume Graph" /> : <p>Loading Volume...</p>}
      </div>

      <h2 style={{ marginLeft: '20px' }}>High, Low, and Current Price Progress for {ticker}</h2>
      {priceData ? (
        <div style={{ width: "calc(100% - 40px)", marginTop: "20px", marginBottom: '60px', marginLeft: '20px' }}>
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
        <p style={{ marginLeft: '20px', marginRight: '20px' }}>Loading High-Low-Current Price...</p>
      )}
    </div>
  );
}

export default TechnicalGraph;
