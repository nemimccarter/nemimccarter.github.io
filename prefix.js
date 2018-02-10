var fa17g09_env_prefix;
var env = process.env.NODE_ENV || 'development';
if ('production' === env) {
   fa17g09_env_prefix = 'fa17g09';
} else {
    fa17g09_env_prefix = '';
}

module.exports = fa17g09_env_prefix;
