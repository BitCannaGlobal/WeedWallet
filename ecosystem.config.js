module.exports = {
  apps: [
    {
      name: 'WeedWallet3',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
