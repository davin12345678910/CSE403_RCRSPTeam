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
import ShortTermLoan from './ShortTermLoan';
import TuitionStatement from './TuitionStatement';
import CreditCardPayment from './CreditCardPayment';
import logo from './assets/wlogo.png';
import uwText from './assets/textuw.png';
import styles from './App.css';

const App = () => {
    return (
        <div>
            <img className="uw-logo" src={logo}></img>
            <img className="uw-text" src={uwText}></img>
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
                    <Route path ="/short" element={<ShortTermLoan />} />
                    <Route path ="/tuition" element={<TuitionStatement />} />
                    <Route path ="/credit" element={<CreditCardPayment />} />

                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
