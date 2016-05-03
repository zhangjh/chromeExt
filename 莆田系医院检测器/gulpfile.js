var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task("clean",function() {
    return gulp.src("./encrypt/*")
    .pipe(plugins.clean());
});

gulp.task("js",["clean"],function(){
    var stream = gulp.src(["*.js","!*.min.js","!gulpfile.js"])
        .pipe(plugins.uglify())
 //       .pipe(plugins.obfuscate())
        .pipe(gulp.dest("./encrypt//"));
    return stream;
});

gulp.task("mv",["clean"],function(){
    var stream = gulp.src(["./*.png","./jquery.min.js","./manifest.json","./popup.html"])
        .pipe(gulp.dest("./encrypt/"));
    return stream;
});

gulp.task("default",["js","mv"],function(){
    console.log("gulp task ok!");
});

