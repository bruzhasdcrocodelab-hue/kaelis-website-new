import {readFileSync} from 'node:fs'
import {createClient} from '@sanity/client'
import {exampleQuestionsFor} from './tarot-page-questions.mjs'

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

const pages = await client.fetch('*[_type == "tarotPage" && !defined(exampleQuestions)]{_id, language, categorySlug, spreadSlug}')
for (let index = 0; index < pages.length; index += 25) {
  const batch = pages.slice(index, index + 25)
  const transaction = batch.reduce((current, page) => current.patch(page._id, {
    set: {exampleQuestions: exampleQuestionsFor(page.language, page.categorySlug, page.spreadSlug)},
  }), client.transaction())
  await transaction.commit()
}

process.stdout.write(`Updated ${pages.length} Tarot Pages.\n`)
