const axios = require('axios');

const searchByQuery = (searchTerm) => {
  axios.get(`http://localhost:1337/client/search${searchTerm}`)
    .then(response => {
      console.log(response);
      return response;
    })
    .catch(error => {
      console.log(error);
    });
};
