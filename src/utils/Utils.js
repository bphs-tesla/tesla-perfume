import OpenAI from 'openai'

export function fromCharCode(arr) {
  return String.fromCharCode(...arr)
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
