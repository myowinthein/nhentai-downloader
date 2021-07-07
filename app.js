require('dotenv').config()

const express = require('express')
const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')
const https = require('https')
const fs = require('fs')
const validUrl = require('valid-url')

const app = express()
const port = 3000

app.get('/', async (req, res) => {
	// prepare data
	const proxy = 'https://cors-anywhere.herokuapp.com'
	const env = process.env.NODE_ENV
	const min = process.env.MIN // change after fetching
	const max = process.env.MAX // change after fetching; July 6th, 2021 3:22PM
	let format = 'jpg'

	// prepare function
	const createFolder = function (path) {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, {recursive: true})
		}
	}

	const downloadImage = function (url, savePath, counter) {
		const file = fs.createWriteStream(`${savePath}/${counter}.${format}`)
		const request = https.get(url, function(response) {
			response.pipe(file)
		})
	}

	const sleep = function (ms = 1000) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms)
		})
	}

	const getFullSize = function (url) {
		let fullSizeURL = url
		if (env == 'production') {
            fullSizeURL = url.replace(`t.${format}`, `.${format}`)
        }

		return fullSizeURL
	}

	const getImageFormat = function (url) {
		return url.split(/[#?]/)[0].split('.').pop().trim()
	}

	// loop all pages
    for (let n = min; n <= max; n++) {
		// log
		console.log('\x1b[36m%s\x1b[0m', `Fetching contents of page-${n}`)

		// add delay to prevent proxy timeout
		if (n%10 === 0) {
			await sleep()
		}

        // fetch page contents
		const url = `${proxy}/https://nhentai.to/g/${n}`
		const headers = {'X-Requested-With': 'XMLHttpRequest'}

		const response = await fetch(url, {headers: headers})
		const html = await response.text()

		// log
		console.log('\x1b[36m%s\x1b[0m', `Fetched contents of page-${n}`)

		// fetch image tabs
		const doc = new JSDOM(html)
		const title = doc.window.document.querySelector('#info h1').innerHTML
		const images = doc.window.document.querySelectorAll('#thumbnail-container > .thumb-container img')
		const totalImages = images.length / 2 // jsdom package auto translate url into base64 & double the images
		const savePath = `nhentai/${n} - ${title}`

		// loop image tabs
		let counter = 1
		images.forEach(image => {
			// prepare data
			const imageSrc = image.src

			// create folder
			createFolder(savePath)

			// download images
			if (validUrl.isHttpsUri(imageSrc)) { // skipped base64
				format = getImageFormat(imageSrc)
				const imageSrcFull = getFullSize(imageSrc)
				downloadImage(imageSrcFull, savePath, counter)
				counter++
			}
		})

		// log
		console.log('\x1b[32m%s\x1b[0m', `Downloaded ${totalImages} images in page-${n}`)

        // only loop first page in dev mode
        if (env == 'development') {
            break
        }
    }

	// log
	console.log('\x1b[31m%s\x1b[1m', `Make changes in min & max variables for next time!`)
})

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`)
})