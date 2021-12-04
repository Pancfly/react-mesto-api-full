class Auth {
  constructor (options) {
    this._url = options.url;
    this._headers = options.headers;
  }

  _handleOriginalResponse(res) {
    if (!res.ok) {
      return Promise.reject(new Error(`Ошибка: ${res.status}`));
    }
    return res.json();
  }

  register(email, password) {
    return fetch(`${this._url}/signup`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({ email, password })
    })
    .then(this._handleOriginalResponse)
  }

  authorize(email, password) {
    return fetch(`${this._url}/signin`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({ email, password })
    })
    .then(this._handleOriginalResponse);
  }

  checkToken(token) {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      }
    })
    .then(this._handleOriginalResponse)
  }
}

const auth = new Auth({
  url: 'https://api.pancfly.students.nomoredomains.icu',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default auth;