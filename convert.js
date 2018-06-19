const exec = require('child_process').exec
const fs = require('fs')

const commands = {
  "cleanworkspace": "rm -rf ./raw/*.png",
  "video2png": "ffmpeg -y -i ./raw/video.h264 -vf fps=3 ./raw/out%d.png",
  "copypngs": "rm -rf ./raw/workspace/*.png && cp ./raw/*.png ./raw/workspace/",
  "mogrify": "mogrify -stroke '#000C' -strokewidth 2 -pointsize 60 -font impact -gravity south -annotate 0 \"TEXT\" -stroke none -fill white -pointsize 60 -font impact -gravity south -annotate 0 \"TEXT\" ./raw/workspace/*.png",
  "pngs2gif": "ffmpeg -y -f image2 -r 8 -i ./raw/workspace/out%d.png ./raw/workspace/working.gif"
}

function setupWorkspace(callback) {
  console.log('setting up workspace')
  console.log(commands.video2png)
  exec(`${commands.video2png}`, (err, stdout, stderr) => {
    console.log('done')
    console.log(commands.copypngs)
    exec(`${commands.copypngs}`, (err, stdout, stderr) => {
      console.log('done')
      console.log(commands.pngs2gif)
      exec(`${commands.pngs2gif}`, (err, stdout, stderr) => {
        console.log('done')
        callback()
      })
    })
  })
}

function createGifWithText(text, callback) {
  async.series([
    async.apply(exec, commands.copypngs),
    async.apply(exec, commands.mogrify.replace("TEXT", text)),
    async.apply(exec, commands.pngs2gif)
  ], (err, results) => {
    callback()
  })
}

function createGifWithoutText(callback) {
  async.series([
    async.apply(exec, commands.copypngs),
    async.apply(exec, commands.pngs2gif)
  ], (err, results) => {
    callback()
  })
}

function moveFinalGif(callback) {
  const ts = Math.floor(new Date()/1000)
  fs.mkdir('../dist/gifs', 0o777, () => {
    fs.readFile('../gif.count', (err, data) => {
      const count = parseInt(data, 10)
      fs.copyFile('./workspace/working.gif', `../dist/gifs/rc_${count+1}.gif`, () => {
        exec(`echo "${count+1}" > ../gif.count`, (err, stdout, stderr) => {
          callback()
        })
      })
    })
  })
}

module.exports = {
  setupWorkspace,
  createGifWithText,
  createGifWithoutText,
  moveFinalGif
}
