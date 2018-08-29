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
    var intervalId = setInterval(function () {
        if (!$("#carList") || $("#carList")[0].length <= 1) {
            $("#listMsg").text("Please create competitor list")
        }
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
            clearInterval(intervalId);
            intervalId = null;
        }
    }, 1000)

    $("#runNumber").text('Run' + runCount)
})
$("#runDone").on('click', function () {
    $("#runNumber").text("Run" + runCount)
})

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

$(".mainScreen").on('click', function () {
    $("#compTable").hide()
    $("#setupControls").hide()
    $("#main").show()
    $("#runTable").show()
})

$("#setupScreen").on('click', function () {
    $("#main").hide()
    $("#runTable").hide()
    $("#setupControls").show()
    $("#compTable").hide()
})
