const gulp = require('gulp')
const util = require('gulp-util')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const rename = require('gulp-rename')
const es = require('event-stream')

const browserify = require('browserify')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const spawn = require('child_process').spawn
const webpackConfig = require('./webpack.config.js')
const webpackStream = require('webpack-stream')

gulp.task('javascript', () => {
  const files = ['./src/public/assets/javascripts/main.js']
  const tasks = files.map(file => {
    return browserify({ entries: [file] })
      .bundle()
      .pipe(source(entry))
      .pipe(buffer())
      .pipe(rename({
        extname: '.dist.js',
        dirname: ''
      }))
      .pipe(gulp.dest('./dist/public'))
    })
  return es.merge.apply(null, tasks)
})
gulp.task('react', () => {
  const files = ['./src/public/assets/javascripts/app.jsx']
  const tasks = files.map(file => {
    return gulp.src(file)
      .pipe(babel({
        plugins: ['transform-react-jsx']
      }))
      .pipe(rename({
        extname: '.react.js',
        dirname: ''
      }))
      .pipe(gulp.dest('./dist/public'))
    })
  return es.merge.apply(null, tasks)
})
gulp.task('sass', () => {
  const files = ['./src/public/assets/styles/main.scss']
  const tasks = files.map(file => {
    return gulp.src(file)
      .pipe(sass())
      .pipe(rename({
        extname: '.dist.css',
        dirname: ''
      }))
      .pipe(gulp.dest('./dist/public'))
  })
  return es.merge.apply(null, tasks)
})

gulp.task('sass:watch', () => {
  gulp.watch('./src/public/assets/styles/**/*.*', ['sass'])
})
gulp.task('javascript:watch', () => {
  gulp.watch('./src/public/assets/javascripts/**/*.js$', ['javascript'])
})
gulp.task('react:watch', () => {
  gulp.watch('./src/public/assets/javascript/**/*.jsx$', ['react'])
})

let serverProcess;
gulp.task('server:watch', () => {
  if ( serverProcess ) {
    serverProcess.kill()
  }
  const env = Object.create(process.env)
  env.NODE_ENV = 'development'
  serverProcess = spawn('nodemon', ['./index.js'], { env, stdio: 'inherit' })
  serverProcess.on('close', (code) => console.log(`killed server with exit code ${code}`))
})
gulp.task('watch', () => {
  gulp.run(['sass:watch', 'javascript:watch', 'react:watch', 'server:watch'])
})
gulp.task('build', () => {
  gulp.run(['sass', 'javascript', 'react'])
})
