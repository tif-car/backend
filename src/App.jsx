import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import Message from'./modules/message';
import TopBar from './modules/topbar';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import {BrowserRouter as Router , Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className = "App">
      <Routes>
        <Route path = "/" element={<Home />} />
        <Route path = "/SignIn" element={<SignIn />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
