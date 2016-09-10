/* eslint-env node */
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')
const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')

gulp.task('default', ['build', 'watch'])

gulp.task('build', ['build:js', 'build:html', 'build:css', 'build:json'])

let cache
gulp.task('build:js', cb =>
  rollup.rollup({
    entry: 'client/js/app.js',
    cache,
    plugins: [
      nodeResolve({
        jsnext: true,
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
      uglify()
    ]
  }).then(bundle => {
    cache = bundle
    bundle.write({
      dest: 'dist/bundle.js',
      format: 'cjs'
    })
  })
)

gulp.task('build:html', () =>
  gulp.src('client/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
)

gulp.task('build:css', () =>
  gulp.src(['client/css/normalize.css', 'client/css/app.css'])
    .pipe(concat('bundle.css'))
    .pipe(cleanCSS({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('dist'))
)

gulp.task('build:json', () =>
  gulp.src('client/json/*.json')
    .pipe(gulp.dest('dist'))
)

gulp.task('watch', ['watch:js', 'watch:html', 'watch:css'])

gulp.task('watch:js', () => {
  gulp.watch('client/js/*', ['build:js'])
})

gulp.task('watch:html', () => {
  gulp.watch('client/html/*', ['build:html'])
})

gulp.task('watch:css', () => {
  gulp.watch('client/css/*', ['build:css'])
})
