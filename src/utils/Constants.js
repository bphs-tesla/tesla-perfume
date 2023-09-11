import { Gpio }  from 'onoff'

export const GPIO_PINS = [ 3, 5, 7, 11, 
                          13, 15, 19, 21,
                          31, 33, 35, 37, ]

export const GPIO_PINS_ARR = GPIO_PINS.map(pin => {
  return new Gpio(pin, 'out')
})
