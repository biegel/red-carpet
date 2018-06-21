const gulp = require('gulp')
const util = require('gulp-util')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const rename = require('gulp-rename')
const es = require('event-stream')
const exec = require('child_process').exec

const browserify = require('browserify')
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
  // gulp fucking sucks, this should not be so complicated
  exec(`yarn run browserify dist/main.js -o dist/bundle.js`, (err, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
  })
})
gulp.task('react:watch', () => {
  gulp.watch('./src/public/assets/javascripts/**/*.jsx', ['react', 'browserify'])
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
  serverProcess = spawn('node', ['./index.js'], { env, stdio: 'inherit' })
  serverProcess.on('close', (code) => console.log(`killed server with exit code ${code}`))
})
gulp.task('watch', () => {
  // run a front-end build once in case ./dist folder doesn't exist
  gulp.run(['react', 'browserify'])
  gulp.run(['react:watch', 'server:watch'])
})
gulp.task('build', () => {
  gulp.run(['react', 'browserify'])
})
gulp.task('start', () => {
  gulp.run(['server'])//, 'socket'])
})
