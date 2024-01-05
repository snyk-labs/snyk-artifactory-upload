import * as bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'Logger',
  // Configure streams, serializers, etc.
});

export default logger;

logger.info("hello")
