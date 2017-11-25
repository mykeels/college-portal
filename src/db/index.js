require('dotenv').config()
import Sequelize from 'sequelize'
import RegisterUserModels from './models/users'

console.log(process.env.DB_HOST)

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

export const {
  User,
  UserType,
  Role,
  PhoneNumber,
  Action,
  Image,
  ImageType
} = RegisterUserModels(sequelize)

export default sequelize