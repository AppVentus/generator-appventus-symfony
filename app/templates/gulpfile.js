/* jshint strict: false */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src('src/<%= app %>/Front/TemplateBundle/Resources/style/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
        precision: 10,
        onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('web/css/'))
    .pipe($.size({title: 'styles'}));
});

// Watch files for changes
gulp.task('watch', ['styles'], function () {
    gulp.watch(['**/*.scss', '**/*.css'], ['styles']);
});