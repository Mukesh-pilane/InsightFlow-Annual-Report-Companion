import axios from 'axios';

export const vectorizer = (url,id)=>{  
  const apiUrl = import.meta.env.VITE_API_BASE_URL + "/api/vectorizer";
  axios.post(apiUrl,{
    url:url,
    id:id
  })
    .then(response => {
      // Handle the successful response
      return response.data;
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error(error);
    })
}