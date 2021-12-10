class Api {
    constructor(options) {
        this._url = options.url;
        this._headers = options.headers;
    }

    _getResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Внимание! Ошибка: ${res.status}`)
    }

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
            method: 'GET',
            headers: { ...this._headers, Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(this._getResponse);
    }

    getUserData() {
        return fetch(`${this._url}/users/me`, {
            method: 'GET',
            headers: { ...this._headers, Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(this._getResponse);
    }

    patchUserData(data) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: { ...this._headers, Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        })
        .then(this._getResponse)
    }

    patchUserAvatar(data) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: { ...this._headers, Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({
                avatar: data.avatar
            })
        })
        .then(this._getResponse);
    }

    postCard(data) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: { ...this._headers, Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({
                name: data.name,
                link: data.link
            })
        })
        .then(this._getResponse);
    }

    deleteCard(id) {
        return fetch(`${this._url}/cards/${id}`, {
            method: 'DELETE',
            headers: { ...this._headers, Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(this._getResponse);
    }

    changeLikeCardStatus(id, isLiked) {
        return fetch(`${this._url}/cards/likes/${id}`, {
            method: isLiked ? 'PUT' : 'DELETE',
            headers: { ...this._headers, Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(this._getResponse);
    }
}

const api = new Api({
    url: 'https://api.pancfly.students.nomoredomains.rocks',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;