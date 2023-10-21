import { port } from "@/utils/Constants";

export default function handler(req, res) {
  
  port.write('MGHI')
  res.status(200).json({ name: 'John Doe' })
}