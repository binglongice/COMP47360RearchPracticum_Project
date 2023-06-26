// import axios from 'axios';

// const API_KEY = 'IQuA3KpE_M1B77QUHXQZ_OenMn_QL7szzkV_pdngYOnkXoBrVrMTRGmL2Qicq8yJC-m2vEHM6EUSLrUcoE1L7Rgl9mMETsxS1F1WWB49Y2n9PZJo13n-ziM4bLWRZHYx';

// const BASE_URL = 'https://api.yelp.com/v3';

// export const searchCafe = async () => {
//     try {
//         const response = await axios.get(`${BASE_URL}/businesses/search`, {
//         headers: {
//             Authorization: `Bearer ${API_KEY}`,
//         },
//         params: {
//             term: 'cafe',
//             location: 'Manhattan',
//         },
//         });
//         return response.data;
//     } catch (error) {
//         // Handle error
//     }
//     };