
import axios from "axios";

export default defineEventHandler(async (event) => {
  const getMarket = await axios(
    "https://api-osmosis.imperator.co/tokens/v2/historical/bcna/chart?tf=30"
  );
  return {
    getMarket: getMarket.data
  }
})
