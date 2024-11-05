import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AnnualReturns from './AnnualReturns';
import StockMainPage from './StockMainPage';

function App() {

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/annual-returns">Annual Returns</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<StockMainPage />} />
          <Route path="/annual-returns" element={<AnnualReturns />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
