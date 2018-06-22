const exec = require('child_process').exec
const fs = require('fs')

fs.mkdir("./dist", 0o777, () => {
  fs.mkdir("./dist/gif", 0o777, () => {
    //exec("ls ./dist/gif | wc -l", (err, stdout, stderr) => {
    //  const count = parseInt(stdout, 10)
    //  exec(`echo "${count}" > ./gif.count`)
    //})
  })
})
