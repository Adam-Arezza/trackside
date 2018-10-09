const serialport = require("serialport");
const port = "/dev/ttyACM0"
//number of times a reconnect has been attempted
var attempts = 0
//main serialport connection to the master arduino
var connectPort = function () {
    console.log("Opening connection...")
    var arduinoPort = new serialport(port, {
        baudRate: 9600
    });
    //if an error occurs on serial connection
    //the error is displayed and reconnect function called
    arduinoPort.on('error', function (err) {
        console.log("error", err)
        reConnect()
    })
    // When a message is received from the master arduino
    // gateTriggered function is called with the nanos gate # passed in
    arduinoPort.on('data', function (data) {
        var msg = data[0]
        console.log(data[0])
        switch (msg) {
            case 48:
                gateTriggered(0)
                break;
            case 49:
                gateTriggered(1)
                break;
            case 50:
                gateTriggered(2)
                break;
            case 51:
                gateTriggered(3)
                break;
        }
    });
}
//will attempt to reconnect to the main arduino
//if attempts 3 times with no connection, no further attempts are made automatically
var reConnect = function () {
    if (attempts < 3) {
        setTimeout(function () {
            console.log("reconnecting to Arduino")
            connectPort()
        }, 2000)
        attempts++
    }
    else {
        console.log("Could not establish a connection")
    }
}
//initializing the serialport connection to the main arduino
connectPort()
//sector gates including start and finish gates
var gates = {
    0: [],
    1: [],
    2: [],
    3: [],
}
//initial run count
var runCount = 1
var carsDoneRun = 0
//staging the selected competitor for the run
function stageDriver(competitor) {
    console.log('Found competitor', competitor)
    gates[0].push(competitor);
}
//the staged driver passes through each gate as they are triggered
//timestamps are taken when a gate is triggered
//when the driver has passed through each gate the times arre calculated
//and displayed in the main run table
function gateTriggered(gate) {
    var driversAtGate = gates[gate];
    // console.log("Current Driver", JSON.stringify(driversAtGate))
    if (driversAtGate == undefined || !driversAtGate) {
        return;
    }
    var driver = driversAtGate.shift();
    if (driver == undefined) {
        console.log("Gate triggered twice before new driver...")
        return
    }
    if (!driver.rawTimes) {
        driver.rawTimes = []
    }
    if (!driver.times) {
        driver.times = []
    }
    if(!driver.Runs) {
        driver.Runs = {} 
    }
    if(driver.Runs) {
        driver.Runs["run" + runCount] = {}
    }

    driver.rawTimes.push(Date.now());

    var nextGate = gate + 1;
    if (!gates[nextGate]) {
        console.log("End of run", driver.Name)
        // calculate sector times & run times
        getSectorTimes(driver);
        getRunTime(driver);
        runTable(driver);
        carsDoneRun++
        $("#carsDoneRun").text(carsDoneRun)
        return;
    }
    gates[nextGate].push(driver);
}
//calculated the sector times of the driver
function getSectorTimes(driver) {
    var rawSectors = driver.rawTimes
    //console.log(rawSectors)
    if (!rawSectors || rawSectors.length < 1) {
        return
    }
    for (i = 0; i < rawSectors.length - 1; i++) {
        driver.times.push((rawSectors[i + 1] - rawSectors[i]) / 1000)
    }
}
//calculates the runtime of the driver
function getRunTime(driver) {
    var times = driver.rawTimes
    if (!times || times < 1) {
        return 0;
    }
    driver.times.push((times[times.length - 1] - times[0]) / 1000)
}
//populates the main run table
//Currently only allows for 3 sectors
//will update to add as many sectors as needed
function runTable(driver) {
    var table = document.getElementById("runtimes")
    var row = table.insertRow(-1)
    var tableData = {
        carNum: row.insertCell(0),
        carModel: row.insertCell(1),
        sectors: [row.insertCell(2), row.insertCell(3), row.insertCell(4), row.insertCell(5)],
        //sectorSum used for testing if the added sector alues and runtime match
        sectorSum: row.insertCell(6)
    }
    tableData.carNum.innerHTML = driver.Car
    tableData.carModel.innerHTML = driver.Make + " " + driver.Model
    for (i in driver.times) {
        tableData.sectors[i].innerHTML = driver.times[i]
    }
    tableData.sectorSum.innerHTML = sum(driver.times).toPrecision(4)
}
//sums numbers array
//input should be an array of numbers
function sum(numbers) {
    var total = 0
    for (i = 0; i < numbers.length - 1; i++) {
        total += numbers[i]
    }
    return total
}
//finalizes the current run and clears values for next run
//removes all main run table values
//increments the run count
function runComplete(competitors) {
    for (i in competitors) {
        competitors[i].rawTimes = []
        if (competitors[i].times && competitors[i].times !== "DNF" && competitors[i].times.length) {
            // competitors[i].Runs["run" + runCount] = {}
            var addCompetitorRun = competitors[i].Runs["run" + runCount]
            for (sector = 0; sector <= competitors[i].times.length-2; sector++) {
                addCompetitorRun["sector" + (sector + 1)] = competitors[i].times[sector]
            }
            if(!addCompetitorRun.penalty) {
                addCompetitorRun["final"] = competitors[i].times[competitors[i].times.length-1]
            }
            else{
                addCompetitorRun["final"] = competitors[i].times[competitors[i].times.length-1]
                addCompetitorRun["penalized"] = addCompetitorRun.final + addCompetitorRun.penalty * 2.00    
            }
        }
        if(competitors[i].times == "DNF") {
            competitors[i].Runs["run" + runCount] = "DNF"
        }
        competitors[i].times = []
    }
    runCount++
    $("#runtimes td").remove()
    $("#runNumber").text("Run" + runCount)
    carsDoneRun = 0
    // localStorage.setItem("competitors", JSON.stringify(competitors))
    // localStorage.getItem("competitors")
}
//Modal for adding cone penalties or DNF during runs
//adds or subtracts cones based on input +/-
//click the save changes before closing
var selectedCompetitor
var dnf = false
var coneCount = 0
$("#runtimes").on('click', 'tr', function () {
    var compCar = $(this).find("td:eq(0)").text()
    for (i in competitorList) {
        if (compCar == competitorList[i].Car) {
            selectedCompetitor = competitorList[i]
            console.log("The selected competitor is", selectedCompetitor.Name)    
        }
    }
    $("#penaltyModal").modal('show')
    $("#modalTitle").text("Penalties")
    $("#coneCounter").text(coneCount)
})
$("#coneAdder").on('click', function () {
    coneCount ++
    $("#coneCounter").text(coneCount)
})

$("#coneSubtract").on('click', function () {
    coneCount--
    // console.log("Removed 1 cone penalty from", selectedCompetitor.Name)
    $("#coneCounter").text(coneCount)
})

$("#dnfBtn").on('click', function () {
    dnf = true
    // console.log(competitor.Name, "gets a DNF for this run", dnf)
})
$("#saveChanges").on('click', function () {
    if (dnf == true) {
        console.log("run is a DNF", dnf)
        selectedCompetitor.times = "DNF"
    }
    if (coneCount > 0) {
        console.log("Adding cone penalties to", selectedCompetitor.Name)
        selectedCompetitor.Runs["run" + runCount]["penalty"] = coneCount
    }
    coneCount = 0
})
