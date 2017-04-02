import Sequelize from 'sequelize';

export default connect => connect.define('Comment', {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  creator: {
    type: Sequelize.INTEGER,
    field: 'UserId',
  },
  taskId: {
    type: Sequelize.INTEGER,
    field: 'TaskId',
  },
}, {
  getterMethods: {
    time: function time() {
      const date = new Date(Date.parse(this.createdAt));
      return date.toTimeString();
    },
  },
  freezeTableName: true, // Model tableName will be the same as the model name
});
