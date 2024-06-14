import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './component/login';
import Register from './component/register';
import Item from './component/Item';
import Catepage from './component/Catepage';
import Sell from './component/Sell';
import Searchpage from './component/searchpage';
import Userprofile from './component/Userprofile';
import Productfix from './component/productfix';
import './index.css';


// Use createRoot instead of ReactDOM.render
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/item/:id" element={<Item />} />
        <Route path="/cate/:id" element={<Catepage />} />
        <Route path="/Sell" element={<Sell />} />
        <Route path="/searchpage/:searchTerm" element={<Searchpage />} />
        <Route path="/userprofile" element={<Userprofile />} />
        <Route path="/productfix/:id" element={<Productfix />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
