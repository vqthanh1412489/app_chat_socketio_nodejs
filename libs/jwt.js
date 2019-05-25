const { sign, verify } = require('jsonwebtoken');
const KEY = 'vqthanh1412489';

const createToken =  function (obj) {
    return new Promise((resolve, reject) => {
        sign(obj, KEY, { expiresIn: '2 days' }, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        });
    });
}

const verifyToken =  function (token) {
    return new Promise((resolve, reject) => {
        verify(token, KEY, (err, obj) => {
            if (err) return reject(err);
            resolve(obj);
        });
    });
}

module.exports = { createToken, verifyToken };