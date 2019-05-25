const express = require('express');
const app = express();
var cors = require('cors');
require('./db');
const _ = require('lodash');

const { ConversationServices } = require('./services/ConversationServices');
const { UserServies } = require('./services/UserServices');

var server = require('http').Server(app);
var io = require('socket.io')(server);

const { userRouter } = require('./controllers/user.router');
const { conversationRouter } = require('./controllers/conversation.router');

app.use(cors());
app.use('/users', userRouter);
app.use('/conversations', conversationRouter);

app.get('/', (req, res) => {
    res.send('Server Started');
});

var usernames = [];
io.on('connection', socket => {
    var connections = [];

    for (room in socket.adapter.rooms) {
        connections.push(room);
        // listChats.push({ connection: room })
    }
    socket.on('client-sent-username', username => {
        if (!_.includes(usernames, username)) {
            usernames.push(username);
        }
        // listChats.push({ connection: room, username })
        io.sockets.emit('server-sent-rooms', usernames);
    });

    socket.on('client-sent-typing', data => {
        var { content, sentUser, receiverUser } = data;
        ConversationServices.findConversationWithSentAndReceive(sentUser, receiverUser)
        .then(conver => {
            const id = conver._id;
            ConversationServices.addMessageToConversation(id, content, sentUser);
        })
        .catch(err => console.log(err));
        console.log(data);
    });

    socket.on('client-sent-conversation', data => {
        var { sentUser, receiverUser } = data;
        // UserServies.findIdByUsername(data.receiverUser)
        //     .then(id => {
        //         ConversationServices.createConversation(data.sentUser, id)
        //         .then(conver => { return; })
        //         .catch(err => console.log(err));
        //     })
        UserServies.findIdByUsername(receiverUser)
            .then(id => {
                ConversationServices.findConversationWithSentAndReceive(sentUser, id)
                    .then(conver => {
                        if (!conver) {
                            ConversationServices.createConversation(data.sentUser, id)
                                .then(conver => {
                                    socket.emit('server-sent-conversation', conver);
                                })
                                .catch(err => console.log('err', err));
                        } else {
                            socket.emit('server-sent-conversation', conver);
                        }
                    })
                    .catch(err => console.log('errr', err));

            })
    })

    socket.on('disconnect', function () {
        var index = myFind(socket.id, connections);
        connections.splice(index, 1);
        usernames.splice(index, 1);
        io.emit('server-sent-disconnect', usernames);
    });
});

const myFind = (id, arr) => {
    var result = -1;
    arr.forEach((element, index) => {
        if (id === element) result = index;
    });
    return result;
}

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!!');
});
app.get('*', function (req, res, next) {
    setImmediate(() => {
        next(new Error('Ohh!! Something went wrong'));
    });
});

module.exports = { app, server };