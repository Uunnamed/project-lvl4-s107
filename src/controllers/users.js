import buildFormObj from '../lib/formObjectBuilder';

export default (router, { User }) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .post('users', '/users', async (ctx) => {
      const form = ctx.request.body.form;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })
    .delete('delete', '/user/:id', async (ctx) => {
      const id = ctx.params.id;
      try {
        await User.destroy({ where: { id } });
        ctx.flash.set('User has been deleted');
        ctx.redirect(router.url('users'));
      } catch (e) {
        ctx.flash.set('User not found');
        ctx.redirect(router.url('users'));
      }
    });
};
