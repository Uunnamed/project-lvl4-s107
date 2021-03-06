import Sequelize from 'sequelize';

export default connect => connect.define('TaskStatus', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
},
  {
    getterMethods: {
      toMap: function toMap() {
        return { id: this.id, name: this.name };
      },
    },
    freezeTableName: true,
  },
);
