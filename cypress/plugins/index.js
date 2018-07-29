const compose = require('docker-compose');
const { reduce } = require('lodash');

module.exports = (on, config) => {
  on('task', {
    wpCli: ({ command, args = {} }) => {
      const cmdString = reduce(args, (carry, argValue, argKey) => {
        carry += ` --${argKey}=${argValue}`;
        return carry;
      }, `wp ${command}`);
      console.log(cmdString);
      return compose.run('wp-cli', cmdString, { cwd: process.cwd() })
        .then(({ err, out }) => {
          console.error(err);
          return args.format === 'json' ? JSON.parse(out) : out
        });
    }
  });

  // Fix for issue which presented itself in Chrome 68
  // https://github.com/cypress-io/cypress/issues/2037#issuecomment-407898194
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      args = args.filter((arg) => {
        return arg !== '--disable-blink-features=RootLayerScrolling'
      })
      return args
    }
  })
};
