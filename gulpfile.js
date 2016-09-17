/* eslint-env node */
'use strict'
const rollup = require('rollup')
const typescript = require('rollup-plugin-typescript')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')
const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')

gulp.task('default', ['build', 'watch'])

gulp.task('build', ['build:ts', 'build:html', 'build:css', 'build:json'])

gulp.task('build:ts', ['build:ts:worker', 'build:ts:browser'])

const plugins = [
  typescript(),
  nodeResolve({
    jsnext: true,
    browser: true,
    preferBuiltins: false
  }),
  commonjs()
]

let browserCache
gulp.task('build:ts:browser', () =>
  rollup.rollup({
    entry: 'src/ts/index/index.ts',
    cache: browserCache,
    plugins
  }).then(bundle => {
    bundle.write({
      dest: 'dist/index.js'
    })
  })
)

let workerCache
gulp.task('build:ts:worker', () =>
  rollup.rollup({
    entry: 'src/ts/worker/worker.ts',
    cache: workerCache,
    plugins
  }).then(bundle => {
    bundle.write({
      dest: 'dist/worker.js'
    })
  })
)

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

gulp.task('watch', ['watch:ts', 'watch:html', 'watch:css'])

gulp.task('watch:ts', () => {
  gulp.watch('src/ts/**/*.ts', ['build:ts'])
})

gulp.task('watch:html', () => {
  gulp.watch('src/*.html', ['build:html'])
})

gulp.task('watch:css', () => {
  gulp.watch('src/css/*', ['build:css'])
})
