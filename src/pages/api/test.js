import { port } from "@/utils/SerialPort";

const nonce = []
export default function handler(req, res) {
  
  port.write('ABCD')
  if(!nonce.find(item => item === req.query.a)) {
    nonce.push(req.query.a)
    return res.status(200).json({ nonce })
  } else return res.status(200).json({ nonce })
 
  console.log(nonce)
  res.status(200).json({ nonce })
}