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
    entry: 'src/js/index.js',
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
  gulp.src('src/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
)

gulp.task('build:css', () =>
  gulp.src(['src/css/normalize.css', 'src/css/app.css'])
    .pipe(concat('bundle.css'))
    .pipe(cleanCSS({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('dist'))
)

gulp.task('build:json', () =>
  gulp.src('src/json/*.json')
    .pipe(gulp.dest('dist'))
)

gulp.task('watch', ['watch:js', 'watch:html', 'watch:css'])

gulp.task('watch:js', () => {
  gulp.watch('src/js/*', ['build:js'])
})

gulp.task('watch:html', () => {
  gulp.watch('src/*.html', ['build:html'])
})

gulp.task('watch:css', () => {
  gulp.watch('src/css/*', ['build:css'])
})
