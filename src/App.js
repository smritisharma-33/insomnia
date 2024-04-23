import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Experiment from './Experiment'; 
import Instructions from './Instructions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experiment" element={<Experiment />} />
        <Route path="/instructions" element={<Instructions />} />
      </Routes>
    </Router>
  );
}

export default App;


