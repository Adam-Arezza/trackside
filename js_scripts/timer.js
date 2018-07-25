var timer = setInterval(runTime, 1000)
var startTime = Date.now()
var intervalCount = 0
function runTime(){
    var newTime 
        if(intervalCount<10){
            newTime = Date.now() - startTime
            console.log(newTime/1000)
            intervalCount ++
        }
        else{
            clearInterval(timer)
        }
}


