import React, { useState } from 'react';
import registrationIcon from './assets/icon.png';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const HandleSubmit = (event) => {
        event.preventDefault();
        console.log('Email:', email, 'Password:', password);
        navigate('/register');
    };

    const isFormValid = () => {
        return email.trim() !== '' && password.trim() !== '';
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <img className={styles.logo} src={registrationIcon} alt="Logo" />
                <h1 className={styles.title}>Registration System</h1>
                <form onSubmit={HandleSubmit}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        pattern="(?i)[a-zA-Z0-9._%+-]+@uw\.edu"
                        required
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
        </div>
    );
};

export default LoginPage;
