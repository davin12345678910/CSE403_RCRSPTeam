const GradeInquiry = () => {
    return (
       <div>
            <h1>Grade Inquiry - Spring 2023</h1>
            <select name="quarter" id="quarter">
                <p> 
                Select a different quarter to report:
                </p>
               
                <option value="autumn">Autumn 2023</option>
                <option value="winter">Winter 2024</option>
                <option value="spring">Spring 2024</option>
                <option value="summer">Summer 2024</option>
                
                
            </select>
            <button>Submmit</button>
            <div>
        
       </div>
       </div>
   
       

    )
}
export default GradeInquiry;