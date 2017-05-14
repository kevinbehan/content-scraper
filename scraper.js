const fs = require("fs")
const jsdom = require("node-jsdom")
const scrape = require('website-scraper')
let options = {
  "urls": ['http://shirts4mike.com/shirts.php'],
  "directory": 'data',
  "subdirectories": [
      {"directory": 'shirts', "extensions": ['.php']}
      ],
  "recursive": true,
  "maxRecursiveDepth": 1,
  urlFilter(url) {
    return url.includes('/shirts.php') || url.includes('/shirt.php')
  }
}

scrape(options).then((result) => {
    /*console.log(result[0])*/
    fs.readdir("/data/shirts", (files)=>{
        console.log(result.children)
    })
}).catch((err) => {
    console.log(err)
    
});