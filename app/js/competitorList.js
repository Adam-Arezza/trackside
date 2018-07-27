const fs = require('fs');
const path = require('path');
const { dialog } = require('electron').remote;

//empty array to store competitors from imported csv file
var competitorList = {
    Participants: ""
}

//Import the selected csv file and generate the competitor list
//need to add file selection functionality instead of hardcoded URL in import function
document.getElementById("importList").addEventListener("click", function () {
    importCsv()
})

function selectCompetitor() {
    console.log(competitorList)
    console.log(document.getElementById("carList").value)
    var competitor = document.getElementById("carList").value
    var results = getTimes(competitor)
    //getTimes(competitor)
    console.log(results)
    for(i in competitorList.Participants){
        if(results[0] === competitorList.Participants[i].Car){
            competitorList.Participants[i].Runs = results
        }
    }
    
    console.log(competitorList)
}

//Reading the csv file from the directory
//need to add file selection functionality
function importCsv() {
    dialog.showOpenDialog(function (fileNames) {
        if (fileNames === undefined) return;
        var fileName = fileNames[0];
        console.log("The filename is" + fileName + typeof(fileName))
        fs.readFile(fileName, "utf8", function (err, data) {
            if (err) {
                throw err;
            }
            if (data) {
                var competitors = []
                csvJson(data, competitors)
                competitorList.Participants = competitors
                console.log(competitorList)
            }
            //adding competitors to the selection dropdown for the user
            //The current car at start gate will be selected here prior to run
            for (i = 0; i < competitors.length; i++) {
                var carList = document.getElementById("carList")
                var newOption = document.createElement("option")
                newOption.text = JSON.stringify(competitors[i])
                carList.add(newOption)
                newOption.value = competitors[i].Car
            }
        })
    })
}

function csvJson(csv, compList) {
    var rows = csv.split("\n");
    var headers = rows[0].split(",")
    for (var i = 1; i < rows.length; i++) {
        var obj = {};
        var currentline = rows[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        compList.push(obj)
    }
}
