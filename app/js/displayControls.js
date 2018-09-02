//initiates the start screen of the application
//the user must import a CSV competitor list on this screen
$(document).ready(function () {
    $("#stageDriver").hide()
    $("#runDone").hide()
    $("#carList").hide()
    $("#runtimes").hide()
    $(".gateTrigger").hide()
    $("#importList").show()
    $("#runNumber").hide()
    $("#compTable").hide()
    $("#setupControls").hide()
    $("#setupScreen").hide()
    $("#competitorLookup").hide()
    $("#coneAdder").hide()
    $("#coneSubtract").hide()
    $("#penaltyMsg").hide()
    var intervalId = setInterval(function () {
        if (!$("#carList") || $("#carList")[0].length <= 1) {
            $("#listMsg").text("Please create competitor list")
        }
        //Once the competitor list is populated, the main application screen is activated
        else {
            $("#listMsg").hide()
            $("#stageDriver").show()
            $("#runDone").show()
            $(".gateTrigger").show()
            $("#importList").hide()
            $("#carList").show()
            $("#runtimes").show()
            $("#runNumber").show()
            $("#setupScreen").show()
            $("#competitorLookup").show()
            $("#coneAdder").show()
            $("#coneSubtract").show()
            $("#penaltyMsg").show()
            clearInterval(intervalId);
            intervalId = null;
        }
    }, 1000)
    //The run count displayed above the live run table
    $("#runNumber").text('Run' + runCount)
})

//increments the displayed run #
$("#runDone").on('click', function () {
    $("#runNumber").text("Run" + runCount)
})

//shows the main screen for runtimer
$(".mainScreen").on('click', function () {
    $("#compTable").hide()
    $("#setupControls").hide()
    $("#main").show()
    $("#runTable").show()
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
    var tableCheck = $("#compList tr").length
    if (tableCheck == 1) {
        compTable(competitorList)
    }
})

//Modal for showing competitor information
//activated by competitor lookup table selection
$("#compList").on('click', 'tr', function () {
    // console.log("clicked on competitor")
    // console.log($(this).children('td').first().text())
    var compCar = $(this).find("td:eq(1)").text()
    for (i in competitorList) {
        if (compCar === competitorList[i].Car) {
            $("#modalTitle").text(JSON.stringify(competitorList[i].Name))
            $("#compClass").text(JSON.stringify(competitorList[i].Class))
            if (competitorList[i].runs) {
                $("#compRuns").text(JSON.stringify(competitorList[i].runs))
            }
            if (!competitorList[i].runs) {
                $("#compRuns").text("No runs completed")
            }
        }
    }
    $("#myModal").modal('show')
})

//Modal for adding cone penalties during runs
//adds or subtracts cones based on input +/-
$("#runtimes").on('click', 'tr', function () {
    var coneCount = 0
    var compCar = $(this).find("td:eq(0)").text()
    console.log("The selected run is for car#", compCar)
    $("#modalTitle").text("Penalties")
    for (i in competitorList) {
        if (compCar === competitorList[i].Car) {
            var competitor = competitorList[i]
            $("#coneAdder").on('click', function () {
                coneCount++
                console.log("Runtime before penalties", competitor.times[competitor.times.length - 1])
                competitor.times[competitor.times.length - 1] += 2.000
                console.log("Runtime after penalties", competitor.times[competitor.times.length - 1])
                $("#coneCounter").text(coneCount)
            })
            $("#coneSubtract").on('click', function () {
                coneCount--
                competitor.times[competitor.times.length - 1] -= 2.000
                $("#coneCounter").text(coneCount)
            })
        }
    }
    $("#penaltyModal").modal('show')
})

