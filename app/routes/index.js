module.exports = (app) => {
    require('./kalibrasiAlat.routes')(app)
    require('./auth.routes')(app)
}