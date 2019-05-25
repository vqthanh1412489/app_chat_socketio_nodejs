const mongooes = require('mongoose');

const Schema = mongooes.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
});

const User = mongooes.model('users', UserSchema);

module.exports = { User };

