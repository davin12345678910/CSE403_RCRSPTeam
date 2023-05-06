// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import ClassSchedule from './ClassSchedule';
import VisualSchedule from './VisualSchedule';
import GradeInquiry from './GradeInquiry';
import UnofficialTranscript from './UnofficialTranscript';
import OfficalTranscript from './OfficialTranscript';
import DegreeAudit from './DegreeAudit';
import AddressandConsent from './AddressandConsent';
import InsuranceorOptionalCharges from './InsuranceorOptionalCharges';
import FinancialAidStatus from './FinancialAidStatus';
import DirectDepositTransfer from './DirectDepositTransfer';
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
                <Route path ="/official" element={<OfficalTranscript />} />
                <Route path ="/audit" element={<DegreeAudit />} />
                <Route path ="/address" element={<AddressandConsent />} />
                <Route path ="/insurance" element={<InsuranceorOptionalCharges />} />
                <Route path ="/financial" element={<FinancialAidStatus />} />
                <Route path ="/direct" element={<DirectDepositTransfer />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
