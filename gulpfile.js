'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');

const srcDir = './src';
const deployDir = './dist';
const config = {
    cssSrc: [
        srcDir + '/scss/**/*.scss'
    ],
    jsSrc: [
        srcDir + '/js/**/*.js'
    ]
};

// 本番用？
const isProd = (gutil.env.type === 'production');
process.env.MODE = isProd ? 'production' : 'development';

// CSSのタスク
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
function css() {
    return gulp.src(config.cssSrc, {sourcemaps: !isProd})
        .pipe(sass({
            outputStyle: isProd ? 'compressed' : 'expanded'
        }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest(deployDir + '/css', {sourcemaps: './'}));
}
exports.css = css;

// JavaScript タスク
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');
function js() {
    return webpackStream(webpackConfig, webpack)
        .pipe(plumber())
        .pipe(gulp.dest(deployDir + '/js'));
}
exports.js = js;

// ブラウザシンク
const browserSync = require('browser-sync');
function serve(done) {
    browserSync({
        server: {
            baseDir: deployDir,
            index: 'index.html'
        },
        // startPath: '/',
        notify: false
    });
    done();
}

function bsReload(done) {
    browserSync.reload();
    done();
}

// Watch
function watch(done) {
    gulp.watch(config.cssSrc, gulp.task('css'));
    gulp.watch(config.jsSrc, gulp.task('js'));
    done();
}

function watchSync(done) {
    gulp.watch(config.cssSrc, gulp.series(css, bsReload));
    gulp.watch(config.jsSrc, gulp.series(js, bsReload));
    done();
}

// 監視
exports.default = gulp.series(gulp.parallel(css, js), watch);
exports.sync = gulp.series(gulp.parallel(css, js), gulp.parallel(serve, watchSync));
