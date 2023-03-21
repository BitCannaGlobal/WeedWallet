const express = require('express')


// Create express instance
const app = express()

// Require API routes
const poolApr = require('./routes/pool-apr')


// Import API Routes
app.use(poolApr)


// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
