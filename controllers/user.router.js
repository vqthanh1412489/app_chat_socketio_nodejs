const { json } =  require('body-parser');
const { Router } = require('express');
const { UserServies } = require('../services/UserServices');

const userRouter = Router();
userRouter.use(json());

userRouter.post('/signup', (req, res) => {
    const { username, password, name } = req.body;
    UserServies.signUp(username, password, name)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err));
});

userRouter.post('/signin', (req, res) => {
    const { username, password } = req.body;
    UserServies.signIn(username, password)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err));
});

userRouter.post('/checkToken', (req, res) => {
    const { token } = req.body;
    UserServies.check(token)    
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err));
});

userRouter.post('/getId', (req, res) => {
    const { username } = req.body;
    UserServies.findIdByUsername(username)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err));
    
});

module.exports = { userRouter };