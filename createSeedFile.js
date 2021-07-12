'use strict';

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const fs = require('fs');
const beautify = require('js-beautify');
const path = require('path');
const homeDir = require('os').homedir();
const desktopDir = `${homeDir}/Desktop`;
// Set the path the seed file will be saved to
let outputPath = `${desktopDir}/seed.json`;
outputPath = path.normalize(outputPath);

let data = null;
let exportData = {};

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
        // Write the file to the desktop as "seed.json"
        console.log(`Saving API Data to "${outputPath}"`);
        fs.writeFileSync(outputPath, exportData);
        console.log('DONE');
    }
});

xhr.open("GET", "https://tarkov-market-proxy.eftitemfilter.com/api/v1/bsg/items/all");
xhr.send();
