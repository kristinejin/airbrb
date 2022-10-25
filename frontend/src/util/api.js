import config from '../config';
export const apiCall = (route, method, body) => {
  const user_token = localStorage.getItem("token");
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:${config.BACKEND_PORT}/${route}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user_token,
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