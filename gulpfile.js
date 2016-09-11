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

gulp.task('build:js', cb => {
  const plugins = [
    nodeResolve({
      jsnext: true,
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]

  if (process.env.NODE_ENV === 'prod') plugins.push(uglify())

  const index = rollup.rollup({
    entry: 'src/js/index.js',
    plugins
  }).then(bundle => {
    bundle.write({
      dest: 'dist/index.js',
      format: 'cjs'
    })
  })
  const worker = rollup.rollup({
    entry: 'src/js/worker.js',
    plugins
  }).then(bundle => {
    bundle.write({
      dest: 'dist/worker.js',
      format: 'cjs'
    })
  })
  return Promise.all([index, worker])
})

gulp.task('build:html', () =>
  gulp.src('src/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
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
