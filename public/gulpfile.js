'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const ftp = require('gulp-ftp');

const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');

const env = {
    dev: Symbol('development'),
    pro: Symbol('production')
};

const config = require('../package.json');

const distRoot = `dist/${config.name}`;
const dist = {
    js: `${distRoot}/${config.version}`,
    css: `${distRoot}/${config.version}`,
    assets: `${distRoot}/assets`,
    img: `${distRoot}/assets/img`,
    font: `${distRoot}/assets/font`
};

/**
 * postcss plugins for both dev and pro
 * @parem et Symbol
 */
const postcssPlugin = (et) => {
    var sprites = {
            spritesmith: {
                padding: 2
            },
            filterBy(file) {
                // base64 的图片没有 url 过滤掉
                if (file.url) {
                    return Promise.resolve();
                }
                return Promise.reject();
            },
            groupBy(file) {
                var group = file.url.split('/')[1];

                group = group === '' ? 'yo' : group;

                file.retina = true;

                return group ? Promise.resolve(group) : Promise.reject(group);
            }
        },
        assets,
        plugins;

    // assets & sprites config in both dev and pro
    if (et === env.pro) {
        assets = {
            loadPaths: [dist.img, dist.font],
            relativeTo: dist.css
        };

        Object.assign(sprites, {
            basePath: dist.img,
            stylesheetPath: dist.css,
            spritePath: dist.img
        });
    } else if (et === env.dev) {
        assets = {
            loadPaths: ['img/', 'font/'],
            relativeTo: 'css/'
        };

        Object.assign(sprites, {
            basePath: 'img/',
            stylesheetPath: 'css/',
            spritePath: 'img/'
        });
    }

    plugins = [
        require('autoprefixer')({
            browsers: ['> 1%']
        }),
        require('precss'),
        require('postcss-sprites').default(sprites),
        require('postcss-assets')(assets),
        require('postcss-calc'),
        require('postcss-opacity'),
        require('postcss-pxtorem')({
            rootValue: 40,
            unitPrecision: 5, // 保留5位小数字
            minPixelValue: 2, // 小于 2 时，不转换
            selectorBlackList: [], // 选择器黑名单，可以使用正则
            propWhiteList: [] // 属性名称为空，表示替换所有属性的值
        }),

        // 可选
        require('postcss-use')({
            modules: ['postcss-clearfix', 'postcss-crip', 'postcss-short', 'postcss-center', 'postcss-position']
        })
    ];

    if (et === env.pro) {
        plugins.push(require('postcss-cachebuster')({
            imagesPath: `/${dist.img}`,
            cssPath: `/${dist.css}`
        }));
    }
    return plugins;
};

// default
gulp.task('default', ['postcss-dev', 'postcss-dev-h5', 'postcss-watch', 'webpack-dev-server']);

// ge
gulp.task('ge', ['postcss', 'webpack']);

// dist
gulp.task('dist', ['ge'], () => {

    return gulp.src('dist/**/')
        .pipe(gutil.noop());
});

// postcss compile in dev
gulp.task('postcss-dev', () => {
    return gulp.src('scss/index.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(postcssPlugin(env.dev)))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css/'));
});

// postcss compile in dev-h5
gulp.task('postcss-dev-h5', () => {
    return gulp.src('m-scss/m-index.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(postcssPlugin(env.dev)))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css/'));
});

// postcss file watch
gulp.task('postcss-watch', () => {
    gulp.watch('scss/**/*.css', ['postcss-dev']);
    gulp.watch('m-scss/**/*.css', ['postcss-dev-h5']);
});

// copy assets
gulp.task('assets', ['img', 'font']);

// copy img
gulp.task('img', () => {
    return gulp.src('img/**/*')
        .pipe(gulp.dest(dist.img));
});

// copy font
gulp.task('font', () => {
    return gulp.src('font/*')
        .pipe(gulp.dest(dist.font));
});

// postcss compile in pro
gulp.task('postcss', ['assets'], () => {
    return gulp.src('scss/index.css')
        .pipe(postcss(postcssPlugin(env.pro)))
        .pipe(cssnano())
        .pipe(gulp.dest(dist.css));
});

// webpack dev server
gulp.task('webpack-dev-server', () => {
    var devConfig = Object.assign({}, webpackConfig, {
        debug: true
    });
    new WebpackDevServer(webpack(devConfig), {
        publicPath: devConfig.output.publicPath,
        hot: true,
        historyApiFallback: true,
        inline: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }).listen(5001, 'localhost', (err) => {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }
        gutil.log('[webpack-serve]', 'http://127.0.0.1:5001/');
    });
});

// webpack compile in pro
gulp.task('webpack', () => {
    var proConfig = Object.assign({}, webpackConfig);

    proConfig.output.path = dist.js;
    webpack(proConfig, (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack compile]:', stats.endTime - stats.startTime, 'ms');
    });
});