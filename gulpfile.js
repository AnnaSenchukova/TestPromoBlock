"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var rename = require ("gulp-rename");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var ccso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var del = require("del");

gulp.task("css", function() {
    return gulp.src("source/sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(ccso())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css")).pipe(gulp.dest("source/css"))
        .pipe(server.stream());
});

gulp.task("server", function() {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
    gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("images", function () {
    return gulp.src("source/img/**/*.{png,jpg,svg}")
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
            imagemin.svgo({
                plugins: [
                    {cleanupIDs: false},
                    {removeUselessDefs: false},
                    {removeViewBox: true},
                ]
            })
        ]))
        .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function () {
    return gulp.src([
            "source/fonts/**/*.{woff,woff2}",
            "source/js/**",
            "source/*.html"
        ],
        {
            base: "source"
        })
        .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
    return del("build");
});

gulp.task("build", gulp.series("clean","copy","css","images"));
gulp.task("start", gulp.series("build","server"));
