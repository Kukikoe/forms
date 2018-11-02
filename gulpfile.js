var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    del          = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps   = require('gulp-sourcemaps');

gulp.task('sass', function() {
	return gulp.src('src/sass/*.sass')
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
    return gulp.src(['!src/js/scripts.min.js', 
    'src/libs/particles.js/particles.js',
    'src/js/**/*.js'
    ]) //Найдем наш main файл
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(concat('scripts.min.js'))
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest('src/js')) 
        .pipe(browserSync.reload({stream: true})); //И перезагрузим сервер
})

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir:'src'
		},
		notify: false
	});
});

gulp.task('clean', function() {
	return del.sync('dist');
})

gulp.task('watch', ['browser-sync', 'sass', 'scripts'], function() {
	gulp.watch('src/sass/*.sass', ['sass'])
	gulp.watch('src/*.html', browserSync.reload)	
	gulp.watch('src/js/**/*.js', ['scripts'])	
});

gulp.task('build', ['clean', 'sass'], function() {
	var buildCss = gulp.src('src/css/main.css')
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('src/js/**/*')
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('src/*.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch']);