import React, { useState } from 'react';
import Modal from "react-modal";
import styles from './RegistrationPage.module.css';

const RegistrationPage = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }
    return (
        <div className={styles.RegistrationPage}>
            <h1>Registration - Autumn 2023</h1>
            <div>
                <select name="quarter" id="quarter">
                    <option value="autumn">Autumn 2023</option>
                    <option value="winter">Winter 2024</option>
                    <option value="spring">Spring 2024</option>
                    <option value="summer">Summer 2024</option>
                </select>
                <button>Change Quarter</button>

                <p>Prepared for: NAME</p>
                <p>Prepared on: DATE</p>
                <p>Major: Computer Science</p>

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