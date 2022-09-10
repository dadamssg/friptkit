const fs = require('fs');

function log(msg) {
  fs.appendFileSync(`${__dirname}/script.log`, `${msg}\n`);
}

async function resolveValue(eventListenerMap) {
  let cb;
  const send = (action) => process.send(action);
  return new Promise((resolve) => {
    log('initiating resolveValue');
    const publicResolve = (value) => {
      log('resolving');
      // call resolved listener if defined
      if (typeof eventListenerMap.resolved === 'function') {
        eventListenerMap.resolved({
          send,
          value,
        });
      }
      // actually resolve the promise
      resolve(value);
    };
    // define the actual process listener
    cb = (action) => {
      log('resolveValue received action', JSON.stringify(action));
      const fn = eventListenerMap[action.type];
      if (typeof fn === 'function') {
        fn({
          action,
          resolve: publicResolve,
          send,
        });
      }
    };
    process.on('message', cb);
    // call init listener if defined
    if (eventListenerMap.init) {
      eventListenerMap.init({ send });
    }
  })
    .catch((error) => log(JSON.stringify(error.message)))
    .finally(() => {
      log('clean up callback');
      process.off('message', cb);
    });
}

function arg(placeholder) {
  return resolveValue({
    init: ({ send }) =>
      send({
        type: 'collect-input:waiting_for_input',
        payload: { placeholder },
      }),
    'collect-input:submitted_input': ({ action, resolve }) => {
      resolve(action.payload);
    },
  });
}

module.exports = { log, arg };
