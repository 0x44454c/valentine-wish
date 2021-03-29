var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	purgecss = require('gulp-purgecss'),
	cleanCSS = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	del = require('del'),
	rev = require('gulp-rev'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	babel = require('gulp-babel'),
	usemin = require('gulp-usemin'),
	htmlmin = require('gulp-htmlmin'),
	source = require('vinyl-source-stream'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	watchify = require('watchify'),
	log = require('gulplog'),
	sourcemap = require('gulp-sourcemaps'),
	ls = require('lite-server'),
	open = require('gulp-open');

const paths = {
	cwd: {
		// fontawesome: 'resources/vendor/fontawesome',
		// bootstrap: 'resources/vendor/bootstrap',
		// jquery: 'resources/vendor/jquery',
		// fonts: 'resources/vendor/fonts',
		// img: 'resources/images',
		sass: '.',
		css: '.',
		js: '.'
	},
	dist: {
		dist: 'dist',
		// webfonts: 'dist/resources/webfonts',
		// bootstrap: 'dist/resources/bootstrap',
		// jquery: 'dist/resources/jquery',
		// fonts: 'dist/resources/fonts',
		// img: 'dist/resources/images',
		// css: 'dist/resources/css',
		// js: 'dist/resources/js'
	},
	fontawesome: 'node_modules/@fortawesome/fontawesome-free/webfonts',
	moduleName: 'animht'
};

function comSass() {
	return gulp.src(paths.cwd.sass + '/*.scss')
		.pipe(sourcemap.init({ loadMaps: true }))
		.pipe(sass())
		// .pipe(sourcemap.write('.'))
		// .pipe(gulp.dest(paths.cwd.css))
		.pipe(cleanCSS())
		.pipe(autoprefixer())
		.pipe(rename({
			basename: 'style',
			suffix: '.min'
		}))
		.pipe(sourcemap.write('.'))
		.pipe(gulp.dest(paths.cwd.css))
}

function js() {
	return browserify(paths.cwd.js + '/main.js', { standalone: paths.moduleName }).transform(babelify, { presets: ['@babel/env'] }).bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(paths.cwd.js));
}

function watchjs() {
	var bundler = watchify(browserify(paths.cwd.js + '/main.js', { standalone: paths.moduleName }).transform(babelify, { presets: ['@babel/env'] }));
	bundle();
	bundler.on('update', bundle);
	bundler.on('log', log.info);
	function bundle() {
		return bundler.bundle()
			.on('error', log.error.bind(log, 'Browserify Error'))
			.pipe(source('bundle.js'))
			.pipe(gulp.dest(paths.cwd.js));
	}
}

function watchFiles() {
	comSass();
	watchjs();
	gulp.watch(paths.cwd.sass + '/*.scss', comSass);
}

// function browser() {
// 	var files = [
// 		'./*.html',
// 		'./resources/css/*.css',
// 		'./resources/js/*.js',
// 		'./resources/images/**'
// 	];

// 	browserSync.init(files, {
// 		server: {
// 			baseDir: './'
// 		}
// 	});
// }

function server() {
	ls.server();
}


// building tasks
function clean() {
	return del(['dist']);
}
function fontawesome() {
	return gulp.src(paths.fontawesome + '/**')
		.pipe(gulp.dest(paths.dist.webfonts));
}
function copyfonts() {
	return gulp.src(paths.cwd.fonts + '/**')
		.pipe(gulp.dest(paths.dist.fonts));
}
function images() {
	return gulp.src(paths.cwd.img + '/*.{png,jpg,gif}')
		.pipe(imagemin({ optimizationlevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.src(paths.cwd.img + '/**'))
		.pipe(gulp.dest(paths.dist.img));
}
// function styles() {
// 	comSass();
// 	return gulp.src(paths.cwd.css + '/*.css')
// 		.pipe(concat('all.min.css'))
// 		.pipe(purgecss({
// 			content: ['*.html', paths.cwd.js + '/*.js']
// 		}))
// 		// .pipe(cleanCSS())
// 		// .pipe(autoprefixer())
// 		.pipe(rename({
// 			basename: 'style',
// 			suffix: '.min'
// 		}))
// 		.pipe(gulp.dest(paths.dist.css));
// }
// function scripts() {
// 	return gulp.src(paths.cwd.js + '/*.js')
// 		.pipe(babel({
// 			presets: ['@babel/env']
// 		}))
// 		.pipe(jshint())
// 		.pipe(jshint.reporter('default'))
// 		.pipe(uglify({
// 			output: {
// 				comments: /^!/
// 			}
// 		}))
// 		.pipe(gulp.dest(paths.dist.js));
// }
function purge() {
	return gulp.src(paths.cwd.css + '/*.css')
		.pipe(purgecss({
			content: ['*.html', paths.cwd.js + '/*.js']
		}))
		.pipe(gulp.dest(paths.cwd.css));
}
function usemini() {
	return gulp.src('*.html')
		.pipe(usemin({
			css: [rev()],
			// html: [function () { return htmlmin({ collapseWhitespace: true }); }],
			js: [uglify({ output: { comments: /^!/ } }), rev()],
			inlinejs: [uglify({ output: { comments: /^!/ } })],
			inlinecss: [cleanCSS(), 'concat']
		}))
		.pipe(gulp.dest(paths.dist.dist))
}
function finalCheck() {
	// browserSync.init('./dist/**', {
	// 	server: {
	// 		baseDir: './dist/'
	// 	}
	// })
	return gulp.src(paths.dist.dist + '/*.html')
		.pipe(open())
}

//build task
var build = gulp.series(gulp.parallel(comSass, js), purge, clean, gulp.parallel(usemini), finalCheck);

// export the tasks
exports.sass = comSass;
exports.js = js;
exports.watchjs = watchjs;
exports.watch = watchFiles;
exports.server = server;
exports.clean = clean;
exports.build = build;
//export default task
exports.default = gulp.parallel(watchFiles, server);