const fs = require('fs');
// const path = require('path');
const { dialog } = require('electron').remote;

//empty to store competitors from imported csv file
var competitorList = []

function findCompetitor() {
    console.log("Looking for competitor")
    var carNumber = document.getElementById("carList").value;
    return competitorList.find(function (competitor) {
        return (competitor.Car === carNumber)
    });
}

//Import the selected csv file and generate the competitor list
//need to add file selection functionality instead of hardcoded URL in import function
document.getElementById("importList").addEventListener("click", function () {
    importCsv()
})

//Reading the csv file from the directory

function importCsv() {
    dialog.showOpenDialog(function (fileNames) {
        var fileName = fileNames[0];
        if (fileNames === undefined) {
            return console.log("no file selected")
        }
        //console.log("The filename is" + fileName + typeof (fileName))

        if (fileName.split(".")[1] == "csv") {
            console.log("File accepted, generating competitor list...")
            alert("File accepted, generating competitor list...")
            fs.readFile(fileName, "utf8", function (err, data) {
                if (err) {
                    throw err;
                }
                if (data) {
                    var competitors = []
                    csvJson(data, competitors)
                    competitorList.push(...competitors)
                }
                //adding competitors to the selection dropdown for the user
                //The current car at start gate will be selected here prior to run
                for (i = 0; i < competitors.length; i++) {
                    var carList = document.getElementById("carList")
                    var newOption = document.createElement("option")
                    newOption.text = JSON.stringify(competitors[i].Car + " " + competitors[i].Name)
                    //adding new options in the <select> dropdown
                    carList.add(newOption)
                    //adding a value to each new competitor <option> in dropdown based on car#
                    newOption.value = competitors[i].Car
                }
            })
        }
        else {
            console.log("filetype incorrect, please select a CSV file")
            alert("filetype incorrect, please select a CSV file")
        }
    })
}

//parameters: csv is the csv file, compList is a predefined empty list to store competitor objects
//Rows in the csv are separated by newline (\n) stored in "rows"
//Within the first row, the headers for each column are separated stored in "headers"
//Iterating through the rows other than header row
//empty object to store competitor information
//inserting key,value pairs into the empty object
//array of objects of competitor information is the result

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
