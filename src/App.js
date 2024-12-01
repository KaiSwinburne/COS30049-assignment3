import React from 'react';
import HomePage from './pages/Home';
import Predictions from './pages/Predictions';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import About from './pages/About';
import Weather from './pages/Weather';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path='/About' element={<About/>}/>
        <Route path='/weather' element={<Weather/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </Router>
  );
}

export default App;