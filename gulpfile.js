const gulp = require('gulp')
const util = require('gulp-util')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const rename = require('gulp-rename')
const es = require('event-stream')
const exec = require('child_process').exec

const browserify = require('browserify')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const babelify = require('babelify')
const spawn = require('child_process').spawn
const webpackConfig = require('./webpack.config.js')
const webpackStream = require('webpack-stream')

gulp.task('react', () => {
  const files = ['./src/public/assets/javascripts/**/*.jsx']
  const tasks = files.map(file => {
    return gulp.src(file)
      .pipe(babel({
        plugins: ["transform-react-jsx"]
      }))
      .pipe(rename({
        extname: '.js',
        dirname: ''
      }))
      .pipe(gulp.dest('./dist'))
  })
  return es.merge.apply(null, tasks)
})
gulp.task('browserify', () => {
  console.log('browserify')
  // gulp fucking sucks, this should not be so complicated
  exec('yarn run browserify dist/main.js -o dist/bundle.js')
})
gulp.task('sass', () => {
  const files = ['./src/public/assets/styles/main.scss']
  const tasks = files.map(file => {
    return gulp.src(file)
      .pipe(sass())
      .pipe(rename({
        extname: '.css',
        dirname: ''
      }))
      .pipe(gulp.dest('./dist'))
  })
  return es.merge.apply(null, tasks)
})

gulp.task('sass:watch', () => {
  gulp.watch('./src/public/assets/styles/**/*.*', ['sass'])
})
gulp.task('react:watch', () => {
  gulp.watch('./src/public/assets/javascripts/**/*.jsx', ['react', 'browserify'])
})
gulp.task('webpack', () => {
  return gulp.src('./src/app')
    // gulp only takes streams, so need to transform here:
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest('./server-dist'))
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
let socketProcess
gulp.task('socket', () => {
  if ( socketProcess ) {
    socketProcess.kill()
  }
  socketProcess = spawn('node', ['./websocket.js'])
  socketProcess.on('close', (code) => console.log(`killed socket server`))
})
gulp.task('server', () => {
  if ( serverProcess ) {
    serverProcess.kill()
  }
  const env = Object.create(process.env)
  env.NODE_ENV = 'production'
  serverProcess = spawn('node', ['./server-dist/server.js'], { env, stdio: 'inherit' })
  serverProcess.on('close', (code) => console.log(`killed server with exit code ${code}`))
})
gulp.task('watch', () => {
  // run a front-end build once in case ./dist folder doesn't exist
  gulp.run(['sass', 'react', 'browserify'])
  gulp.run(['sass:watch', 'react:watch', 'server:watch', 'socket'])
})
gulp.task('build', () => {
  gulp.run(['webpack', 'sass', 'react', 'browserify'])
})
gulp.task('start', () => {
  gulp.run(['server', 'socket'])
})
