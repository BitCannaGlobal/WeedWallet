module.exports = {
  apps: [
    {
      name: 'WeedWallet3',
      port: '4200',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
