const fs = require('fs')
const path = require('path')

exports.getFileContents = (filePath)=>{
   let fileContents = JSON.parse(fs.readFileSync(path.join(__dirname, filePath)))
   return fileContents
     
}