import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';
import less from 'gulp-less';
import nunjucks from 'gulp-nunjucks';
import { server } from 'electron-connect';
import sourcemaps from 'gulp-sourcemaps';

const connect = server.create();

const PATH = {
  DATA: 'src/data.json',
  HTML_MAIN: 'src/index.html',
  CSS_MAIN: 'src/styles.less',
  JS_MAIN: 'src/app.js',
  DEST: 'dist'
};

gulp.task('js', () => {
  return gulp.src(PATH.JS_MAIN)
    .pipe(gulp.dest(PATH.DEST));
});

gulp.task('html', () => {
  const data = JSON.parse(fs.readFileSync(PATH.DATA));
  return gulp.src(PATH.HTML_MAIN)
    .pipe(nunjucks.compile(data))
    .pipe(gulp.dest(PATH.DEST));
});

gulp.task('less', () => {
  return gulp.src(PATH.CSS_MAIN)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATH.DEST));
});

gulp.task('clean', () => {
  return del(['dist/**/*']);
});

gulp.task('serve', () => {
  connect.start();

  gulp.watch(`${PATH.DEST}/**.*`, connect.reload);
});

gulp.task('watch', () => {
  gulp.watch(PATH.JS_MAIN, ['js']);
  gulp.watch(PATH.CSS_MAIN, ['less']);
  gulp.watch([PATH.HTML_MAIN, PATH.DATA], ['html']);
});

gulp.task('server', gulpSequence(['serve', 'watch']));

gulp.task('default', gulpSequence('clean', ['js', 'less', 'html'], 'server'));
