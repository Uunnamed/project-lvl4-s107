import 'babel-polyfill';

import gulp from 'gulp';
import gutil from 'gulp-util';
import repl from 'repl';
import container from './src/container';
import init from './src/init';
import defaultData from './src/db/defaultdata';
import getServer from './src';

// gulp.task('default', console.log('hello!'));

gulp.task('console', () => {
  gutil.log = gutil.noop;
  const replServer = repl.start({
    prompt: 'Application console > ',
  });

  Object.keys(container).forEach((key) => {
    replServer.context[key] = container[key];
  });
});

gulp.task('init', async () => {
  await init();
  console.log('db was created');
});

gulp.task('drop', async () => {
  await Promise.all(Object.keys(container).slice(1).map(key => container[key].drop()));
  console.log('Tables was droped');
});

gulp.task('defload', async () => {
  await Promise.all(defaultData.users.map(user => container.User.create(user)));
  await Promise.all(defaultData.statuses.map(status => container.TaskStatus.create(status)));
  await Promise.all(defaultData.tasks.map(task => container.Task.create(task)));
  console.log('Data was loaded');
});

gulp.task('server', (cb) => {
  getServer().listen(process.env.PORT || 3000, cb);
});
