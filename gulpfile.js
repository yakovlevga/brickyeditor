const gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  cleanCss = require("gulp-clean-css"),
  ts = require("gulp-typescript"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  reload = browserSync.reload;

const srcTypescriptFolder = "./src/tsc",
  srcTypescriptConfig = srcTypescriptFolder + "/tsconfig.json",
  srcTypescriptConfigES6 = srcTypescriptFolder + "/tsconfig.es6.json",
  srcTypescript = srcTypescriptFolder + "/**/*.ts",
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
  taskCompileTypescript = "ts",
  taskCompileTypescriptES6 = "ts_es6",
  taskCopyLocales = "copy_locales",
  taskCompileSass = "sass",
  taskWatcher = "watch";

// Browser-sync task
gulp.task(taskBrowserSync, () => {
  browserSync({
    server: {
      baseDir: demoFolder
    }
  });
});

// Typescript task
gulp.task(taskCompileTypescript, done => {
  const tsProject = ts.createProject(srcTypescriptConfig);
  const tsResult = gulp.src(srcTypescript).pipe(tsProject());

  done();
  return [
    tsResult.js
      .pipe(gulp.dest(demoJs))
      .pipe(gulp.dest(distFolder))
      .pipe(
        uglify({
          preserveComments: "false"
        })
      )
      .pipe(
        rename({
          suffix: ".min"
        })
      )
      .pipe(gulp.dest(distFolder))
      .pipe(
        reload({
          stream: true
        })
      )
  ];
});

// Typescript ES6 compilation task
gulp.task(taskCompileTypescriptES6, done => {
  const tsProject = ts.createProject(srcTypescriptConfigES6);
  const tsResult = gulp.src(srcTypescript).pipe(tsProject());

  done();
  return [
    tsResult.js.pipe(gulp.dest(distFolder)).pipe(
      reload({
        stream: true
      })
    )
  ];
});

// Copy locales task
gulp.task(taskCopyLocales, done => {
  done();
  return gulp
    .src(srcJsLocales)
    .pipe(gulp.dest(demoJsLocales))
    .pipe(gulp.dest(distLocalesFolder));
});

// Sass task
gulp.task(taskCompileSass, done => {
  done();
  return gulp
    .src(srcSassMain)
    .pipe(sass())
    .pipe(rename("jquery.brickyeditor.css"))
    .pipe(gulp.dest(demoCss))
    .pipe(gulp.dest(distFolder))
    .pipe(cleanCss())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest(distFolder))
    .pipe(
      reload({
        stream: true
      })
    );
});

// Changes tracking task
gulp.task(taskWatcher, () => {
  gulp.watch(srcTypescript, gulp.series(taskCompileTypescript));
  gulp.watch(srcSass, gulp.series(taskCompileSass));
});

gulp.task(
  "default",
  gulp.series([
    taskCompileTypescript,
    taskCompileTypescriptES6,
    taskCopyLocales,
    taskCompileSass,
    taskWatcher,
    taskBrowserSync
  ]),
  done => {
    done();
  }
);

gulp.task(
  "build",
  gulp.series([
    taskCompileTypescript,
    taskCompileTypescriptES6,
    taskCopyLocales,
    taskCompileSass
  ]),
  done => {
    done();
  }
);
