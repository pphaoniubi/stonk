import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Ranking from './Ranking';
import StockMainPage from './StockMainPage';
import Volume from './Volume';
import "./App.css"
import FundamentalPage from './FundamentalPage';

function App() {

  return (
    <Router>
      <div>
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/ranking" className="nav-link">Ranking</Link>
        <Link to="/volume" className="nav-link">Volume</Link>
        <Link to="/fundamental" className="nav-link">Fundamental</Link>
      </nav>
        
        <Routes>
          <Route path="/" element={<StockMainPage />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/volume" element={<Volume />} />
          <Route path="/fundamental" element={<FundamentalPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
