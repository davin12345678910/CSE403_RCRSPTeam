import React, { useState, useEffect } from 'react';
import Modal from "react-modal";
import styles from './RegistrationPage.module.css';
import { useLocation } from 'react-router-dom';
import {fetchData} from "../apiService";

const RegistrationPage = () => {
    const location = useLocation();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [uwId, setUwId] = useState('');
    const [studentInfo, setStudentInfo] = useState(null);

    useEffect(() => {
        if (location.state && location.state.uwid) {
            const uwId = location.state.uwid;
            setUwId(uwId);
            getStudentInfo(uwId);

        }
    }, [location, location.state]);

    const getStudentInfo = async (uwId) => {
        const getStudentEndpoint = "/getStudent";
        const getStudentOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({'net_id': uwId})
        }
        try {
            const data = await fetchData(getStudentEndpoint, getStudentOptions);
            console.log("data fetched: ", data);
            setStudentInfo(data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    return (
        <div className={styles.RegistrationPage}>
            <h1 className={styles.TextStroke}>Registration - Autumn 2023</h1>
            <div>
                <select name="quarter" id="quarter">
                    <option value="autumn">Autumn 2023</option>
                    <option value="winter">Winter 2024</option>
                    <option value="spring">Spring 2024</option>
                    <option value="summer">Summer 2024</option>
                </select>
                <button>Change Quarter</button>

                {studentInfo && (
                    <>
                        <p>Prepared for: {studentInfo.Student.student_name}</p>
                        <p>Prepared on: {new Date().toLocaleDateString()}</p>
                        <p>Major: {studentInfo.Student.major}</p>
                    </>
                )}

                <button onClick={openModal}>Open Modal</button>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    className={styles.Modal}
                    overlayClassName={styles.Overlay}
                >
                    <h2>Search and Add Course</h2>
                    <p>xxxxxxxxxxxxxx</p>
                    <button onClick={closeModal}>Close</button>
                </Modal>
            </div>
        </div>
    )

}

export default RegistrationPage;