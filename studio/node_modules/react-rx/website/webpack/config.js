const createConfig = require('./createConfig')

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'

module.exports = createConfig(env)
