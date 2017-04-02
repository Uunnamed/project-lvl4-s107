export default (router, { Comment }) => {
  router
    .post('comments', '/comments/task/:id', async (ctx) => {
      const comment = Comment.build(ctx.request.body.comment);
      try {
        await comment.save();
        ctx.flash.set('Comment has been added');
        ctx.redirect(router.url('showTask', ctx.params.id));
      } catch (e) {
        ctx.flash.set('Comment is empty');
        ctx.redirect(router.url('showTask', ctx.params.id));
      }
    });
};
