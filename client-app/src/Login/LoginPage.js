import React, { useState } from 'react';
import registrationIcon from '../assets/icon.png';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../apiService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const HandleSubmit = async (event) => {
        event.preventDefault();

        const endpoint = "/log";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: password }),
        };

        const uwid = email.split('@')[0];
        const loginEndpoint = "/login";
        const loginOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 'net_id' : uwid, 'password' : password })
        }

        try {
            const data = await fetchData(endpoint, options);
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        try {
            const data = await fetchData(loginEndpoint, loginOptions);
            if (data['status'] === 200) {
                navigate('/register', { state: { uwid } });
            } else {
                setErrorMessage("Invalid username or password. Please try again.");
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage("There was an error logging in. Please try again later.");
            setEmail('');
            setPassword('');
        }
    };


    const isFormValid = () => {
        return email.trim() !== '' && password.trim() !== '';
    };

    let input = <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        pattern="(?i)[a-zA-Z0-9._%+-]+@uw\.edu"
        required
    />;
    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <img className={styles.logo} src={registrationIcon} alt="Logo"/>
                <h1 className={styles.title}>Registration System</h1>
                <form onSubmit={HandleSubmit}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        pattern="[a-zA-Z0-9._%+-]+@uw\.edu|[a-zA-Z0-9._%+-]+@UW\.EDU"
                        required
                        onBlur={(e) => e.target.reportValidity()}
                        onInvalid={(e) => {
                            e.target.setCustomValidity("Please enter a valid uw.edu email address.");
                        }}
                        onInput={(e) => e.target.setCustomValidity("")}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.button} disabled={!isFormValid()}>
                        Login
                    </button>
                </form>
            </div>
            {errorMessage &&
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.alertHeader}>Alert</div>
                        <p>{errorMessage}</p>
                        <button className={styles.closeButton} onClick={() => setErrorMessage('')}>
                            &times;
                        </button>
                    </div>
                </div>
            }
        </div>
    );
};

export default LoginPage;
