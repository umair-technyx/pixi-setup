const { src, dest, watch, series } = require('gulp'),
	gulpsass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('cssnano'),
	postcss = require('gulp-postcss'),
	fileinclude = require('gulp-file-include'),
	clean = require('gulp-clean'),
	critical = require('critical').stream,
	browsersync = require('browser-sync').create();

// create dist
function createDist() {
	return src(['src/**/*.*','!src/*.html','!src/include/**','!src/assets/scss/**','!src/assets/scripts/**'])
	.pipe(dest('build'));
}

// compile scss into css
function sassToCss() {
	return src('src/assets/scss/style.scss')
	.pipe(sourcemaps.init())
	.pipe(gulpsass({includePaths:['./node_modules/']}).on('error', gulpsass.logError))
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 20 versions']
	}))
	.pipe(dest('build/assets/css'))
	.pipe(postcss([cssnano()]))
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 20 versions']
	}))
	.pipe(rename('style.min.css'))
	.pipe(sourcemaps.write('.'))
	.pipe(dest('build/assets/css'))
	.pipe(browsersync.stream());
}

// minify js
function vendorJs() {
	return src([
		'src/assets/scripts/jquery.js',
		'src/assets/scripts/vendors/*.js',
	])
	.pipe(sourcemaps.init())
	.pipe(concat('build/assets/js/vendors.js'))
	.pipe(dest('.'))
	.pipe(rename('vendors.min.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(dest('build/assets/js'))
	.pipe(browsersync.stream());
}

// minify js
function minifyJs() {
	return src([
		'src/assets/scripts/main.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('build/assets/js/scripts.js'))
	.pipe(dest('.'))
	.pipe(rename('scripts.min.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(dest('build/assets/js'))
	.pipe(browsersync.stream());
}

//  include htmls
function includehtml() {
	return src(['src/*.html'])
    .pipe(fileinclude({
		prefix: '@@',
		basepath: '@file'
    }))
    .pipe(dest('build'));
}

// browsersync
function runbrowser() {
    browsersync.init({
        server: 'build',
        port: 4000
	});
	watch(['src/assets/scss/**/*.scss']).on('change', () => {
		sassToCss();
		console.log('css changes');
	});
	watch(['src/assets/scripts/main.js']).on('change', () => {
		minifyJs();
		console.log('script changes');
	});
	watch(['src/assets/scripts/vendors/*.js']).on('change', () => {
		vendorJs();
		console.log('vendor changes');
	});
	watch(['src/**/*.html']).on('change', () => {
		includehtml();
		browsersync.reload;
		console.log('html changes');
	});
}

// remove dist folder
function distclean() {
	return src('build', {allowEmpty: true})
	.pipe(clean({force:true}));
}

// critical plugin
function criticalcss() {
    return src('build/*.html')
    .pipe(critical({
        base: 'build/',
        inline: true,
        css: 'build/assets/css/style.min.css',
	}))
	.on('error', err => {
		log.error(err.message);
	})
    .pipe(dest('build'));
}

exports.build = series(distclean, createDist, sassToCss, vendorJs, minifyJs, includehtml, criticalcss);
exports.default = series(distclean, createDist, sassToCss, vendorJs, minifyJs, includehtml, runbrowser);