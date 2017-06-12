const fs = require("fs")
const request = require("request"),
    json2csv = require('json2csv'),
    jsdom = require("jsdom"),
    { JSDOM } = jsdom


const fields = ['Title', 'Price', 'URL', 'ImageURL', 'Time'],
    data = []
const now = new Date()
const formattedDate = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`

request('http://www.shirts4mike.com', (err, response, body) => {
    if (err) throw err
    if (response.statusCode === 200) {
        const { document } = (new JSDOM(body)).window
        const shirtAnchors = document.querySelectorAll('a[href*="shirt.php?"]')
        const shirtAnchorHrefs = Array.from(shirtAnchors).map(ele => ele.getAttribute('href'))

        shirtAnchorHrefs.map((href) => {
            request(`http://www.shirts4mike.com/${href}`, (err, response, body) => {
                if (err) throw err
                scrapeShirt(body, response)
            })
        })
    }
    else {
        console.log(`There's been a ${response.statusCode} error. Cannot connect to http://shirts4mike.com.`)
    }
})

function scrapeShirt(rawHTML, response) {
    const { document } = (new JSDOM(rawHTML)).window
    const title = document.querySelector('title').innerHTML
    const price = document.querySelector('.price').innerHTML
    const imageUrl = document.querySelector('.shirt-picture img').src
    const url = response.request.href
    data.push({
        'Title': title,
        'Price': price,
        'ImageURL': imageUrl,
        'URL': url,
        'Time': now
    }) 
    writeToCsv(data)
}

function writeToCsv(data) {
    if (!fs.existsSync('data')) fs.mkdir('data')
    json2csv({
        'data': data,
        'fields': fields
    }, (err, csv) => {
        if (err) throw err
        fs.writeFile(`data/${formattedDate}.csv`, csv, (err) => {
            if (err) throw err
        })
    })
}
