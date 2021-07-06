const express = require('express')
const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')
const https = require('https')
const fs = require('fs')

const app = express()
const port = 3000

app.get('/', async (req, res) => {
	// prepare data
	const proxy = 'https://cors-anywhere.herokuapp.com'
	const env = 'prod' // prod
	const min = 12 // change here after fetching
	const max = 364152 // change here after fetching; July 6th, 2021 3:22PM

	// prepare function
	const createFolder = function (path) {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, {recursive: true})
		}
	}

	const downloadImage = function (url, savePath, index) {
		const file = fs.createWriteStream(`${savePath}/${index}.jpg`)
		const request = https.get(url, function(response) {
			response.pipe(file)
		})
	}

	// loop all pages
    for (let n = min; n <= max; n++) {
        // fetch page contents
		const url = `${proxy}/https://nhentai.to/g/${n}`
		const headers = {'X-Requested-With': 'XMLHttpRequest'}
		const savePath = `nhentai/${n}`

		// log
		console.log('\x1b[36m%s\x1b[0m', `Fetching contents of page-${n}`)

		const response = await fetch(url, {headers: headers})
		const html = await response.text()

		// log
		console.log('\x1b[36m%s\x1b[0m', `Fetched contents of page-${n}`)

		// fetch image tabs
		const doc = new JSDOM(html)
		const images = doc.window.document.querySelectorAll('#thumbnail-container > .thumb-container img')
		const totalImages = images.length / 2

		// loop image tabs
		images.forEach((image, index) => {
			// create folder
			createFolder(savePath)

			// download images
			if (index%2 != 0) { // skipped base64
				downloadImage(image.src, savePath, index)
			}
		})

		// log
		console.log('\x1b[32m%s\x1b[0m', `Downloaded ${totalImages} images in page-${n}`)

        // only loop first page in dev mode
        if (env == 'dev') {
            break
        }
    }

	// log
	console.log('\x1b[31m%s\x1b[1m', `Make changes in min & max variables for next time!`)
})

const server = app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`)
})

server.timeout = 0