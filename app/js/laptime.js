const serialport = require("serialport");
const port = new serialport("/dev/ttyACM0", {
    baudRate: 9600
})

// When a message is received frrom the master arduino
// gateTriggered function is called with the nanos gate # passed in

port.on('data', function (data) {
    //console.log("Data: ", data[0])
    if (data[0] == 48) {
        gateTriggered(0)
    }

    if (data[0] == 49) {
        gateTriggered(0)
    }

    if (data[0] == 50) {
        gateTriggered(0)
    }

    if (data[0] == 51) {
        gateTriggered(3)
    }
    
    return "no incoming signals"
});

//sector gates including start and finish gates
var gates = {
    0: [],
    1: [],
    2: [],
    3: [],
}
var runCount = 1
//staging the selected competitor for the run
function stageDriver(competitor) {
    console.log('Found competitor', competitor) 
    gates[0].push(competitor);
}
//arduino will signal containning the triggered gate will be passsed into gateTriggered
function gateTriggered(gate) {
    var driversAtGate = gates[gate];
    if (!driversAtGate && driversAtGate == 0){
        console.log("Driver didnt pass correct gate")
        return;
    }
    var driver = driversAtGate.shift();
    if(!driver.times && !driver.rawTimes){
        driver.rawTimes = []
        driver.times = []
        driver.runs = {}
    }

    driver.rawTimes.push(Date.now());
    
    var nextGate = gate+1;
    if (!gates[nextGate]) {
        console.log("End of run", driver)
        // calculate sector times & run times\
        getSectorTimes(driver);
        getRunTime(driver);
        // addRunToTable(driver);
        runTable(driver);
        return;
    }
    gates[nextGate].push(driver);
}

function getSectorTimes(driver) {
        var rawSectors = driver.rawTimes
        //console.log(rawSectors)
        if(!rawSectors || rawSectors.length < 1){
            return
        }
        for (i = 0; i < rawSectors.length - 1; i++) {
            driver.times.push((rawSectors[i+1] - rawSectors[i])/1000)
        }
}

function getRunTime(driver) {
    var times = driver.rawTimes
    if (!times || times < 1) {
        return 0;
    }
    driver.times.push((times[times.length - 1] - times[0])/1000)
}

// function addRunToTable(driverRun) {
//     var table = document.getElementById("runtimes")
//     var row = table.insertRow(-1)
//     var carNum = row.insertCell(0)
//     var sector1 = row.insertCell(1)
//     var sector2 = row.insertCell(2)
//     var sector3 = row.insertCell(3)
//     var finalTime = row.insertCell(4)

//     carNum.innerHTML = driverRun.Car
//     sector1.innerHTML = driverRun.times[0]
//     sector2.innerHTML = driverRun.times[1]
//     sector3.innerHTML = driverRun.times[2]
//     finalTime.innerHTML = driverRun.times[3]
// }

function runTable(driver) {
    var table = document.getElementById("runtimes")
    var row = table.insertRow(-1)
    var tableData = {
        carNum: row.insertCell(0),
        sectors: [row.insertCell(1), row.insertCell(2), row.insertCell(3), row.insertCell(4)]
    }
    tableData.carNum.innerHTML = driver.Car
    for(i in driver.times){
        tableData.sectors[i].innerHTML = driver.times[i]
    }
}

function runComplete(competitors) {
    for(i in competitors){
       competitors[i].rawTimes = []
       if(competitors[i].times){
        competitors[i].runs["run" + runCount] = competitors[i].times
        competitors[i].times = []
       }
    }
    runCount++
    
}