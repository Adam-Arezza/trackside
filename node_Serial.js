const serialport = require("serialport");
const port = new serialport("/dev/ttyACM0", {
    baudRate:9600
})

const parsers = serialport.parsers
const parser = new parsers.Readline({
    delimeter: "\n"
})

port.on('open', function(){
  console.log('Serial Port Opend');
});

port.on('data', function(data){
    console.log("Data: ",data[0])
    if(data[0] == 48){
        startStamp = true
    }
});

