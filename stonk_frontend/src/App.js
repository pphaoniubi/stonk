import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AnnualReturns from './AnnualReturns';
import StockMainPage from './StockMainPage';
import "./App.css"

function App() {

  return (
    <Router>
      <div>
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/annual-returns" className="nav-link">Annual Returns</Link>
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
