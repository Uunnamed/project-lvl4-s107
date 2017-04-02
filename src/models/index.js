import getUser from './User';
import getTask from './Task';
import getTag from './Tag';
import getTaskStatus from './TaskStatus';
import getComment from './Comment';
import getTaskTag from './TaskTag';


export default (connect) => {
  const models = {
    User: getUser(connect),
    Task: getTask(connect),
    TaskStatus: getTaskStatus(connect),
    Tag: getTag(connect),
    Comment: getComment(connect),
    TaskTag: getTaskTag(connect),
  };
  models.User.hasMany(models.Task);
  models.Task.belongsTo(models.User);
  models.Task.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assignedToUser' });
  models.TaskStatus.hasMany(models.Task);
  models.Task.belongsTo(models.TaskStatus);
  models.Comment.belongsTo(models.Task);
  models.Comment.belongsTo(models.User);
  models.User.hasMany(models.Comment);
  models.Task.hasMany(models.Comment);
  models.Task.belongsToMany(models.Tag, { through: models.TaskTag });
  models.Tag.belongsToMany(models.Task, { through: models.TaskTag });
  return models;
};
