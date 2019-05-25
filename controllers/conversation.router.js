const { json } =  require('body-parser');
const { Router } = require('express');
const { ConversationServices } = require('../services/ConversationServices');

const conversationRouter = Router();
conversationRouter.use(json());

conversationRouter.post('/create', (req, res) => {
    const { sentUser, recieverUser } = req.body;
    ConversationServices.createConversation(sentUser, recieverUser)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err));
});

conversationRouter.put('/addMessage', (req, res) => {
    const { idConversation, content, nameUser } = req.body;
    ConversationServices.addMessageToConversation(idConversation, content, nameUser)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err));
});
conversationRouter.get('/getConversations/:idUser', (req, res) => {
    const { idUser } = req.params;
    ConversationServices.getConversationsWithUser(idUser)
    .then(data => { res.status(200).send(data)})
    .catch(err => res.status(404).send('eRROR..', err));
});

module.exports = { conversationRouter };