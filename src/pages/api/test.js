import { GPIO_PINS_ARR, GPIO_PINS_OBJ } from "@/utils/Constants";

export default function handler(req, res) {
  GPIO_PINS_ARR[Number(req.query.pin)].write(true, err => {
    if (err) throw err
  })
  setTimeout(() => {
    GPIO_PINS_ARR[Number(req.query.pin)].write(false)
  }, 1000)



  res.status(200).json({
    success: true,
  });
}