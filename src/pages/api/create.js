import { openai } from '@/utils/Utils'
import { port } from '@/utils/SerialPort'
import Knex from '@/utils/Knex'
import { scents } from '@/utils/Constants'

const nonce = []
export default async function handler(req, res) {
  if(!req.query.mbti || !req.query.feeling || !req.query.nonce) return res.status(400)
  if(!nonce.find(item => item === req.query.nonce))
    nonce.push(req.query.nonce)
  else return res.status(406)
  console.log(nonce)
  const countData = await Knex('perfume')
  const count = Object.fromEntries(countData.map(el => [el.id, el.count]))
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": `사용자의 입력에 따라 탑노트, 미들노트, 베이스노트를 각각 하나씩 선택하여 사용자의 입력과 어울리는 향수를 제작해야 한다.
        (단, 학교에서 제작되는 향수이므로 학생의 신분에 맞는 향수를 제작하여야함.)
        주어지는 입력은 다음과 같다: 사용자의 MBTI, 사용자의 오늘 기분 또는 지금 드는 생각
         
        향료의 목록은 아래에  "- 이름 (id: 아이디): 사용횟수" 형식으로 표기한다.
        단, 향료의 재고는 각각 25회이며 25회보다 더 사용될 수는 없다. 25회 이상 사용되었다면 해당 향료는 선택이 불가하다.
        예를 들어, 베이스노트 중 시더우드가 가장 적합한 선택이지만 시더우드의 사용횟수가 25회라면, 해당 향료를 사용하지 않고, 차선책의 다른 베이스노트 향료를 선택하여야 한다.
        
        사용자의 입력에 따라 사용횟수가 적은 향료를 중심으로 골고루 사용할 수 있도록 해야한다.
        예를 들어, 베이스노트 중 파인우드의 사용량이 다른 향료와 비교해서 너무 많이 사용되었다면, 해당 향료를 사용하지 않고, 차선책의 베이스노트 향료를 선택하여야 한다.
        단, 베이스노트 대신 미들노트를 선택하는 등 다른 종류의 노트는 대신해서 사용할 수 없다.

        <향료>
        베이스노트
        ${Object.entries(scents).slice(0, 4).map(el => `- ${el[1]} (id: ${el[0]}): ${count[el[0]] >= 25 ? '사용 불가' : count[el[0]]+'회'}`).join('\n')}
          
        미들노트
        ${Object.entries(scents).slice(5, 8).map(el => `- ${el[1]} (id: ${el[0]}): ${count[el[0]] >= 25 ? '사용 불가' : count[el[0]]+'회'}`).join('\n')}

        탑노트
        ${Object.entries(scents).slice(9, 12).map(el => `- ${el[1]} (id: ${el[0]}): ${count[el[0]] >= 25 ? '사용 불가' : count[el[0]]+'회'}`).join('\n')}
                  
        결과는 json 형태로 제공하는데, 선택된 향료는 'result' 필드에 3개의 노트의 id를 베이스노트, 미들노트, 탑노트 순서로 하나씩 선택하여 array 형태로 제공하고, 'description' 필드에 향수의 설명을 30자 이내로 string 형태로 제공한다. 이유를 종합하여 향수의 창의적인 이름을 작명하여 'name' 필드로 제공한다.`
              },
      {
        "role": "user",
        "content": "사용자의 MBTI: ESTP\n사용자의 오늘 기분 또는 지금 드는 생각: 성적 때문에 고민이 많아요."
      },
      {
        "role": "assistant",
        "content": "{ \"result\": [\"B\", \"G\", \"J\"], \"name\": \"고민을, 담다.\", \"description\": \"성적을 향상시킬 수 있도록 학업에 대한 집중력을 높이고 활동적이고 긍정적인 에너지를 줍니다.\" }"
      },
      {
        "role": "user",
        "content": `사용자의 MBTI: ${req.query.mbti}\n사용자의 오늘 기분 또는 지금 드는 생각: ${req.query.feeling}}`
      },
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })
  console.log(response)

  const result  = JSON.parse(response.choices[0].message.content)
  for (const item of result.result) {
    await Knex('perfume').where('id', item).increment('count', 1)
  }
  port.write(result.result.join('')+'M')
  return res.status(200).json(result)
}




