var fs = require("fs")

fs.readdir("data", function(err, files){
    if(err){
        fs.mkdir("data")
    }
    else {
        files.map( val => console.log(val))
    }
})
