import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Products from './Components/Products';
// import Profile from './Components/Profils';
import Navbar from './Components/Navbar';
import FirstProductsList from './Components/FirstproductsList';





function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      {/* Define your routes */}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/" element={<FirstProductsList />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
