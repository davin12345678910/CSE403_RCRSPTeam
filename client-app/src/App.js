// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import ClassSchedule from './ClassSchedule';
import VisualSchedule from './VisualSchedule';
import GradeInquiry from './GradeInquiry';
import UnofficialTranscript from './UnofficialTranscript';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/schedule" element={<ClassSchedule />} />
                <Route path="/visual" element={<VisualSchedule />} />
                <Route path="/grade" element={<GradeInquiry />} />
                <Route path ="/transcript" element={<UnofficialTranscript />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
