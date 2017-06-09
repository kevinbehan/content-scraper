const fs = require("fs")
const request = require("request"),
    jsdom = require("node-jsdom"),
    json2csv = require('json2csv')

const fields = ['Title', 'Price', 'URL', 'ImageURL', 'Time'],
    data = []
const now = new Date()
const formattedDate = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`

request('http://www.shirts4mike.com/', (err, response, body) => {
    if (err) throw err
    jsdom.env(body, (err, window) => {
        const shirtAnchors = window.document.querySelectorAll('a[href*="shirt.php?"]')
        const shirtAnchorHrefs = Array.from(shirtAnchors).map(ele => ele.getAttribute('href'))

        shirtAnchorHrefs.map((href) => {
            request(`http://www.shirts4mike.com/${href}`, (err, response, body) => {
                if (err) throw err
                scrapeShirt(body, response)
            })
        })

    })
    /*I don't understand why data is empty at this point in the program? */
    console.log(data)
})

function scrapeShirt(rawHTML, response) {
    jsdom.env(rawHTML, (err, window) => {
        if (err) throw err
        const title = window.document.querySelector('title').innerHTML
        const price = window.document.querySelector('.price').innerHTML
        const imageUrl = window.document.querySelector('.shirt-picture img').src
        const url = response.request.href
        data.push({
            'Title': title,
            'Price': price,
            'ImageURL': imageUrl,
            'URL': url,
            'Time': now
        })
        writeToCsv(data)
    })
}
function writeToCsv(data){
    if(!fs.existsSync('data')) fs.mkdir('data')
    json2csv({'data': data, 'fields': fields}, (err, csv) => {
        if(err) throw err
        fs.writeFile(`data/${formattedDate}.csv`, csv, (err) => {
            if(err) throw err
        })
    })
}
