import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemManager from './components/ItemManager';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterFull from './pages/RegisterFull';
import DeviceManager from './components/DevicesManager';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/full" element={<RegisterFull />} />
        <Route path="/items" element={<ItemManager />} />
        <Route path="/devices" element={<DeviceManager />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
