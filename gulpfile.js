const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    cleanCss = require('gulp-clean-css'),
    ts = require('gulp-typescript'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

const srcTypescriptFolder = './src/tsc',
    srcTypescriptConfig = srcTypescriptFolder + '/tsconfig.json',
    srcTypescriptConfigES6 = srcTypescriptFolder + '/tsconfig.es6.json',
    srcTypescript = srcTypescriptFolder + '/**/*.ts',

    srcSassFolder = './src/scss',
    srcSass = srcSassFolder + '/**/*.scss',
    srcSassMain = srcSassFolder + '/main.scss',

    distFolder = './dist',

    demoFolder = './demo',
    demoJs = demoFolder + '/js',
    demoCss = demoFolder + '/css',

    taskBrowserSync = 'browserSync',
    taskCompileTypescript = 'ts',
    taskCompileTypescriptES6 = 'ts_es6',
    taskCompileSass = 'sass',
    taskWatcher = 'watch';

// Browser-sync task
gulp.task(taskBrowserSync, function () {
    browserSync({
        server: {
            baseDir: demoFolder,
        }
    });
});

// Typescript task
gulp.task(taskCompileTypescript, function () {
    const tsProject = ts.createProject(srcTypescriptConfig);
    const tsResult = gulp.src(srcTypescript)
        .pipe(tsProject());

    return [
        tsResult.js
        .pipe(gulp.dest(demoJs))
        .pipe(gulp.dest(distFolder))
        .pipe(uglify({
            preserveComments: 'false'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distFolder))
        .pipe(reload({
            stream: true
        }))
    ];
});

// Typescript ES6 compilation task
gulp.task(taskCompileTypescriptES6, function () {
    const tsProject = ts.createProject(srcTypescriptConfigES6);
    const tsResult = gulp.src(srcTypescript)
        .pipe(tsProject());

    return [
        tsResult.js
        .pipe(gulp.dest(distFolder))
        .pipe(reload({
            stream: true
        }))
    ];
});

// Sass task
gulp.task(taskCompileSass, function () {
    return gulp.src(srcSassMain)
        .pipe(sass())
        .pipe(rename('jquery.brickyeditor.css'))
        .pipe(gulp.dest(demoCss))
        .pipe(gulp.dest(distFolder))
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distFolder))
        .pipe(reload({
            stream: true
        }));
});

// Changes tracking task 
gulp.task(taskWatcher, function () {
    gulp.watch(srcTypescript, [taskCompileTypescript]);
    gulp.watch(srcSass, [taskCompileSass]);
});

gulp.task('default', [
    taskCompileTypescript,
    taskCompileTypescriptES6,
    taskCompileSass,
    taskWatcher,
    taskBrowserSync
]);

gulp.task('build', [
    taskCompileTypescript,
    taskCompileTypescriptES6,
    taskCompileSass
]);
