const fs = require('fs');
const path = require('path');

var competitorList = {
    Participants:""
}
//Reading the csv file from the directory
function importCsv () {
    fs.readFile(__dirname + "/test.csv", "utf8", function(err,data){
        if (err){
            throw err;
        }
        if (data){
            var competitors = []
            csvJson(data, competitors)
            competitorList.Participants = competitors
            console.log(competitorList)
        }
    })
}

function csvJson(csv, compList){
    var rows = csv.split("\n");
    var headers = rows[0].split(",")

    for(var i = 1;i < rows.length;i++){
        var obj = {};
        var currentline = rows[i].split(",");
        for(var j = 0;j < headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        compList.push(obj)
    }
}
