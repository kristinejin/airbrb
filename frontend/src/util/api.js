import config from '../config';

export const apiCall = (route, method, body) => {
  const userToken = localStorage.getItem('token');
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:${config.BACKEND_PORT}/${route}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    })
      .then(response => {
        return response.json();
      }).then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          resolve(data);
        }
      });
  });
}
