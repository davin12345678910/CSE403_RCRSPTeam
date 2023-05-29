import React, { useState, useEffect } from 'react';
import Modal from "react-modal";
import styles from './RegistrationPage.module.css';
import { useLocation } from 'react-router-dom';
import {fetchData} from "../apiService";
import ReactStars from "react-rating-stars-component";
import waitlistSelected from '../assets/waitlistselected1.png';
import waitlistNotSelected from '../assets/waitlistnotselected.png';

const RegistrationPage = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const location = useLocation();
    // hook for modal state
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // hook for uwid state
    const [uwId, setUwId] = useState('');
    // hook for student info state
    const [studentInfo, setStudentInfo] = useState(null);
    // hook for courses state
    const [courses, setCourses] = useState([]);
    // hook for search term state
    const [searchTerm, setSearchTerm] = useState('');
    // hook for selected courses state
    const [selectedCourses, setSelectedCourses] = useState([]);
    // hook for checked courses state
    const [checkedCourses, setCheckedCourses] = useState([]);
    // hook for requested add codes state
    const [requestedAddCodes, setRequestedAddCodes] = useState([]);
    // hook for waitlisted state
    const [waitlisted, setWaitlisted] = useState(false);


    const [errorMessage, setErrorMessage] = useState('');

    // This function is responsible for the modal's enter key
    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchCourse();
        }
      }

    // This function is responsible for the modal's checkbox change
    const handleCheckboxChange = (course) => {
        // If no course is found, alert the user
        if (course === undefined) {
            setErrorMessage("No courses found!");
        } else{
            // Here we are checking if the course is already in the checkedCourses array
            // If it is not, we add it to the array
            setCheckedCourses((prevCheckedCourses) => {
                if (prevCheckedCourses.includes(course)) {
                    return prevCheckedCourses.filter((c) => c !== course);
                } else {
                    return [...prevCheckedCourses, course];
                }
            });
        }
    };

    // This function is responsible for the modal close state
    const handleCloseModal = async () => {
        // If no courses were added, alert the user
        if (courses.length === 0) {
            setErrorMessage("No classes were added!");
        }
        // Finding the selected courses that are not already in the selectedCourses array
        const newCourses = checkedCourses.filter(
            (course) => !selectedCourses.find((c) => c.sln === course.sln)
        );

        // Add each new course to the backend
        for (const course of newCourses) {
            const res = await addCourse(course);
            // Only add the course to the selectedCourses array if the status is 200
            if (res.status === 200) {
                setSelectedCourses((prevSelectedCourses) => [...prevSelectedCourses, course]);
            }
        }

        setCheckedCourses([]);
        setModalIsOpen(false);
    };

    // This function is responsible for add course button
    const addCourse = async (course) => {
        // Create the endpoint and options for the add course request
        const addRegistrationEndpoint = "/addRegistration";
        const addRegistrationOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({'net_id': uwId, 'class_id': course.class_id})
        }
        let response = null;
        try {
            // Make the request
            response = await fetchData(addRegistrationEndpoint, addRegistrationOptions);
            if (response.error.includes("Conflict")) {
                setErrorMessage(response.error);
            } else if (response.status !== 200) {
                setErrorMessage('Error adding course');
            }
        } catch (error) {
            console.error('Error adding course:', error);
            setErrorMessage('Error adding course:', error);
        }
        return response;
    }

    // This function is responsible for the remove course button
    const removeCourse = async (course) => {
        // Create the endpoint and options for the remove course request
        const removeRegistrationEndpoint = "/removeRegistration";
        const removeRegistrationOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({'net_id': uwId, 'class_id': course.class_id})
        }
        let response = null;
        try {
            // Make the request
            response = await fetchData(removeRegistrationEndpoint, removeRegistrationOptions);
            if (response.status !== 200) {
                setErrorMessage('Error removing course');
                throw new Error('Error removing course');
            }
        } catch (error) {
            console.error('Error removing course:', error);
            setErrorMessage('Error removing course:', error);
        }
        return response;
    }

    // Hook startup function
    useEffect(() => {
        Modal.setAppElement('#root');
        if (location.state && location.state.uwid) {
            const uwId = location.state.uwid;
            setUwId(uwId);
            getStudentInfo(uwId);
            getRegistrationData(uwId);
        }
    }, [location, location.state, requestedAddCodes, courses]);

    // This function is responsible for getting the student registration data
    const getRegistrationData = async (uwId) => {
        // Create the endpoint and options for the get registration request
        const getRegistrationEndpoint = "/getStudentRegistration";
        const getRegistrationOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({'net_id': uwId})
        }
        try {
            // Make the request
            const data = await fetchData(getRegistrationEndpoint, getRegistrationOptions);
            const registeredClasses = data.registration;
            // Get the class data for each registered class
            const classDataPromises = registeredClasses.map(async (registeredClass) => {
                const getClassEndpoint = "/getClass";
                const getClassOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({'class_id': registeredClass.class_id})
                };
                // Make the request
                const classData = await fetchData(getClassEndpoint, getClassOptions);
                return classData.class;
            });
            // Wait for all the requests to finish
            const classData = await Promise.all(classDataPromises);
            // Update the selectedCourses array with the class data
            setSelectedCourses(classData);
        } catch (error) {
            console.error('Error fetching registration data:', error);
            setErrorMessage('Error fetching registration data:', error);
        }
    }

    // This function is responsible for getting the student info
    const getStudentInfo = async (uwId) => {
        // Create the endpoint and options for the get student request
        const getStudentEndpoint = "/getStudent";
        const getStudentOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({'net_id': uwId})
        }
        try {
            // Make the request
            const data = await fetchData(getStudentEndpoint, getStudentOptions);
            setStudentInfo(data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('Error fetching data:', error);
            return null;
        }
    }

    // This function is responsible for searching for a course
    const searchCourse = async () => {
        // Empty the courses array
        setCourses([]);
        // Create the endpoint and options for the search course request
        const getClassEndpoint = "/getClass";
        const getClassOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({'class_id': searchTerm})
        };
        try {
            // Make the request
            const data = await fetchData(getClassEndpoint, getClassOptions);

            if (data.class === undefined) {
                window.alert("No class found!");
                return;
            }

            // Get the add code status for the class
            const getAddCodeEndpoint = "/getAddCode";
            const getAddCodeOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({'class': data.class.class_id})
            };
            // Make the request
            const addCodeData = await fetchData(getAddCodeEndpoint, getAddCodeOptions);
            // Update the course with the add code status
            const addCodeStatus = addCodeData.AddCodes.find((addCode) => addCode.net_id === uwId);

            // Get the waitlist for the class
            const getWaitlistEndpoint = "/getWaitlist";
            const getWaitlistOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({'class_id': data.class.class_id})
            };
            // Make the request
            const waitlistData = await fetchData(getWaitlistEndpoint, getWaitlistOptions);
            // Check if the user is in the waitlist
            const isWaitlisted = waitlistData.waitlist.find((waitlist) => waitlist.net_id === uwId);
            const updatedCourse = {
                ...data.class,
                add_code_status: (addCodeStatus && addCodeStatus.add_code_status) ? addCodeStatus.add_code_status : "-1",
                add_id: addCodeStatus ? addCodeStatus.add_id : null,
                waitlisted: isWaitlisted  // Set the waitlisted property based on the waitlist data
            };
            // Update the courses array
            setCourses(prevCourses => [...prevCourses, updatedCourse]);
        } catch (error) {
            console.error('Error fetching class data:', error);
        }
    }



    // This function is responsible for opening the modal
    function openModal() {
        // Reset the search term and courses array
        setSearchTerm('');
        // Reset the courses array
        setCourses([]);
        setModalIsOpen(true);
    }

    // This function is responsible for closing the modal
    function closeModal() {
        setModalIsOpen(false);
    }

    // This function is responsible for handling removing a course
    const handleRemoveCourse = async (courseIndex) => {
        // Get the course to remove
        const courseToRemove = selectedCourses[courseIndex];
        // Remove the course
        const response = await removeCourse(courseToRemove);
        // Update the selected courses array
        if (response.status === 200) {
            setSelectedCourses(selectedCourses.filter((_, index) => index !== courseIndex));
        } else {
            setErrorMessage("We cannot remove course");
        }

    };

    // This function is responsible for handling for add or remove add code requests
    const handleAddCodeRequest = async (course) => {
        // Create the endpoint and options for the add or remove add code request
        // If the add code status is 0, then we are removing the add code
        // If the add code status is 1, then we are adding the add code
        const endpoint = course.add_code_status === "0" ? '/removeAddCode' : '/addAddCode';
        const add_id = course.add_code_status === "0" ? course.add_id : generateGUID();
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                add_id: add_id,
                net_id: uwId,
                JobType: 'student',
                add_code: '1234',
                add_code_status: course.add_code_status === "0" ? "1" : "0",
                class: course.class_id,
            })
        };

        try {
            // Make the request
            const response = await fetchData(endpoint, options);
            if (response.status === 200) {
                // Update the requested add codes array
                setRequestedAddCodes((prevRequestedAddCodes) => {
                    if (prevRequestedAddCodes.includes(course.sln)) {
                        return prevRequestedAddCodes.filter((sln) => sln !== course.sln);
                    } else {
                        return [...prevRequestedAddCodes, course.sln];
                    }
                });

                // Update the courses state
                setCourses((prevCourses) => {
                    return prevCourses.map((prevCourse) => {
                        if (prevCourse.sln === course.sln) {
                            return {
                                ...prevCourse,
                                add_code_status: course.add_code_status === "0" ? "-1" : "0",
                                add_id: course.add_code_status === "0" ? null : add_id,  // Update the add_id in the course
                            };
                        } else {
                            return prevCourse;
                        }
                    });
                });

            } else {
                setErrorMessage("we cannot add code or remove add code");
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error:', error);
        }
    };

    // This function is responsible for generating a GUID
    function generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // This function is responsible for handling the waitlist click
    const handleWaitlistClick = async (course) => {
        // If the course is waitlisted, we want to remove it
        if (course.waitlisted) {
            // Create the endpoint and options for the remove waitlist request
            const removeWaitlistEndpoint = "/removeStudentFromWaitlist";
            const removeWaitlistOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({net_id: studentInfo.student.net_id})
            };

            try {
                // Make the request
                const data = await fetchData(removeWaitlistEndpoint, removeWaitlistOptions);

                if (data.status !== 200) {
                    setErrorMessage("Could not remove from waitlist!");
                } else {
                    // Update the course
                    setCourses(courses.map(c =>
                        c.class_id === course.class_id
                            ? {...c, waitlisted: false}
                            : c
                    ));
                }

            } catch (error) {
                console.error('Error removing from waitlist:', error);
                setErrorMessage('Error removing from waitlist:', error);
            }

            // If the course is not waitlisted, we want to add it
        } else {
            // Create the endpoint and options for the add waitlist request
            const addWaitlistEndpoint = "/addWaitlist";
            const addWaitlistOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    net_id: studentInfo.student.net_id,
                    class_id: course.class_id
                })
            };

            try {
                // Make the request
                const data = await fetchData(addWaitlistEndpoint, addWaitlistOptions);
                if (data.status !== 200) {
                    setErrorMessage("Could not add to waitlist!");
                } else {
                    // Update the course
                    setCourses(courses.map(c =>
                        c.class_id === course.class_id
                            ? {...c, waitlisted: true}
                            : c
                    ));
                }

            } catch (error) {
                console.error('Error adding to waitlist:', error);
                setErrorMessage('Error adding to waitlist:', error);
            }
        }
    };

    const formatDays = (course) => {
        let days = '';
        if (course.startM !== null) days += 'Mon-';
        if (course.startT !== null) days += 'Tue-';
        if (course.startW !== null) days += 'Wed-';
        if (course.startTH !== null) days += 'Thu-';
        if (course.startF !== null) days += 'Fri-';
        if (course.startSAT !== null) days += 'Sat-';
        if (course.startSUN !== null) days += 'Sun-';
        // remove trailing '-' character
        return days.slice(0, -1);
    };

    const formatTime = (course) => {
        let time = '';
        if (course.startM !== null) time = formatMilitaryTime(course.startM, course.endM);
        else if (course.startT !== null) time = formatMilitaryTime(course.startT, course.endT);
        else if (course.startW !== null) time = formatMilitaryTime(course.startW, course.endW);
        else if (course.startTH !== null) time = formatMilitaryTime(course.startTH, course.endTH);
        else if (course.startF !== null) time = formatMilitaryTime(course.startF, course.endF);
        else if (course.startSAT !== null) time = formatMilitaryTime(course.startSAT, course.endSAT);
        else if (course.startSUN !== null) time = formatMilitaryTime(course.startSUN, course.endSUN);
        return time;
    };

    const formatMilitaryTime = (start, end) => {
        const startHour = Math.floor(start / 100);
        const startMinute = start % 100;
        const endHour = Math.floor(end / 100);
        const endMinute = end % 100;
        return `${startHour}:${startMinute < 10 ? '0' + startMinute : startMinute} - ${endHour}:${endMinute < 10 ? '0' + endMinute : endMinute}`;
    };

    return (
        <div className={styles.RegistrationPage}>
            <h1 className={styles.TextStroke}>Registration - Autumn 2023</h1>
            <div className={styles.StudentInfoClass}>

                <select name="quarter" id="quarter">
                    <option value="autumn">Autumn 2023</option>
                    <option value="winter">Winter 2024</option>
                    <option value="spring">Spring 2024</option>
                    <option value="summer">Summer 2024</option>
                </select>
                <button>Change Quarter</button>

                {studentInfo && (
                    <>
                        <p>Prepared for: {studentInfo.student.student_name}</p>
                        <p>Prepared on: {new Date().toLocaleString('en-US', options)}</p>
                        <p>Major: {studentInfo.student.major}</p>
                    </>
                )}

                <button onClick={openModal}>َAdd Courses</button>
                {/*Modal for adding courses*/}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    className={styles.Modal}
                    overlayClassName={styles.Overlay}
                >
                    <h2 className={styles.AddCourseHeader}>Search and Add Course</h2>
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={handleEnter}/> 
                    <button onClick={searchCourse}>Search</button>

                    {courses.length > 0 && (
                        // table for the modal
                        <table className={styles.ModalTable}>
                            <thead>
                            <tr>
                                <th></th>
                                <th>SLN</th>
                                <th>Course</th>
                                <th>Credits</th>
                                <th>Title</th>
                                <th>Professor</th>
                                <th>Class Day(s)</th>
                                <th>Class Time</th>
                                {courses.some(course => course.add_code_required === 1) && <th>Add Code Required</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {courses.map((course, index) => (
                                <tr key={index}>
                                    <td>
                                     {
                                        selectedCourses.find(c => c.class_id === course.class_id)
                                            ? <span style={{color: 'green'}}>Registered</span>
                                            : ((course.capacity - course.enrolled) === 0)
                                                ? <img
                                                    style={{cursor: 'pointer'}}
                                                    src={course.waitlisted ? waitlistSelected : waitlistNotSelected}
                                                    alt="Waitlist Status"
                                                    width="50"
                                                    height="50"
                                                    onClick={() => handleWaitlistClick(course)}
                                                />
                                                : <>
                                                    <input type="checkbox"
                                                    onChange={() => handleCheckboxChange(course)}
                                                    disabled={course.add_code_required === 1 && course.add_code_status !== "1"} />
                                                </>

                                     }   
                                        
                                    </td>
                                    <td>{course.sln}</td>
                                    <td>{course.class_id}</td>
                                    <td>{course.credits}</td>
                                    <td>{course.class_name}</td>
                                    <td>{course.professor}</td>
                                    <td>{formatDays(course)}</td>
                                    <td>{formatTime(course)}</td>
                                    <td hidden={course.add_code_required !== 1}>
                                        {course.add_code_required === 1 && (
                                            <>
                                                {course.add_code_status === "-1" && (
                                                    <button className={styles.RequestButton} onClick={() => handleAddCodeRequest(course)}>Request Add Code</button>
                                                )}
                                                {course.add_code_status === "0" && (
                                                    <span onClick={() => handleAddCodeRequest(course)} className={styles.InProgressLabel}>
                                                        Add code in progress
                                                        <span className={styles.SecondLineYellow}>(click to remove add code request)</span>
                                                    </span>
                                                )}
                                                {course.add_code_status === "1" && (
                                                    <span style={{color: 'green'}}>Add code added</span>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            </tbody>
                        </table>
                    )}
                    {checkedCourses.length > 0 ? (
                        <button onClick={handleCloseModal}>Add Course</button>
                    ) : (
                        <button hidden={courses.length <= 0} onClick={closeModal}>Close</button>
                    )}
                </Modal>
            </div>
            {selectedCourses.length > 0 && (
                <div className={styles.LegendContainer}>
                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <div className={styles.legendColor} style={{backgroundColor: 'green'}}></div>
                            <div>Easy (Average GPA: 3.4 - 4.0)</div>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendColor} style={{backgroundColor: 'orange'}}></div>
                            <div>Hard (Average GPA: 2.6 - 3.3)</div>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendColor} style={{backgroundColor: 'red'}}></div>
                            <div>Extremely Hard (Average GPA: 0 - 2.5)</div>
                        </div>
                    </div>
                </div>
            )}
            {selectedCourses.length > 0 && (
                // table for the selected courses
                <table className={styles.RegistrationTable}>
                    <thead>
                    <tr>
                        <th>SLN</th>
                        <th>Course</th>
                        <th>Credits</th>
                        <th>Title</th>
                        <th>Professor</th>
                        <th>Class Day(s)</th>
                        <th>Class Time</th>
                        <th>Average GPA</th>
                        <th>Rating</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedCourses.map((course, index) => {
                        let bgColor;
                        let hoverText;
                        if (course.average_gpa <= 2.5) {
                            bgColor = 'red';
                            hoverText = 'Extremely Hard';
                        } else if (course.average_gpa <= 3.3) {
                            bgColor = 'orange';
                            hoverText = 'Hard';
                        } else {
                            bgColor = 'green';
                            hoverText = 'Easy';
                        }

                        return (
                            <tr key={index} style={{backgroundColor: bgColor}} title={hoverText}>
                                <td>{course.sln}</td>
                                <td>{course.class_id}</td>
                                <td>{course.credits}</td>
                                <td>{course.class_name}</td>
                                <td>{course.professor}</td>
                                <td>{formatDays(course)}</td>
                                <td>{formatTime(course)}</td>
                                <td>{course.average_gpa}</td>
                                <td>
                                    <ReactStars
                                        count={5}
                                        size={24}
                                        activeColor="#ffd700"
                                        value={course.rating / 2}
                                        edit={false}
                                        isHalf={true}
                                    />
                                </td>
                                <td><button onClick={() => handleRemoveCourse(index)}>Remove Course</button></td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td colSpan={2}>Total Credits</td>
                        <td>{selectedCourses.reduce((total, course) => total + Number(course.credits), 0)}</td>
                    </tr>
                    </tbody>
                </table>
            )}
            {errorMessage &&
                <div className={styles.modalErr}>
                    <div className={styles.modalContentErr}>
                        <div className={styles.alertHeaderErr}>Alert</div>
                        <p>{errorMessage}</p>
                        <button className={styles.closeButtonErr} onClick={() => setErrorMessage('')}>
                            &times;
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default RegistrationPage;