var gulp = require('gulp');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var del = require('del');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

gulp.task('index', function() {
	del(['./assets/scripts/*', './assets/styles/*']);

	var jsFilter = filter('**/*.js', {
		restore: true
	});
	var cssFilter = filter('**/*.css', {
		restore: true
	});

	var userefAssets = useref.assets();

	return gulp.src('src/index.html')
		.pipe(userefAssets) // 解析html中build:{type}块，将里面引用到的文件合并传过来
		.pipe(jsFilter)
		// .pipe(uglify()) // 压缩Js
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe(csso()) // 压缩Css
		.pipe(cssFilter.restore)
		.pipe(rev()) // 重命名文件
		.pipe(userefAssets.restore())
		.pipe(useref())
		.pipe(revReplace()) // 重写文件名到html
		.pipe(gulp.dest('./'))
		.pipe(browserSync.stream());
});

gulp.task('images', function() {
	gulp.src('src/images/*.*').pipe(gulp.dest('./assets/images'));
});

gulp.task('default', function() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	// gulp.start('index');
	gulp.start('index', 'images');
	gulp.watch('src/images/*.*', ['images']);
	gulp.watch('src/scripts/*.js', ['index']);
	gulp.watch('src/styles/*.css', ['index']);
	gulp.watch('src/index.html', ['index']);
});