import Sequelize from 'sequelize'
import config from './index.config'
import fs from 'fs'
import path from 'path'
import DotEnv from 'dotenv'
import RegisterUserModels from './models/users'

DotEnv.config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false
  });

RegisterUserModels(sequelize)

sequelize.sync().then(() => {
  console.log('db migrations successful!')
})

