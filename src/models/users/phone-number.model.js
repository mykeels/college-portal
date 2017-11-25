import Sequelize from 'sequelize'

export default Sequelize.define('phone_number', {
    id: {
        type: Sequelize.NUMBER,
        primaryKey: true,
        autoIncrement: true
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    creation_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})