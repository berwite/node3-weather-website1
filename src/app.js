const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define path for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine and view location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Set up static directory to the server
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Carlo'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Carlo'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This are some helpful text',
        title: 'Help',
        name: 'Carlo'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        } 

        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return res.send({ error })
            } 
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    }) 

})

app.get('/products', (req, res) => {
    res.send({
        forecast: 'It is Raining',
        location: 'Philippines'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        name: 'Carlo',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Page',
        name: 'Carlo',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port' + port)
})