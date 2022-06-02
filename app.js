const Logger = require('./logger');
const logger = new Logger();


//Register a listener 
logger.on('messageLogged', (arg) => {
    console.log('Listener Called', arg);
});
logger.log('message');

const http = require('http');
