import { SerialPort, SerialPortMock } from 'serialport'

SerialPortMock.binding.createPort(process.env.SERIALPORT)
export const port = new SerialPortMock({ path: process.env.SERIALPORT, baudRate: 9600 })
