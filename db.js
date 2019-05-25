const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uri = 'mongodb://admin:sinhvien1T@ds133556.mlab.com:33556/pvcititech';

function getDatabaseUri() {
    if (process.env.NODE_ENV === 'test') return 'mongodb://localhost/AppChatTest';
    if (process.env.NODE_ENV === 'production') return uri;
    return 'mongodb://localhost/AppChat';
}

mongoose.connect(getDatabaseUri(), { useNewUrlParser: true })
.then(() => console.log('Connect Success'))
.catch(err => console.log(err));