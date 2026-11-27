import {readFileSync} from 'node:fs'
import {createClient} from '@sanity/client'

function envValue(name) {
  if (process.env[name]) return process.env[name]
  const source = readFileSync('.env', 'utf8')
  const match = source.match(new RegExp(`^${name}=["']?([^\\r\\n"']+)["']?`, 'm'))
  return match?.[1]
}

const token = envValue('SANITY_EDITOR_TOKEN') ?? envValue('SANITY_WRITE_TOKEN') ?? envValue('SANITY_TOKEN')
if (!token) throw new Error('SANITY_EDITOR_TOKEN, SANITY_WRITE_TOKEN, or SANITY_TOKEN is required.')

const client = createClient({
  projectId: 'jcsmje02',
  dataset: 'production',
  token,
  apiVersion: '2026-11-27',
  useCdn: false,
})

const references = await client.fetch('*[_type == "tarotPage" && categorySlug == "education" && !defined(spreadSlug)]{language, example}')
const examples = Object.fromEntries(references.map(({language, example}) => [language, example]))
if (!examples.en || !examples.ru || !examples.ua) throw new Error('Education references for EN, RU, and UA are required.')

const pages = await client.fetch('*[_type == "tarotPage"]{_id, language}')
for (let index = 0; index < pages.length; index += 25) {
  const batch = pages.slice(index, index + 25)
  const transaction = batch.reduce((current, page) => current.patch(page._id, {
    set: {example: examples[page.language]},
  }), client.transaction())
  await transaction.commit()
}

process.stdout.write(`Standardized Example Reading for ${pages.length} Tarot Pages.\n`)
