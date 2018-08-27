$(document).ready(function () {
    $("#stageDriver").prop('disabled', true)
    $("#runDone").prop('disabled', true)
    $("#carList").hide()
    $("#runtimes").hide()
    $(".gateTrigger").hide()
    $("#importList").show()
    $("#runNumber").hide()
    setInterval(function () {
        if (!$("#carList") || $("#carList")[0].length <= 1) {
            $("#listMsg").text("Please initiate competitor list")
        }
        else {
            $("#listMsg").hide()
            $("#stageDriver").prop('disabled', false)
            $("#runDone").prop('disabled', false)
            $(".gateTrigger").show()
            $("#importList").hide()
            $("#carList").show()
            $("#runtimes").show()
            $("#runNumber").show()
            clearInterval()
        }
    }, 1000)
    
    $("#runNumber").text('Run' + runCount)
})
$("#runDone").on('click', function() {
        $("#runNumber").text("Run" + runCount)
})