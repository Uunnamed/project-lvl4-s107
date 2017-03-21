import getUser from './User';
import getTask from './Task';
import getTag from './Tag';
import getTaskStatus from './TaskStatus';


export default (connect) => {
  const models = {
    User: getUser(connect),
    Task: getTask(connect),
    TaskStatus: getTaskStatus(connect),
    Tag: getTag(connect),
  };
  models.User.hasMany(models.Task);
  models.Task.belongsTo(models.User);
  models.Task.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assignedToUser' });
  models.TaskStatus.hasMany(models.Task);
  models.Task.belongsTo(models.TaskStatus);
  return models;
};
