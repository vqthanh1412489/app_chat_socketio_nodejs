const { app, server } = require('./app');

server.listen(process.env.PORT || 3000, () => console.log('Server Started'));