const level = (msg) => new Date().toISOString() + ' ' + msg;

export const logger = {
  info: (...args) => console.log(level('[info]'), ...args),
  warn: (...args) => console.warn(level('[warn]'), ...args),
  error: (...args) => console.error(level('[error]'), ...args),
};
