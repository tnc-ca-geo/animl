module.exports = {
  apps: [
    {
      name: 'animl',
      script: './src/bin/www',
      instances: 1,
      autorestart: true,
      watch: false,
      exp_backoff_restart_delay: 100,
      time: true,
    }
  ],
};
