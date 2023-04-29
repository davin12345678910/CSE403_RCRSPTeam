// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import BeginningPage from './BeginningPage';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/beginning" element={<BeginningPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
