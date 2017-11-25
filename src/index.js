import db from './db'

db.sync().then(() => {
    console.log('db migrations successful!')
  })