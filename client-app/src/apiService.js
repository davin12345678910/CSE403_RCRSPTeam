const BASE_URL = 'https://api-rcrsp.onrender.com';
const fetchData = async (endpoint, options) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export { fetchData };