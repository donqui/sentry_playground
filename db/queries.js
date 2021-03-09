const db = require('./pool')


async function getUser(id) {
  return (await db.query(`SELECT * from web_users WHERE id = $1`, [id])).rows
}

async function addUser(id) {
  return (await db.query(`SELECT * from web_users WHERE id = $1`, [id])).rows
}


module.exports = {
  getUser
}
