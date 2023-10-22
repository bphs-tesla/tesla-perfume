import { openai } from '@/utils/Utils'
import { port } from '@/utils/SerialPort'

const nonce = []
export default async function handler(req, res) {
  if(!req.query.mbti || !req.query.feeling || !req.query.nonce) return res.status(400)
  if(!nonce.find(item => item === req.query.nonce))
    nonce.push(req.query.nonce)
  else return res.status(406)
  console.log(nonce)
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": `사용자의 입력에 따라 재고가 남아있는 향료에서 탑노트, 미들노트, 베이스노트를 각각 하나씩 사용하여 사용자의 입력과 어울리는 향수를 제작해야 한다.
        학교에서 제작되는 향수이므로 학생의 신분에 맞는 향수를 제작하여야함.
        주어지는 입력은 다음과 같다: 사용자의 MBTI, 사용자의 요즘 기분
        재고가 남아있는 향료는 다음과 같다.
        베이스
          - 파인우드 (id: A)
          - 시더우드 (id: B)
          - 캐시미어우드 (id: C)
          - 바닐라 (id: D)
          
        미들
          - 자스민 (id: E)
          - 라일락 (id: F)
          -  씨센트 (id: G)
          - 로즈마리 (id: H)

        탑
          - 라벤더 (id: I)
          - 비터레몬 (id: J)
          - 뱀부 (id: K)
          - 민트  (id: L)
          
          결과는 json 형태로 제공하는데, 선택된 향료는 'description' 필드에 3개의 노트의 id를 array 형태로 제공하고, 향수의 설명을 30자 이내로 string 형태로 제공한다. 이유를 종합하여 향수의 창의적인 이름을 작명하여 'name' 필드로 제공한다.`
      },
      {
        "role": "user",
        "content": "사용자의 MBTI: ESTP\n사용자의 요즘 기분: 성적 때문에 고민이 많아요."
      },
      {
        "role": "assistant",
        "content": "{ \"result\": [\"J\", \"G\", \"B\"], \"name\": \"고민을, 담다.\", \"description\": \"성적을 향상시킬 수 있도록 학업에 대한 집중력을 높이고 활동적이고 긍정적인 에너지를 줍니다.\" }"
      },
      {
        "role": "user",
        "content": `사용자의 MBTI: ${req.query.mbti}\n사용자의 요즘 기분: ${req.query.feeling}}`
      },
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })
  console.log(response.choices[0].message.content)

  const result  = JSON.parse(response.choices[0].message.content)
  port.write(result.result.join(''))
  return res.status(200).json(result)
}




