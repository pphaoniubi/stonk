import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Volume() {
    const [volumeRanking, setVolumeRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.post("http://localhost:8000/stock/getVolumeRanking")
          .then(response => {
            setVolumeRanking(response.data);
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
          <h2 style={{ textAlign: 'center' }}>Volume Percentage in 30d Timeframe</h2>
          <div style={{ display: 'flex', gap: '20px' }}>
            
            <div style={{ flex: 1 }}>
              <table  className="table">
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Ticker</th>
                    <th>Volume Percentage (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {volumeRanking.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.ticker}</td>
                      <td>{item.volume_percentage ? `${item.volume_percentage.toFixed(2)}%` : 'No data'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
        </div>
      );

}


export default Volume;