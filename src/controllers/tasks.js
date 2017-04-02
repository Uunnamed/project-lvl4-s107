import buildFormObj from '../lib/formObjectBuilder';
import getSelector from '../lib/utils';

export default (router, { Task, User, TaskStatus, Comment, Tag }) => {
  router
    .get('tasks', '/tasks', async (ctx) => {
      const { tag, userRole, userId, status } = ctx.request.query;
      const whereUser = userRole && userId ? { [userRole]: userId } : {};
      const whereStatus = status ? { TaskStatusId: status } : {};
      const whereTag = tag ? { id: tag } : {};
      const tasks = await Task
        .findAll({
          include: [
            User,
            { model: User, as: 'assignedToUser' },
            TaskStatus,
            { model: Tag, where: whereTag }],
          where: { ...whereUser, ...whereStatus },
        })
        .then(async result => result.map(task =>
          ({
            id: task.id,
            name: task.name,
            description: task.description,
            creator: task.User.fullName,
            assignedTo: task.assignedToUser.fullName,
            status: task.TaskStatus.name,
          })));
      const [users, statuses] = await Promise.all([User, TaskStatus].map(getSelector));
      ctx.render('tasks', { users, statuses, tasks });
    })
    .get('newTask', '/tasks/new', async (ctx) => {
      const task = Task.build();
      const [users, statuses] = await Promise.all([User, TaskStatus].map(getSelector));
      ctx.render('tasks/new', { f: buildFormObj({ ...task, users, statuses }) });
    })
    .get('editTask', '/tasks/edit/:id', async (ctx) => {
      const task = await Task.findById(ctx.params.id)
        .then(async (t) => {
          const tags = await t.getTags().map(tag => tag.name);
          return { ...t.dataValues, tags: tags.join(' ') };
        });
      const [users, statuses] = await Promise.all([User, TaskStatus].map(getSelector));
      ctx.render('tasks/edit', { f: buildFormObj({ ...task, users, statuses }) });
    })
    .get('showTask', '/tasks/show/:id', async (ctx) => {
      const task = await Task
        .findById(ctx.params.id,
        {
          include: [
            User,
            { model: User, as: 'assignedToUser' },
            TaskStatus,
            { model: Comment, include: User },
            Tag],
        });
      const fullTask = {
        id: task.id,
        name: task.name,
        creator: task.creator,
        assignedTo: task.assignedTo,
        creatorName: task.User.fullName,
        assignedToName: task.assignedToUser.fullName,
        status: task.status,
        statusName: task.TaskStatus.name,
        tags: task.Tags.map(t => t.toMap),
        description: task.description,
        comments: task.Comments
          .map(comment => ({ id: comment.id, creator: comment.User.fullName, date: comment.time, text: comment.text })),
      };
      const [users, statuses] = await Promise.all([User, TaskStatus].map(getSelector));
      ctx.render('tasks/show', { f: buildFormObj({ ...fullTask, users, statuses }) });
    })
    .put('updateTask', '/tasks/:id', async (ctx) => {
      const form = ctx.request.body.form;
      const id = ctx.params.id;
      const tags = form.tags.split(' ');
      try {
        await Task.update(form, { where: { id } });
        const task = await Task.findById(id);
        const oldTags = await task.getTags();
        task.removeTags(oldTags);
        await Promise.all(tags.map(tag => Tag.findOne({ where: { name: tag } })
          .then(async result =>
            (result ? await task.addTag(result) : await task.createTag({ name: tag })))));
        ctx.flash.set('Task has been updated');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        const [users, statuses] = await Promise.all([User, TaskStatus].map(getSelector));
        ctx.render('tasks/edit/', { f: buildFormObj({ ...form, users, statuses, id }, e) });
      }
    })
    .patch('updateTask', '/tasks/:id', async (ctx) => {
      const form = ctx.request.body.form;
      const id = ctx.params.id;
      try {
        await Task.update(form, { where: { id } });
        ctx.flash.set('Task has been updated');
        ctx.redirect(router.url('showTask', id));
      } catch (e) {
        const [users, statuses] = await Promise.all([User, TaskStatus].map(getSelector));
        ctx.render('tasks/show/', { f: buildFormObj({ ...form, users, statuses }, e) });
      }
    })
    .post('tasks', '/tasks', async (ctx) => {
      const form = ctx.request.body.form;
      const task = Task.build(form);
      const tags = form.tags.split(' ');
      try {
        await task.save();
        await Promise.all(tags.map(tag => Tag.findOne({ where: { name: tag } })
          .then(async result =>
            (result ? await task.addTag(result) : await task.createTag({ name: tag })))));
        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        const [users, statuses] = await Promise.all([User, TaskStatus].map(getSelector));
        ctx.render('tasks/new', { f: buildFormObj({ ...form, users, statuses }, e) });
      }
    })
    .delete('deleteTask', '/tasks/:id', async (ctx) => {
      const id = ctx.params.id;
      try {
        await Task.destroy({ where: { id } });
        await Comment.destroy({ where: { TaskId: id } });
        ctx.flash.set('Task has been deleted');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        ctx.flash.set('Task not found');
        ctx.redirect(router.url('tasks'));
      }
    });
};
