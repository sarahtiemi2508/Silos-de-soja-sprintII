const { SerialPort } = require('serialport')
SerialPort.list().then(ports => {
  ports.forEach(port => console.log(port.path, port.pnpId, port.manufacturer))
})

//Testar a porta e qual o id