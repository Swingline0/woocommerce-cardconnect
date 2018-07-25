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
  })
};
