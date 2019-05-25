const { User } = require('../models/User');
const { compare, hash } = require('bcrypt');
const { createToken, verifyToken } = require('../libs/jwt');

class UserServies {
    static async signUp(username, password, name) {
        const userCheck = await User.findOne({ username });
        if (userCheck) return { err: 'Username is exists' }
        const encrypted = await hash(password, 8);
        const user = new User({ username, password: encrypted, name });
        await user.save();
        const inforUser = user.toObject();
        delete inforUser.password;
        const token = await createToken({ _id: user._id });
        return { user: inforUser, token };
    }

    static async signIn(username, password) {
        const user = await User.findOne({ username });
        if (!user) return { err: 'Username not exists' }
        const same = await compare(password, user.password);
        if (!same) return { err: 'Password invalid' }
        const inforUser = user.toObject();
        delete inforUser.password;
        const token = await createToken({ _id: user._id });
        return { user: inforUser, token };
    }

    static async check(token) {
        const { _id } = await verifyToken(token);
        const user = await User.findById(_id);
        if (!user) return { err: 'Username not exists' }
        const userInfo = user.toObject();
        delete userInfo.password;
        const newToken = await createToken({ _id: user._id });
        return { user: userInfo, token: newToken };
    }

    static async findIdByUsername(username){
        const user = await User.findOne({ username })
        if (user){
            return user._id.toString();
        }
    }
}

module.exports = { UserServies };