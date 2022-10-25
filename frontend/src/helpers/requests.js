import port from '../config.json'
export function sendRequest({route, method, body, token}) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        method: method,
    }
    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:${port.BACKEND_PORT}/${route}`, options)
        .then(res => {
            return res.json();
        })
        .then(data => {
            if (data.error) {
                reject(data.error);
            }
            else {
                resolve(data);
            }
        })
        .catch(data => reject(data));
    });
}