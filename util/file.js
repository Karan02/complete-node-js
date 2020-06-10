const fs = require("fs")

// this will delete the file
const deleteFile = (filePath) => {
    fs.unlink(filePath,(err)=>{
        if(err){
            throw err
        }

    })
}

exports.deleteFile = deleteFile