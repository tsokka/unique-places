const app = require('./app');
const env = require('./config/env');
const { connectDb } = require('./config/db');

connectDb().then(() => {
  app.listen(env.port, () => console.log(`unique.places API: http://localhost:${env.port}/api`));
}).catch(err => { console.error('Failed to start:', err); process.exit(1); });
