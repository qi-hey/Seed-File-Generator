'use strict';

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const fs = require('fs');
const beautify = require('js-beautify');
const path = require('path');
const homeDir = require('os').homedir();
const desktopDIR = `${homeDir}/Desktop`;
const serverDIR = `${__dirname}/static`;
// Set the path the seed file will be saved to
let outputPath = null;

let data = null;
let exportData = {};

let environment = null;

if (process.argv[2] !== undefined) { // We are running in a server env
    environment = 'server';
    console.log("Running in SERVER mode");
    if (!fs.existsSync(serverDIR)) {
        console.log('Creating Directory for Static Content');
        fs.mkdirSync(serverDIR);
    }
    outputPath = `${serverDIR}/seed.json`;
    outputPath = path.normalize(outputPath);
} else { // We are running on desktop
    console.log("Running in DESKTOP mode");
    environment = 'desktop';
    outputPath = `${desktopDIR}/seed.json`;
    outputPath = path.normalize(outputPath);
}

console.log('Getting API Data');

let xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        data = JSON.parse(this.responseText);
        for (var id in data) {
            if (data.hasOwnProperty(id)) {
                if (data[id]._props !== undefined) {
                    if (data[id]._props.QuestItem !== undefined) {
                        exportData[id] = {
                            "Name":data[id]._props.Name,
                            "ShortName":data[id]._props.ShortName,
                            "QuestItem":data[id]._props.QuestItem,
                            "group": 5,
                            "important": false,
                            "showItem": true
                        };
                    }
                }
            }
        }
        console.log('Formatting API Data');
        exportData = JSON.stringify(exportData);
        exportData = beautify(exportData, { indent_size: 2, space_in_empty_paren: true });
        if (environment === 'server') {
            // Write the file to the CWD's "static" directory as "seed.json"
            console.log(`Saving API Data to "${outputPath}"`);
            fs.writeFileSync(outputPath, exportData);
        } else if (environment === 'desktop') {
            // Write the file to the desktop as "seed.json"
            console.log(`Saving API Data to "${outputPath}"`);
            fs.writeFileSync(outputPath, exportData);
        } else {
            console.log('NO ENVIRONMENT SET');
        }
        console.log('DONE');
    }
});

xhr.open("GET", "https://tarkov-market-proxy.eftitemfilter.com/api/v1/bsg/items/all");
xhr.send();
