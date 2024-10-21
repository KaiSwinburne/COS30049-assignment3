import React from 'react';
import HomePage from './pages/Home';
import Predictions from './pages/Predictions';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import About from './pages/About';
import Weather from './pages/Weather';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path='/About' element={<About/>}/>
        <Route path='/weather' element={<Weather/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </Router>
  );
}

export default App;