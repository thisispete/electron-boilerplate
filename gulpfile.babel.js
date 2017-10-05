import del from 'del';
import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';
import { server } from 'electron-connect';

const connect = server.create();

const PATH = {
  HTML_MAIN: 'src/index.html',
  CSS_MAIN: 'src/styles.css',
  JS_MAIN: 'src/app.js',
  DEST: 'build'
};

gulp.task('js', () => {
  gulp.src(PATH.JS_MAIN)
    .pipe(gulp.dest(PATH.DEST));
});

gulp.task('html', () => {
  gulp.src(PATH.HTML_MAIN)
    .pipe(gulp.dest(PATH.DEST));
});

gulp.task('css', () => {
  gulp.src(PATH.CSS_MAIN)
    .pipe(gulp.dest(PATH.DEST));
  gulp.src('./node_modules/photon/dist/css/photon.css')
    .pipe(gulp.dest(PATH.DEST));
  gulp.src('./node_modules/photon/dist/fonts/*')
    .pipe(gulp.dest(`${PATH.DEST}/fonts`));
});

gulp.task('clean', () => {
  del(['dist/**/*']);
});

gulp.task('serve', () => {
  connect.start();

  gulp.watch(`${PATH.DEST}/**.*`, connect.reload);
});

gulp.task('watch', () => {
  gulp.watch(PATH.JS_MAIN, ['js']);
  gulp.watch(PATH.CSS_MAIN, ['css']);
  gulp.watch([PATH.HTML_MAIN], ['html']);
});

gulp.task('set-dev-node-env', () => {
  process.env.NODE_ENV = 'development';
});


gulp.task('server', gulpSequence(['serve', 'watch', 'set-dev-node-env']));

gulp.task('default', gulpSequence('clean', ['js', 'css', 'html'], 'server'));
