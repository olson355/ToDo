
// FROM TIMESTAMPS SLIDE
var winston = require('winston');

var tsFormat = () => (new Date()).toLocaleTimeString();

var logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
    })
  ]
});
logger.level = 'debug';
logger.info('Hello world');
logger.debug('Debugging info');



