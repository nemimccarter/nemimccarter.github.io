module.exports = {
  apps : [
      {
        name: "fa17g09",
        script: "public_html/bin/www",
        instances: 1,
        exec_mode: "fork",
        watch: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 17009,
            "NODE_ENV": "production",
        }
      }
  ]
}
