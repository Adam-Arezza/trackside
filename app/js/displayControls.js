//initiates the start screen of the application
//the user must import a CSV competitor list on this screen
$(document).ready(function () {
    $("#runTable").hide()
    $("#userControls").hide()
    $("#importList").show()
    $("#compTable").hide()
    $("#setupControls").hide()
    $("#setupScreen").hide()
    $("#competitorLookup").hide()
    $("#ftd").hide()
    $("#ftdDisplay").hide()
    var intervalId = setInterval(function () {
        if (!$("#carList") || $("#carList")[0].length <= 1) {
            $("#listMsg").text("Please create competitor list")
        }
        //Once the competitor list is populated, the main application screen is activated
        else {
            $("#runTable").show()
            $("#userControls").show()   
            $("#setupScreen").show()
            $("#competitorLookup").show()
            $("#listMsg").hide()
            $("#importList").hide()
            $("#ftd").show()
            clearInterval(intervalId);
            intervalId = null;
        }
    }, 1000)
    //The run count displayed above the live run table
    $("#runNumber").text('Run' + runCount)
})
//initial count for cars that completed a run
$("#carsDoneRun").text(carsDoneRun)
//shows the main screen for runtimer
$(".mainScreen").on('click', function () {
    $("#compTable").hide()
    $("#setupControls").hide()
    $("#main").show()
    $("#runTable").show()
    $("#ftdDisplay").hide()
    clearData($("#competitorData"))
})

//shows the setup screen for gate setup 
$("#setupScreen").on('click', function () {
    $("#main").hide()
    $("#runTable").hide()
    $("#setupControls").show()
    $("#compTable").hide()
})

//shows the competitor lookup table
$("#competitorLookup").on('click', function () {
    $("#main").hide()
    $("#runTable").hide()
    $("#setupControls").hide()
    $("#compTable").show()
    $("#competitorDisplay").hide()
    $("#compList").show()
    $("#backToList").hide()
    var tableCheck = $("#compList tr").length
    if (tableCheck == 1) {
        compTable(competitorList)
    }
})

//Modal for showing competitor information
//activated by competitor lookup table selection
$("#compList").on('click', 'tr', function () {
    $("#compList").hide()
    $("#backToList").show()
    var competitor
    var compCar = $(this).find("td:eq(1)").text()
    for (i in competitorList) {
        if (compCar === competitorList[i].Car) {
            competitor = competitorList[i]
            for (item in competitor) {
                if(item == "Runs"){
                    // console.log("The RUNS are being shown")
                    var label = "<h6>"+item+":"+JSON.stringify(competitor[item])+"</h6>"
                    $("#competitorData").append(label)
                }
                if(item != "Runs"){
                var label = "<h6>"+item+":"+competitor[item]+"</h6>"
                $("#competitorData").append(label)
                }
            }
            var ftd = FTD(competitor)
            // console.log("The ftd is", ftd)
            var label = "<h6>" + "FTD: " + ftd + "</h6>"
            $("#competitorData").append(label)

            sectorBest(competitor)
        }
    }
    $("#competitorDisplay").show()
    $("#backToList").on('click', function () {
        clearData($("#competitorData"))
        $(this).hide()
        $("#competitorDisplay").hide()
        $("#compList").show()
    })
})
//

$("#ftd").on('click', function(){
    $("#main").hide()
    $("#runTable").hide()
    $("#setupControls").hide()
    $("#ftdDisplay").show()
    var fastestTimes = []
    var classFastest = classFTD(competitorList)
    competitorList.forEach(function(driver){
        fastestTimes.push(FTD(driver))
    })
    
    fastestTimes.sort()
    console.log("the fastest times are:", fastestTimes)
    console.log("The fastest time is:", fastestTimes[0])
    console.log("The fastest times for each class are:", classFastest)
})

function clearData(element) {
    element.empty()
}

//computes the competitors fastest laptime
function FTD(competitor) {
    var finalTimes = []
    if(competitor.Runs){
        for(i in competitor.Runs){
            finalTimes.push(competitor.Runs[i].final)
        }
    }
    return Math.min.apply(null,finalTimes)
}
//computes the fastest laptime for each class
function classFTD(competitors) {
    var runtimeList = []
    var classList = []
    var sortedClass = []
    var ftdClass = {}
    competitors.forEach(function(competitor){
        runtimeList.push([competitor.Name,competitor.Class,FTD(competitor)])
        classList.push(competitor.Class)
    })
    classList.forEach(function(classes){
        if(sortedClass.includes(classes) == false){
            sortedClass.push(classes)
        }
    })
    for(i in sortedClass){
        var classFinalTimes = []
        for(time in runtimeList){
            if(runtimeList[time][1] == sortedClass[i]){
                classFinalTimes.push(runtimeList[time][2])
            }
        }
        // console.log(classFinalTimes)
        classFinalTimes.sort()
        ftdClass["class"+ sortedClass[i]] = classFinalTimes[0]
    }
    // console.log("ftdClass object:", ftdClass)
    // console.log("RuntimeList", runtimeList)
    return ftdClass
}
//computes the fastest sectors for a chosen competitor
function sectorBest(competitor) {
    var sectorTimes = []
    for(run in competitor.Runs){
        sectorTimes.push(run,JSON.stringify(competitor.Runs[run]))
        // for(time in competitor.Runs[run]){
        //     sectorTimes.push([JSON.stringify(competitor.Runs[run]),competitor.Runs[run][time]])
        // }
    }
    console.log("The sector times for this driver are: " + sectorTimes)
}

//computes the theoratical fastest laptime for a chosen competitor
//based on their fastest sectors times
function tbSector(competitor) {
    
}