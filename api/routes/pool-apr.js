const { Router } = require('express')
var bodyParser = require('body-parser')
import axios from 'axios'

const router = Router()

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

/* GET pool apr. */
router.get('/apr/572', async function (req, res, next) {
  const apr572 = await axios('https://api-osmosis.imperator.co/apr/v2/572')
  res.json(apr572.data)
})
router.get('/apr/571', async function (req, res, next) {
  const apr571 = await axios('https://api-osmosis.imperator.co/apr/v2/571')
  res.json(apr571.data)
})
router.get('/pool/572', async function (req, res, next) {
  const apr572 = await axios('https://api-osmosis.imperator.co/pools/v2/572')
  res.json(apr572.data)
})
router.get('/pool/571', async function (req, res, next) {
  const apr571 = await axios('https://api-osmosis.imperator.co/pools/v2/571')
  res.json(apr571.data)
})
router.get('/price', async function (req, res, next) {
  const getPrice = await axios('https://bcnaracle.bitcanna.io/bcnaracle.json')
  res.json(getPrice.data)
})
router.get('/market-chart', async function (req, res, next) {
  // const getMarket = await axios('https://api.coingecko.com/api/v3/coins/bitcanna/market_chart?vs_currency=usd&days=14&interval=daily') // &interval=daily
  const getMarket = await axios('https://api-osmosis.imperator.co/tokens/v2/historical/bcna/chart?tf=30')
  res.json(getMarket.data)
})
module.exports = router
