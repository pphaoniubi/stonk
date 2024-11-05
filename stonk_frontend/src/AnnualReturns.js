import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnnualReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the backend
    axios.post("http://localhost:8000/stock/getReturns")
      .then(response => {
        setReturns(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching returns data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Annual Returns</h2>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Ticker</th>
            <th>Annual Return (%)</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((item, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{item.ticker}</td>
              <td>{item.return ? `${item.return.toFixed(2)}%` : 'No data'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnnualReturns;
