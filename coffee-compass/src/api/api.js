import axios from 'axios';

export const searchCafes = async (term, location) => {
  try {
    const response = await axios.get('http://localhost:8000/api/search_cafe/', {
      params: { term, location }
    });
    return response.data.businesses;
  } catch (error) {
    // Handle error
    throw error;
  }
};