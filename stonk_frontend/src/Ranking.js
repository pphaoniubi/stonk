import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ranking.css'

const Ranking = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proximity, setProximity] = useState([]);

  useEffect(() => {
    axios.post("http://localhost:8000/stock/getReturns")
      .then(response => {
        setReturns(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching returns data:", error);
        setLoading(false);
      });

    axios.post("http://localhost:8000/stock/getProximityToLow")
      .then(response => {
        setProximity(response.data.ranked_proximity);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching proximity data:", error);
        setLoading(false);
      });
  }, []);
  

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Ranking</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* Annual Returns Table */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Annual Returns</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Ticker</th>
                <th>Annual Return (%)</th>
                <th>Maximum Return (%)</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.ticker}</td>
                  <td>{item.annual_return ? `${item.annual_return.toFixed(2)}%` : 'No data'}</td>
                  <td>{item.maximum_return ? `${item.maximum_return.toFixed(2)}%` : 'No data'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Proximity Rank</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Ticker</th>
                <th>Proximity Rank</th>
              </tr>
            </thead>
            <tbody>
              {proximity.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.ticker}</td>
                  <td>{item.proximity_rank ? `${item.proximity_rank.toFixed(2)}` : 'No data'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
    </div>
  );
};

export default Ranking;
