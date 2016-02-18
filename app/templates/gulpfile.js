/* jshint strict: false */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var avInjector = require('av-gulp-injector');
var avInjectorAliases = require('./gulp.injector.aliases')();

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

// Inject assets referenced into the injector.json files
gulp.task('injector', function() {
    avInjector.injector(gulp.src('app/Resources/views/**/*.html.twig'), avInjectorAliases);
});

// Injector variant for style injection
gulp.task('injector-style', function() {
    avInjector.injector(gulp.src('src/<%= app %>/Front/TemplateBundle/Resources/style/vendor/vendor.scss'), avInjectorAliases, true);
});
