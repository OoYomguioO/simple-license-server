"use strict";
const express = require('express')
const app = express()
app.use(express.json())
const Licensee = require('./Licensee')
let licensee

app.get('/ping', (req, res) => {
    res.sendStatus(200)
})

app.post('/checkKey', (req, res) => {
    res.send({
        checkStatus: licensee.checkToken(req.body.token)
    })
})

app.get('/updateMap', (req, res) => {
    licensee.updateMap()
    res.sendStatus(200)
})

class Server {
    _ip;
    _port
    constructor(ip = '127.0.0.1', port = 8080) {
        this._ip = ip;
        this._port = port;
    }

    start(licenseList_filePath, updateInterval) {
        app.listen(this._port, this._ip)
        console.log("\x1b[32m",`the server is listening ${this._ip}:${this._port}`)
        console.log("\x1b[0m")
        licensee = new Licensee(licenseList_filePath, updateInterval)
    }
}

module.exports = Server
