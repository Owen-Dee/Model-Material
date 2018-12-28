import Cookie from 'js-cookie';

const COOKIE_KEY_ACCESS_TOKEN = 'qunhe-jwt';
const COOKIE_KEY_REFRESH_TOKEN = 'qunhe-refresh';


const cookieOptions = { expires: Infinity, httpOnly: false };

function getTokensFromCookie() {
    // const accessToken = Cookie.get(COOKIE_KEY_ACCESS_TOKEN);
    // const refreshToken = Cookie.get(COOKIE_KEY_REFRESH_TOKEN);
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWxpZGF0ZWQiOmZhbHNlLCJpZCI6IjNGTzRLNFZZQUMzQSIsImF2YXRhciI6Imh0dHA6Ly9xaHl4cGljLm9zcy5hbGl5dW5jcy5jb20vYXZhdGFydXBsb2FkLzIwMTgvMTEvMjMvYXZhdGFydXBsb2FkL0xQMlRSN1ZNRFE3VDZBQUlBQTg4ODg4OC5qcGciLCJsb2NhbGUiOm51bGwsImV4cCI6MTU0NDE4NzQ3Miwia19pZCI6IjNGTzRLNFZZTDg5SiIsImVtYWlsIjoib29vb0BxdW5oZW1haWwuY29tIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiZGxha3NqIn0.gKOx4cCb-0z4ZjarSiOiP8e0C7OHKYDhBWNaH6dUIMQ';
    const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWxpZGF0ZWQiOmZhbHNlLCJhdGkiOiI4NTMxZDk5Ni04ZTkzLTRiNWUtYmZmNC1jN2Y3Zjc5ZGQzZTIiLCJpZCI6IjNGTzRLNFZZQUMzQSIsImF2YXRhciI6Imh0dHA6Ly9xaHl4cGljLm9zcy5hbGl5dW5jcy5jb20vYXZhdGFydXBsb2FkLzIwMTgvMTEvMjMvYXZhdGFydXBsb2FkL0xQMlRSN1ZNRFE3VDZBQUlBQTg4ODg4OC5qcGciLCJsb2NhbGUiOm51bGwsImV4cCI6MTU0Mzk4ODkzMCwia19pZCI6IjNGTzRLNFZZTDg5SiIsImVtYWlsIjoib29vb0BxdW5oZW1haWwuY29tIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiZGxha3NqIn0.QTbe6THW6JoUZIimDd_chfqhjPjkaoDWqyKeGrBTTdY';
    return {
        accessToken,
        refreshToken
    };
}

function setTokensToCookie({ accessToken, refreshToken, expiresIn } = {}) {
    if (accessToken && refreshToken && expiresIn) {
        Cookie.set(COOKIE_KEY_REFRESH_TOKEN, refreshToken, cookieOptions);
        Cookie.set(COOKIE_KEY_ACCESS_TOKEN, accessToken, {
            ...cookieOptions,
            expires: expiresIn / 3600 / 24
        });
    } else {
        throw new Error('accessToken & refreshToken & expiration must not be empty!');
    }
}

export default (function () {
    let _accessToken = null;
    let _refreshToken = null;
    return {
        get() {
            if (_accessToken && _refreshToken) {
                return {
                    accessToken: _accessToken,
                    refreshToken: _refreshToken
                };
            }

            return getTokensFromCookie();
        },
        set({ accessToken, refreshToken, expiresIn } = {}) {
            _accessToken = accessToken;
            _refreshToken = refreshToken;
            setTokensToCookie({
                accessToken: _accessToken,
                refreshToken: _refreshToken,
                expiresIn
            });
        },
        clear() {
            Cookie.remove(COOKIE_KEY_ACCESS_TOKEN, cookieOptions);
            Cookie.remove(COOKIE_KEY_REFRESH_TOKEN, cookieOptions);
            _accessToken = null;
            _refreshToken = null;
        }
    };
})();
