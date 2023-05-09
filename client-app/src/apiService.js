const BASE_URL = 'http://localhost:3000';
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