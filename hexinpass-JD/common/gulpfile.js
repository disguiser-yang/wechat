var gulp = require('gulp'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-minify-css'),
    htmlmin = require("gulp-minify-html"),
    jsmin = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require("gulp-clean"),
    replace = require('gulp-replace'),
    processhtml = require('gulp-processhtml'),
    addsrc = require('gulp-add-src'),
    jshint = require("gulp-jshint"),
    imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant');
	
var commonVersion='1603';//common 版本号
var oldCommonVersion='1602';//上一版本号

//清除目录
gulp.task("clean", function (done){
    return gulp.src(['../dist/pro/cdn/html5/common','../dist/test/cdn/html5/common'],{
        read: false
    })
    .pipe(clean({force: true}));
});

/*拉取 lib 下js**/
gulp.task('js_copy', function(){
	 return gulp.src(['./js/lib/*.js'])
    .pipe(gulp.dest('../dist/pro/cdn/html5/common/'+commonVersion+'/js/lib/'))
    .pipe(gulp.dest('../dist/test/cdn/html5/common/'+commonVersion+'/js/lib/'));
});
/*拉取 css**/
gulp.task('css_copy', function(){
	 return gulp.src(['./css/*.min.css'])
    .pipe(gulp.dest('../dist/pro/cdn/html5/common/'+commonVersion+'/css/'))
    .pipe(gulp.dest('../dist/test/cdn/html5/common/'+commonVersion+'/css/'));
});
/*拉取 图片 压缩**/
gulp.task('img_min', function(){
	gulp.src(['./images/**'])
	.pipe(imagemin({
        progressive: true,
        use: [pngquant()]
    }))
    .pipe(gulp.dest('../dist/pro/cdn/html5/common/'+commonVersion+'/images/'))
    .pipe(gulp.dest('../dist/test/cdn/html5/common/'+commonVersion+'/images/'));
});
/*拉取 fonts**/
gulp.task('fonts_copy', function(){
	gulp.src(['./fonts/**'])
    .pipe(gulp.dest('../dist/pro/cdn/html5/common/'+commonVersion+'/fonts/'))
    .pipe(gulp.dest('../dist/test/cdn/html5/common/'+commonVersion+'/fonts/'));
});
/*工具 压缩合并appui.min.css
 * 
 * appui.css--公共组件css
 * 
 * res.style.css--公共组件css
 * 
 * **/
gulp.task('css_appui_min', function(){
	 return gulp.src(['./css/res.style.css','./css/appui.css'])
	.pipe(concat('appui.min.css'))
    .pipe(cssmin({advanced:false}))
    .pipe(gulp.dest('./css/'));
});
/*工具 压缩合并app.ui.min.js
 * 
 * template.js--数据模板
 * 
 * md5.js--md5加密
 * 
 * mui.zoom.js
 * mui.previewimage.js--相册浏览
 * 
 * mui.lazyload.js
 * mui.lazyload.img.js--图片延时加载
 * 
 * webapp.js--公用js
 * **/

gulp.task('js_app_ui_min', function(){
	 return gulp.src([
	 	'./js/template.js',
	 	'./js/md5.js',
	 	'./js/mui.zoom.js',
	 	'./js/mui.previewimage.js',
	 	'./js/mui.lazyload.js',
	 	'./js/mui.lazyload.img.js',
	 	'./js/webapp.js'
	 	])
    .pipe(concat('app.ui.js'))
    .pipe(gulp.dest('./js/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(jsmin())
    .pipe(gulp.dest('./js/lib/'));
});
/*! 执行打包******************************************************/
gulp.task('default',['clean'],function (){
	var task=[];
	task[task.length]='js_copy';
	task[task.length]='css_copy';
	task[task.length]='img_min';
	task[task.length]='fonts_copy';
	console.log('***********************build common*************************');
	gulp.start(task); 
});