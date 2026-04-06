const { src, dest, series, watch } = require('gulp'),
  concat = require('gulp-concat'),
  htmlMin = require('gulp-htmlmin'),
  autoprefixer = require('gulp-autoprefixer'),
  image = require('gulp-image'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify-es').default,
  gulpif = require('gulp-if'),
  notify = require('gulp-notify'),
  sourcemaps = require('gulp-sourcemaps'),
  del = require('del'),
  sass = require('gulp-sass')(require('sass')),
  browserSync = require('browser-sync').create();

let prod = false;

const isProd = (done) => {
  prod = true;
  done();
};

const clean = () => {
  return del(['dist']);
};

const fonts = () => {
  return src('src/fonts/**')
    .pipe(dest('dist/fonts'))
};

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(gulpif(prod, htmlMin({
      collapseWhitespace: true,
    })))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
};

const styles = () => {
  return src('src/css/style.scss')
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(sass(gulpif(prod, {
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulpif(!prod, sourcemaps.write()))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
};

const images = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/**/*.jpeg',
    'src/img/**/*.png',
    'src/img/**/*.svg',
    'src/img/**/*.avif',
    'src/img/**/*.webp',
  ])
  .pipe(image())
  .pipe(dest('dist/img'))
};

const scripts = () => {
  return src([
    'src/js/**/*.js'
  ])
  .pipe(gulpif(!prod, sourcemaps.init()))
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('main.js'))
  .pipe(gulpif(prod, uglify({
    toplevel: true
  }).on('error', notify.onError())))
  .pipe(gulpif(!prod, sourcemaps.write()))
  .pipe(dest('dist/js'))
  .pipe(browserSync.stream());
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
};

watch('src/**/*.html', htmlMinify);
watch('src/css/**/*.scss', styles);
watch('src/js/**/*.js', scripts);
watch('src/fonts/**', fonts);

exports.htmlMinify = htmlMinify;
exports.styles = styles;
exports.scripts = scripts;

exports.dev = series(clean, fonts, htmlMinify, styles, images, scripts, watchFiles);
exports.build = series(isProd, clean, fonts, htmlMinify, styles, images, scripts);
