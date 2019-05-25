const mongooes = require('mongoose');

const Schema = mongooes.Schema;

const ConversationSchema = new Schema({
    sentUser: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    recieverUser: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    messages: [
        {
            nameUser: {
                type: String,
            },
            content: {
                type: String
            }
        }
    ]
});

ConversationSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next(error);
    }
});

ConversationSchema.index({ sentUser: 1, recieverUser: 1 }, { unique: true });

const Conversation = mongooes.model('conversations', ConversationSchema);

module.exports = { Conversation };

