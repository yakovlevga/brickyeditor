const gulp = require("gulp"),
  // uglify = require("gulp-uglify"),
  cleanCss = require("gulp-clean-css"),
  // ts = require("gulp-typescript"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  reload = browserSync.reload;

const srcTypescriptFolder = "./src/tsc",
  srcJsFolder = "./src/js",
  srcJsLocales = srcJsFolder + "/locales/*.js",
  srcSassFolder = "./src/scss",
  srcSass = srcSassFolder + "/**/*.scss",
  srcSassMain = srcSassFolder + "/main.scss",
  distFolder = "./dist",
  distLocalesFolder = distFolder + "/locales",
  demoFolder = "./demo",
  demoJs = demoFolder + "/js",
  demoJsLocales = demoJs + "/locales",
  demoCss = demoFolder + "/css",
  taskBrowserSync = "browserSync",
  taskCopyLocales = "copy_locales",
  taskCompileSass = "sass",
  taskWatcher = "watch";

// Browser-sync task
gulp.task(taskBrowserSync, () => {
  browserSync({
    https: true,
    server: {
      baseDir: demoFolder,
    },
  });
});

// Copy locales task
gulp.task(taskCopyLocales, () => {
  return gulp
    .src(srcJsLocales)
    .pipe(gulp.dest(demoJsLocales))
    .pipe(gulp.dest(distLocalesFolder));
});

// Sass task
gulp.task(taskCompileSass, () => {
  return gulp
    .src(srcSassMain)
    .pipe(sass())
    .pipe(rename("jquery.brickyeditor.css"))
    .pipe(gulp.dest(demoCss))
    .pipe(gulp.dest(distFolder))
    .pipe(cleanCss())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest(distFolder))
    .pipe(
      reload({
        stream: true,
      })
    );
});

// Changes tracking task
gulp.task(taskWatcher, () => {
  gulp.watch(srcSass, [taskCompileSass]);
});

gulp.task("default", [
  taskCopyLocales,
  taskCompileSass,
  taskWatcher,
  taskBrowserSync,
]);

gulp.task("build", [taskCopyLocales, taskCompileSass]);
