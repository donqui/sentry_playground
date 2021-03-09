const { Pool } = require('pg');

let pool = null;

pool = new Pool({
  max: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', client => {
  console.log('### CONNECTED')
})

pool.on('acquire', client => {
  console.log('### CONN ACQUIRED')
})

pool.on('remove', client => {
  console.log('### CONN REMOVED')
})

// pool.on('error', (err) => {
//   console.log('### CONN ERR')
// })

module.exports = {
  query: (text, params) => pool.query(text, params)
};
