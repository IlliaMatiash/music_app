let project_folder = "dist";
let source_folder = "src";

let fs = require('fs');

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        sprite: project_folder + "/sprite/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/main.ts",
        img: source_folder + "/img/**/*.{jpg, png, svg, gif, ico, webp}",
        sprite: source_folder + "/sprite/*.svg",
        fonts: source_folder + "/fonts/*.ttf",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.ts",
        img: source_folder + "/img/**/*.{jpg, png, svg, gif, ico, webp}",
    },
    clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    scss = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    ts = require('gulp-typescript'),
    uglify = require("gulp-uglify-es").default,
    babel = require("gulp-babel"),
    imagemin = require("gulp-imagemin"),
    svgSprite = require("gulp-svg-sprite"),
    ttf2woff = require("gulp-ttf2woff"),
    concat = require("gulp-concat");




function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}
function libsCss(){
    return src([
        'node_modules/normalize.css/normalize.css',
        'src/scss/reset.scss'
    ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('src/scss'))
    .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(group_media())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 version"],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'script.js'
        }))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3 // 0 to 7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function sprite() {
    return src(path.src.sprite)
        .pipe(svgSprite({
            mode: {

                symbol: true,
                // stack: {
                //     sprite: "../icons/icons.svg",
                //     example: true,
                // },
            }
        }))
        .pipe(dest(path.build.img))
}

function fonts(params) {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
}


function watchFiles(params) {
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.html], html);
}

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, libsCss, css, html, images, sprite, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);




// exports.fontsStyle = fontsStyle;

exports.libsCss = libsCss;
exports.html = html;
exports.fonts = fonts;
exports.sprite = sprite;
exports.images = images;
exports.js = js;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;



