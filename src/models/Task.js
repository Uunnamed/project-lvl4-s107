import Sequelize from 'sequelize';

export default connect => connect.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: Sequelize.TEXT,
  status: {
    type: Sequelize.INTEGER,
    field: 'TaskStatusId',
    defaultValue: 1,
    validate: {
      notEmpty: true,
    },
  },
  creator: {
    type: Sequelize.INTEGER,
    field: 'UserId',
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  assignedTo: {
    type: Sequelize.INTEGER,
    field: 'assignedTo_id',
    allowNull: false,
  },
  // freezeTableName: true, // Model tableName will be the same as the model name
});
