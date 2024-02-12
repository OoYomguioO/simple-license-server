"use strict";
const process = require('node:process')
const path = require('path')
const config = require('./config.json')
const {Server, Licensee} = require('./src')
const axios = require("axios");

console.log("\x1b[90m", 'simple-license-server © SEMANTIC TS')

if (process.argv[2]) {
    let arg = process.argv[2];
    switch (arg) {
        case "-h":
        case "--help":
            displayHelp();
            break;
        case "-s":
        case "--start":
            startServer();
            break;
        case "-nl":
        case "--new-license":
            handleNewLicense();
            break;
        case "-m":
        case "--mail":
            if (!process.argv[5]) {
                console.log("\x1b[0m", 'Error: No email provided.');
            }
            break;
        case "-nm":
        case "--nombre_max":
            if (!Number(process.argv[7])) {
                console.log("\x1b[0m", 'Error: Number of simultaneous sessions must be a number.');
            }
            break;
        default:
            console.log("\x1b[0m", 'Error: Invalid argument.');
    }
} else {
    displayHelp();
}

function displayHelp() {
    console.log("\x1b[0m", 'Usage: node . [--help | -h] [--new-license | -nl <number of days until expiration>]'+
                '\n               [--mail | -m <email linked to this token>]'+
                '\n               [--nombre_max | -nm <maximum simultaneous sessions>]'+
                '\n               [--start | -s]'+
                '\nExample: node . -nl 10 -m account@mail.com -nm 5'+
                '\n          !!! Respect the order !!!  (svp)');
}

function startServer() {
    console.log("\x1b[33m", 'Starting server...');
    let server = new Server(config.ip, config.port);
    server.start(path.join(__dirname, config.licenseListPath), config.updateInterval);
}

function handleNewLicense() {
    if (!process.argv[3] || isNaN(process.argv[3])) {
        console.log("\x1b[0m", 'Error: Number of days until expiration must be provided as a valid number.');
        return;
    }
    if (!process.argv[5]) {
        console.log("\x1b[0m", 'Error: Email must be provided for the new license.');
        return;
    }
    let numberOfDays = Number(process.argv[3]);
    let simultaneousSessions = process.argv[7] ? Number(process.argv[7]) : 1;
    let token = Licensee.addToken(path.join(__dirname, config.licenseListPath), numberOfDays * 24 * 60 * 60 * 1000, process.argv[5], simultaneousSessions);
    axios.get(`http://${config.ip}:${config.port}/updateMap`).then(() => {
        console.log("\x1b[32m", 'New token:', token);
        console.log("\x1b[0m");
        process.exit(0);
    });
}
