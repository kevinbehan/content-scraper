let fs = require("fs")
let scrape = require('website-scraper');
let options = {
  urls: ['http://shirts4mike.com/shirts.php'],
  directory: 'data',
  subdirectories: [
      {directory: 'shirts', extensions: ['.php']}
      ],
  recursive: true,
  maxRecursiveDepth: 1,
  urlFilter(url) {
    return url.includes('/shirts.php') || url.includes('/shirt.php')
  }
}

scrape(options).then((result) => {
    /*console.log(result[0])*/
}).catch((err) => {
    console.log(err)
    
});