import pino, { destination } from 'pino';

const logger = pino({
  transport: {
    target: 'pino/file',
    options: {
      translateTime: 'SYS:dd/mm/yyyy HH:mm:ss',
      destination: './app-logs.log',
      mkdir: true
    },
  },
});

export default logger