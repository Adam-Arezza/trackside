
function getTimes(competitor) {

    var timer = setInterval(runTime, 1000)
    var startTime = Date.now()
    var intervalCount = 0
    var runTimes = [competitor]

    function runTime() {
        var newTime
        if (intervalCount < 5) {
            newTime = (Date.now() - startTime) /1000
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

