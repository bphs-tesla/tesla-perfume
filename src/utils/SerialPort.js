import { SerialPort, SerialPortMock } from 'serialport'

SerialPortMock.binding.createPort(process.env.SERIALPORT)

export const port = process.env.NODE_ENV === 'production' ?  new SerialPort({ path: process.env.SERIALPORT, baudRate: 9600 }) : new SerialPortMock({ path: process.env.SERIALPORT, baudRate: 9600 })


