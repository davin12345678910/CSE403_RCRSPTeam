const RegistrationPage = () => {
    return (
        <div>
            <h1>Registration - Autumn 2023</h1>
            <div>
                <select name="quarte" id="quarter">
                    <option value="autumn">Autumn 2023</option>
                    <option value="winter">Winter 2024</option>
                    <option value="spring">Spring 2024</option>
                    <option value="summer">Summer 2024</option>
                </select>
                <button>Change Quarter</button>

               
                <p>Prepared for: NAME</p>
                <p>Prepared on: DATE</p>
                <p>Major: Computer Science</p>
              

               
        
                {/* <select name="major" id="major">
                    <option value="cs">Computer Science</option>
                    <option value="ee">Electrical Engineering</option>
                    <option value="me">Mechanical Engineering</option>
                    <option value="ce">Civil Engineering</option>
                </select>
                <button>Change Major</button>

                <select name="year" id="year">
                    <option value="freshman">Freshman</option>
                    <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                </select>
                */}
                
    
            </div>
        </div>
    )
    
}

export default RegistrationPage;