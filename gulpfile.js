var gulp            = require('gulp'),
    clean           = require('gulp-clean'),
    uglify          = require('gulp-uglify'),
    cleanCss        = require('gulp-clean-css'),
    ts              = require('gulp-typescript'),
    browserSync     = require('browser-sync'),
    copy            = require('gulp-copy'),
    rename          = require('gulp-rename'),
    sourcemaps      = require('gulp-sourcemaps');
    sass            = require('gulp-sass');

let paths = {
    srcTsConfig: './src/tsc/tsconfig.json',
    srcTsAllFiles: './src/tsc/**/*.ts',    
    srcSassMain: './src/scss/main.scss',    

    dist: './dist',
    buildJs: './build/js',
    buildCss: './build/css'
};

gulp.task('clearBuild', function() {
    return gulp.src([paths.buildCss, paths.buildJs])
        .pipe(clean());
});

gulp.task('ts', function() {
    var tsProject = ts.createProject(paths.srcTsConfig);
    var tsResult = gulp.src(paths.srcTsAllFiles)
        .pipe(sourcemaps.init())
        .pipe(tsProject());    

    return [
        tsResult.js        
        .pipe(gulp.dest(paths.buildJs))
        .pipe(gulp.dest(paths.dist))
        .pipe(uglify({ preserveComments: 'false' })) 
        .pipe(rename({ suffix: '.min'}))
        .pipe(gulp.dest(paths.buildJs))
        .pipe(gulp.dest(paths.dist))];
});

gulp.task('sass', function () {    
    return gulp.src(paths.srcSassMain)
        .pipe(sass())         
        .pipe(rename('jquery.brickyeditor.css'))
        .pipe(gulp.dest(paths.buildCss))
        .pipe(gulp.dest(paths.dist))
        .pipe(cleanCss())
        .pipe(rename({ suffix: '.min'}))
        .pipe(gulp.dest(paths.buildCss))
        .pipe(gulp.dest(paths.dist));        
});

gulp.task('default', ['clearBuild', 'ts', 'sass']);