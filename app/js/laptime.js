
var gates = {
    0: [],
    1: [],
    2: [],
    3: [],
}

function stageDriver(competitor) {
    console.log('Found competitor', competitor) 
    gates[0].push(competitor);
}

function gateTriggered(gate) {
    var driversAtGate = gates[gate];
    if (!driversAtGate && driversAtGate == 0){
        return;
    }
    var driver = driversAtGate.shift();
    if(!driver.times && !driver.rawTimes){
        driver.rawTimes = []
        driver.times = []
    }
    driver.rawTimes.push(Date.now());

    var nextGate = gate+1;
    if (!gates[nextGate]) {
        console.log("End of run", driver)
        // calculate sector times & run times\
        getSectorTimes(driver);
        getRunTime(driver);
        addRunToTable(driver)
        return;
    }
    gates[nextGate].push(driver);
}

function getSectorTimes(driver) {
        var rawSectors = driver.rawTimes
        console.log(rawSectors)
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

function addRunToTable(driverRun) {
    var table = document.getElementById("runtimes")
    var row = table.insertRow(-1)
    var carNum = row.insertCell(0)
    var sector1 = row.insertCell(1)
    var sector2 = row.insertCell(2)
    var sector3 = row.insertCell(3)
    var finalTime = row.insertCell(4)

    carNum.innerHTML = driverRun.Car
    sector1.innerHTML = driverRun.times[0]
    sector2.innerHTML = driverRun.times[1]
    sector3.innerHTML = driverRun.times[2]
    finalTime.innerHTML = driverRun.times[3]

}