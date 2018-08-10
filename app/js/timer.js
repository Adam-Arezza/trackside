//main timer function for gathering timestamps from the nanos
//This will work directly with the serialport module
//When the master arduino receievs a signal from a slave arduino it will send a serial message
//At the moment of the message, the timestamp is taken
const serialport = require("serialport");
const port = new serialport("/dev/ttyACM0", {
    baudRate: 9600
})

const parsers = serialport.parsers
const parser = new parsers.Readline({
    delimeter: "\n"
})

let startStamp = false

port.on('open', function () {
    console.log('Serial Port Opend');
});

port.on('data', function (data) {
    console.log("Data: ", data[0])
    if (data[0] == 48) {
        startStamp = true
    }
    if (data[0] == 13) {

    }
});


//Select the competitor in the dropdown
//click the "ready" button to initiate the lap
function selectCompetitor() {
    //console.log(document.getElementById("carList").value)
    var competitor = document.getElementById("carList").value
    var results = getTimes()

}
var newRunTimes = lapTime(competitor)
console.log(results)
for (i in competitorList.Participants) {
    console.log(competitorList.Participants[i].Car)
    if (competitor == competitorList.Participants[i].Car) {
        competitorList.Participants[i].Run1 = results
    }
}
console.log(competitorList)

function getTimes() {
    var timer = setInterval(runTime, 1000)
    var startTime = Date.now()
    var intervalCount = 0
    var runTimes = []

    function runTime() {
        var newTime
        if (intervalCount < 5) {
            newTime = (Date.now() - startTime) / 1000
            //console.log(newTime.toPrecision(4))
            intervalCount++
            runTimes.push(newTime.toPrecision(4))
        }
        else {
            clearInterval(timer)
        }
    }
    return runTimes
}

function lapTime(competitor){
    
}

