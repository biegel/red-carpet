const exec = require('child_process').exec
const fs = require('fs')
const async = require('async')

const commands = {
  "video2png": "ffmpeg -i ./video.h264 -vf fps=3 out%d.png",
  "copypngs": "rm ./workspace/*.png && cp *.png ./workspace/",
  "mogrify": "mogrify -stroke '#000C' -strokewidth 2 -pointsize 60 -font impact -gravity south -annotate 0 \"TEXT\" -stroke none -fill white -pointsize 60 -font impact -gravity south -annotate 0 \"TEXT\" *.png",
  "pngs2gif": "ffmpeg -f image2 -r 8 -i ./workspace/out%d.png ./workspace/working.gif"
}

function setupWorkspace() {
  async.series([
    async.apply(exec, commands.video2png),
    async.apply(exec, commands.copypngs),
    async.apply(exec, commands.pngs2gif)
  ])
}

function createGifWithText(text) {
  async.series([
    async.apply(exec, commands.copypngs),
    async.apply(exec, commands.mogrify.replace("TEXT", text)),
    async.apply(exec, commands.pngs2gif)
  ])
}

function createGifWithoutText() {
  async.series([
    async.apply(exec, commands.copypngs),
    async.apply(exec, commands.pngs2gif)
  ])
}

function moveFinalGif() {
  const ts = Math.floor(new Date()/1000)
  fs.mkdir('../dist/gifs', 0o777, () => {
    fs.readFile('../gif.count', (err, data) => {
      const count = parseInt(data, 10)
      fs.copyFile('./workspace/working.gif', `../dist/gifs/rc_${count+1}.gif`, () => {
        exec(`echo "${count+1}" > ../gif.count`)
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
