const { Conversation } = require('../models/Conversation');

class ConversationServices {
    static createConversation(sentUser, recieverUser) {
        return new Promise((resolve, reject) => {
            const conversation = new Conversation({ sentUser, recieverUser });
            conversation.save((err, conver) => {
                if (err) return reject({ err });
                resolve(conver);
            });
        });
    }
    static async addMessageToConversation(idConversation, content, nameUser) {
        const conversation = await Conversation.findByIdAndUpdate(
            idConversation, {
                $push: {
                    messages: {
                        nameUser,
                        content
                    }
                }
            }, { new: true }
        );
        if (!conversation) return { err: 'Conversation not found' };
        return conversation;
    }

    static async getConversationsWithUser(idUser) {
        const conversations = await Conversation.find({ $or: [{ message: idUser }, { recieverUser: idUser }] });
        return conversations;
    }

    static findConversationWithSentAndReceive(sentUser, recieverUser) {
        return new Promise((resolve, reject) => {
            Conversation.findOne({
                $and: [
                    { $or: [{ sentUser }, { sentUser: recieverUser }] },
                    { $or: [{ recieverUser}, {recieverUser: sentUser} ] }
                ]
            }
                ,
                (err, conver) => {
                    if (err) return reject(err);
                    resolve(conver)
                }
            )
        })
    }

}

module.exports = { ConversationServices }