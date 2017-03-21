import buildFormObj from '../lib/formObjectBuilder';

export default (router, { Task, User, TaskStatus }) => {
  const getParamsForForm = async () => {
    const users = await User.findAll().then(result => result.map(user => ({ id: user.id, name: user.get('fullName') })));
    const statuses = await TaskStatus.findAll()
      .then(result => result.map(status => ({ id: status.id, name: status.name })));
    return { users, statuses };
  };
  router
    .get('tasks', '/tasks', async (ctx) => {
      const tasks = await Task
        .findAll({ include: [User, { model: User, as: 'assignedToUser' }, TaskStatus] })
        .then(result => result.map(task =>
          ({
            id: task.id,
            name: task.name,
            description: task.description,
            creator: task.User.get('fullName'),
            assignedTo: task.assignedToUser.get('fullName'),
            status: task.TaskStatus.name,
          })));
      ctx.render('tasks', { tasks });
    })
    .get('newTask', '/tasks/new', async (ctx) => {
      const task = Task.build();
      const formParams = await getParamsForForm();
      ctx.render('tasks/new', { f: buildFormObj({ ...task, ...formParams }) });
    })
    .get('editTask', '/tasks/edit/:id', async (ctx) => {
      const task = await Task.findById(ctx.params.id).then(e => e.dataValues);
      const formParams = await getParamsForForm();
      ctx.render('tasks/edit', { f: buildFormObj({ ...task, ...formParams }) });
    })
    .put('updateTask', '/tasks/:id', async (ctx) => {
      const form = ctx.request.body.form;
      const id = ctx.params.id;
      try {
        await Task.update(form, { where: { id } });
        ctx.flash.set('Task has been updated');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        const formParams = await getParamsForForm();
        ctx.render('tasks/new', { f: buildFormObj({ ...form, ...formParams }, e) });
      }
    })
    .post('tasks', '/tasks', async (ctx) => {
      const form = ctx.request.body.form;
      const tasks = Task.build(form);
      try {
        await tasks.save();
        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        const formParams = await getParamsForForm();
        ctx.render('tasks/new', { f: buildFormObj({ ...form, ...formParams }, e) });
      }
    });
};
