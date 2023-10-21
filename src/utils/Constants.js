import { SerialPort, SerialPortMock } from 'serialport'
import OpenAI from 'openai'
import knex from 'knex'

SerialPortMock.binding.createPort(process.env.SERIALPORT)
export const port = new SerialPortMock({ path: process.env.SERIALPORT, baudRate: 9600 })
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const Knex = knex({
  client: 'sqlite3',
  connection: {
    filename: './data.sqlite'
  }
})