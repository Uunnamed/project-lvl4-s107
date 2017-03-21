import Sequelize from 'sequelize';

export default connect => connect.define('TaskStatus', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  // freezeTableName: true,
});
