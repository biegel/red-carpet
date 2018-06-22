const exec = require('child_process').exec
const fs = require('fs')
const scp = require('scp')

const commands = {
  "clearrawvideo": "rm -rf ./raw/video.h264",
  "cleanworkspace": "rm -rf ./raw/*.png",
  "video2png": "ffmpeg -y -i ./raw/video.h264 -vf fps=3 ./raw/out%d.png",
  "copypngs": "rm -rf ./raw/workspace/*.png && cp ./raw/*.png ./raw/workspace/",
  "mogrify": "mogrify -stroke '#000C' -strokewidth 2 -pointsize 60 -font impact -gravity south -annotate 0 \"TEXT\" -stroke none -fill white -pointsize 60 -font impact -gravity south -annotate 0 \"TEXT\" ./raw/workspace/*.png",
  "pngs2gif": "ffmpeg -y -f image2 -r 8 -i ./raw/workspace/out%d.png ./raw/workspace/working.gif"
}

function clearVideo() {
  console.log('deleting raw footage')
  exec(`${commands.clearrawvideo}`, (err, stdout, stderr) => {
    console.log('raw video deleted')
    callback()
  })
}

function setupWorkspace(callback) {
  console.log('setting up workspace')
  console.log(commands.video2png)
  exec(`${commands.video2png}`, (err, stdout, stderr) => {
    console.log(commands.copypngs)
    exec(`${commands.copypngs}`, (err, stdout, stderr) => {
      console.log(commands.pngs2gif)
      exec(`${commands.pngs2gif}`, (err, stdout, stderr) => {
        console.log('done')
        callback()
      })
    })
  })
}

function createGifWithText(text, callback) {
  console.log(`creating gif with text '${text}'`)
  console.log(commands.copypngs)
  exec(`${commands.copypngs}`, (err, stdout, stderr) => {
    const cmd = commands.mogrify.replace(/TEXT/g, text)
    console.log(cmd)
    exec(`${cmd}`, (err, stdout, stderr) => {
      console.log(commands.pngs2gif)
      exec(`${commands.pngs2gif}`, (err, stdout, stderr) => {
        console.log('done')
        callback()
      })
    })
  })
}

function moveFinalGif(callback) {
  exec(`mkdir -p ./dist/gif`, (err, stdout, stderr) => {
    getCurrentCount().then((count) => {
      exec(`cp ./raw/workspace/working.gif ./dist/gif/rc_${count+1}.gif`, (err, stdout, stderr) => {
        if ( err ) {
          console.error('failed to copy to final dest')
          callback({
            status: 'error',
            message: 'failed to copy to final dest locally'
          })
        } else {
          console.log('uploading to remote host...')
          incrementCount().then((newCount) => { 
            exec(`scp ./gif.count ${process.env.REMOTE_USERNAME}@${process.env.REMOTE_HOST}:~/biegel.com/app/redcarpet/`, (err, stdout, stderr) => {
              if ( err ) {
                console.error('upload count failed')
                callbackJson = { status: 'failed' } 
              } else {
                console.log('upload count successful')
                callbackJson = { status: 'success' }
              }
              exec(`scp ./dist/gif/rc_${newCount}.gif ${process.env.REMOTE_USERNAME}@${process.env.REMOTE_HOST}:~/biegel.com/app/redcarpet/`, (err, stdout, stderr) => {
                let callbackJson;
                if ( err ) {
                  console.error('upload failed')
                  callbackJson = { status: 'failed' } 
                } else {
                  console.log('upload successful')
                  callbackJson = { status: 'success' }
                }
                callback(Object.assign({ gifId: (newCount) }, callbackJson))
              })
            })
          })
        }
      })
    })
  })
}

function getCurrentCount() {
  return new Promise((res, rej) => {
    fs.readFile('./gif.count', (err, data) => {
      if ( err ) {
        rej(err)
      } else {
        const count = parseInt(data, 10)
        res(count)
      }
    })
  })
}
      
function incrementCount() {
  return new Promise((res, rej) => {
    getCurrentCount().then((count) => {
      exec(`echo "${count+1}" > ./gif.count`, (err, stdout, stderr) => {
        if ( err ) {
          rej(stderr)
        } else {
          res(count+1)
        }
      })
    })
  })
}

module.exports = {
  setupWorkspace,
  createGifWithText,
  moveFinalGif,
  getCurrentCount,
  incrementCount,
  clearVideo
}
