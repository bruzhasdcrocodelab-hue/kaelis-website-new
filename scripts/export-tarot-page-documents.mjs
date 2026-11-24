import {readFileSync} from 'node:fs'

const localeMap = {en: 'en', ru: 'ru', uk: 'ua'}
const locale = process.argv[2]
const categoryFilter = process.argv[3]

if (!Object.hasOwn(localeMap, locale)) throw new Error('Expected locale: en, ru, or uk.')

function envValue(name) {
  if (process.env[name]) return process.env[name]
  const source = readFileSync('.env', 'utf8')
  const match = source.match(new RegExp(`^${name}=["']?([^\\r\\n"']+)["']?`, 'm'))
  return match?.[1]
}

const origin = envValue('NEXT_PUBLIC_BACKEND_ORIGIN')
if (!origin) throw new Error('NEXT_PUBLIC_BACKEND_ORIGIN is required to export the current catalog content.')

const content = JSON.parse(readFileSync('src/lib/seo/content.json', 'utf8'))

const themes = {
  love: {focus: {en: 'your relationships', ru: 'отношения', uk: 'стосунки'}, prompt: {en: 'getting in touch with an ex', ru: 'вашем общении с бывшим партнёром', uk: 'спілкуванні з колишнім партнером'}},
  dreams: {focus: {en: 'a dream that stays with you', ru: 'сне, который не отпускает', uk: 'сні, який не відпускає'}, prompt: {en: 'a recurring dream', ru: 'повторяющемся сне', uk: 'повторюваному сні'}},
  personality: {focus: {en: 'your strengths and patterns', ru: 'сильных сторонах и привычных паттернах', uk: 'сильних сторонах і звичних патернах'}, prompt: {en: 'a quality you want to understand better', ru: 'качестве, которое хотите лучше понять', uk: 'рисі, яку хочете краще зрозуміти'}},
  education: {focus: {en: 'your learning path', ru: 'обучении', uk: 'навчанні'}, prompt: {en: 'the next step in your studies', ru: 'следующем шаге в учёбе', uk: 'наступному кроці в навчанні'}},
  trips: {focus: {en: 'a journey ahead', ru: 'предстоящей поездке', uk: 'майбутній подорожі'}, prompt: {en: 'choosing when or where to travel', ru: 'выборе времени или места для поездки', uk: 'виборі часу або місця для подорожі'}},
  health: {focus: {en: 'your wellbeing', ru: 'самочувствии', uk: 'самопочутті'}, prompt: {en: 'the habits that support your wellbeing', ru: 'привычках, поддерживающих самочувствие', uk: 'звичках, що підтримують самопочуття'}},
  decision: {focus: {en: 'a decision in front of you', ru: 'предстоящем решении', uk: 'рішенні, яке стоїть перед вами'}, prompt: {en: 'choosing between two options', ru: 'выборе между двумя вариантами', uk: 'виборі між двома варіантами'}},
  hidden: {focus: {en: 'what is not yet clear', ru: 'том, что пока неясно', uk: 'тому, що поки неясно'}, prompt: {en: 'an influence you may be overlooking', ru: 'факторе, который можете упускать', uk: 'впливі, який можете не помічати'}},
  forecast: {focus: {en: 'what may be ahead', ru: 'том, что может быть впереди', uk: 'тому, що може бути попереду'}, prompt: {en: 'preparing for the next chapter', ru: 'подготовке к следующему этапу', uk: 'підготовці до наступного етапу'}},
  'soul-path': {focus: {en: 'your inner direction', ru: 'внутреннем направлении', uk: 'внутрішньому напрямку'}, prompt: {en: 'what feels meaningful right now', ru: 'том, что сейчас действительно важно', uk: 'тому, що зараз по-справжньому важливо'}},
  work: {focus: {en: 'your work and career', ru: 'работе и карьере', uk: 'роботі та кар’єрі'}, prompt: {en: 'the next move at work', ru: 'следующем шаге в работе', uk: 'наступному кроці в роботі'}},
  family: {focus: {en: 'your family dynamics', ru: 'семейных отношениях', uk: 'сімейних стосунках'}, prompt: {en: 'a conversation with someone close', ru: 'разговоре с близким человеком', uk: 'розмові з близькою людиною'}},
  money: {focus: {en: 'your finances', ru: 'финансах', uk: 'фінансах'}, prompt: {en: 'a financial choice', ru: 'финансовом выборе', uk: 'фінансовому виборі'}},
  answer: {focus: {en: 'the question on your mind', ru: 'волнующем вас вопросе', uk: 'питанні, яке вас хвилює'}, prompt: {en: 'the answer you need right now', ru: 'ответе, который вам сейчас нужен', uk: 'відповіді, яка вам зараз потрібна'}},
}

const defaultTheme = {focus: {en: 'your situation', ru: 'вашей ситуации', uk: 'вашій ситуації'}, prompt: {en: 'what matters to you right now', ru: 'том, что сейчас для вас важно', uk: 'тому, що зараз для вас важливо'}}

const example = {
  en: {heading: 'Example Reading', askLabel: 'Ask your own question', cardDescriptionLabel: 'Card Description', quickReadLabel: 'Quick read', quickReadText: 'Victory, recognition, triumph; reversed — self-doubt, hollow win.', fullDescriptionLabel: 'Full Description', details: [{title: 'Impact', text: 'This project is likely to affect you by increasing confidence, visibility, and a sense of professional achievement if it is managed well.'}, {title: 'Recognition', text: 'Recognition is possible through a clear concept and consistent delivery, but it should be treated as a later effect rather than the basis for the launch.'}, {title: 'Focus', text: 'Keep the focus on repeatable operations and customer value so that recognition rests on a solid business foundation.'}]},
  ru: {heading: 'Пример расклада', askLabel: 'Задать свой вопрос', cardDescriptionLabel: 'Описание карты', quickReadLabel: 'Кратко', quickReadText: 'Победа, признание, триумф; перевёрнутая — неуверенность в себе, пустая победа.', fullDescriptionLabel: 'Полное описание', details: [{title: 'Влияние', text: 'Этот проект может укрепить уверенность, повысить заметность и дать ощущение профессионального достижения, если им хорошо управлять.'}, {title: 'Признание', text: 'Признание возможно благодаря ясной концепции и последовательной работе, но оно должно быть следствием, а не основой запуска.'}, {title: 'Фокус', text: 'Сосредоточьтесь на повторяемых процессах и ценности для клиентов, чтобы признание опиралось на прочную основу.'}]},
  uk: {heading: 'Приклад розкладу', askLabel: 'Поставити власне питання', cardDescriptionLabel: 'Опис карти', quickReadLabel: 'Коротко', quickReadText: 'Перемога, визнання, тріумф; перевернута — невпевненість у собі, порожня перемога.', fullDescriptionLabel: 'Повний опис', details: [{title: 'Вплив', text: 'Цей проєкт може посилити впевненість, помітність і відчуття професійного досягнення, якщо ним добре керувати.'}, {title: 'Визнання', text: 'Визнання можливе завдяки чіткій концепції та послідовному втіленню, але воно має бути наслідком, а не основою запуску.'}, {title: 'Фокус', text: 'Зосередьтеся на повторюваних процесах і цінності для клієнтів, щоб визнання спиралося на міцну основу.'}]},
}

const intro = {
  en: 'KaelisAI starts with your question and the spread you choose. It considers which cards were drawn, whether each is upright or reversed, and what each card means in its position in the spread. The AI brings the cards together into one interpretation. The reading style you choose shapes how that interpretation is explained.',
  ru: 'KaelisAI начинает с вашего вопроса и выбранного расклада. Он учитывает, какие карты были вытянуты, прямые они или перевёрнутые, а также значение каждой карты в её позиции в раскладе. ИИ объединяет карты в единую интерпретацию. Выбранный стиль расклада определяет, как эта интерпретация будет объяснена.',
  uk: 'KaelisAI починає з вашого питання та обраного розкладу. Він враховує, які карти були витягнуті, чи вони прямі або перевернуті, а також значення кожної карти в її позиції в розкладі. ШІ поєднує карти в одну інтерпретацію. Обраний стиль розкладу визначає, як ця інтерпретація буде пояснена.',
}

const heroFallback = {
  en: 'Ask your own question about dating or relationships, or choose a spread for the situation you’re in.',
  ru: 'Задайте свой вопрос об отношениях или выберите расклад для вашей ситуации.',
  uk: 'Поставте своє питання про стосунки або виберіть розклад для своєї ситуації.',
}

const defaultFaq = (language, topic) => language === 'ru'
  ? [{question: `Что можно узнать из расклада «${topic}»?`, answer: 'Этот расклад помогает посмотреть на вопрос с разных сторон и заметить детали, которые могут быть важны для вашего следующего шага.'}, {question: 'Как сформулировать вопрос для расклада?', answer: 'Сформулируйте открытый и конкретный вопрос о ситуации, чувствах или возможных действиях. Так интерпретация будет полезнее для размышлений.'}, {question: 'Как использовать результат расклада?', answer: 'Сопоставьте значения карт со своей ситуацией и используйте их как повод для размышлений. Окончательное решение всегда остаётся за вами.'}]
  : language === 'uk'
    ? [{question: `Що можна дізнатися з розкладу «${topic}»?`, answer: 'Цей розклад допомагає подивитися на запитання з різних боків і помітити деталі, важливі для вашого наступного кроку.'}, {question: 'Як сформулювати запитання для розкладу?', answer: 'Сформулюйте відкрите й конкретне запитання про ситуацію, почуття або можливі дії. Так інтерпретація буде корисною для роздумів.'}, {question: 'Як використати результат розкладу?', answer: 'Зіставте значення карт зі своєю ситуацією та використайте їх як привід для роздумів. Остаточне рішення завжди залишається за вами.'}]
    : [{question: `What can the “${topic}” reading help me explore?`, answer: 'This reading can help you consider your question from different angles and notice details that may matter for your next step.'}, {question: 'How should I phrase my question?', answer: 'Use an open, specific question about your situation, feelings, or possible actions. This makes the interpretation more useful for reflection.'}, {question: 'How should I use the reading?', answer: 'Connect the card meanings with your situation and use them as a prompt for reflection. The final decision is always yours.'}]

function block(children) {
  return {_type: 'block', _key: crypto.randomUUID(), style: 'normal', markDefs: [], children: children.map((text) => ({_type: 'span', _key: crypto.randomUUID(), text}))}
}

function linkedBlock(parts) {
  const markDefs = []
  const children = []
  for (const part of parts) {
    if (typeof part === 'string') {
      children.push({_type: 'span', _key: crypto.randomUUID(), text: part})
      continue
    }
    const key = crypto.randomUUID()
    markDefs.push({_key: key, _type: 'link', href: part.href, openInNewTab: false})
    children.push({_type: 'span', _key: crypto.randomUUID(), text: part.text, marks: [key]})
  }
  return {_type: 'block', _key: crypto.randomUUID(), style: 'normal', markDefs, children}
}

function thirdParagraph(language, categorySlug, prompt) {
  if (language === 'en' && categorySlug === 'love') return 'Give the reading something specific to work with. If you’re thinking about getting in touch with an ex, try asking, “What should I consider before I reach out?” Read the interpretation with that decision in mind. It might help you work out what you’d want to say and whether you’re ready to hear their answer.'
  if (language === 'en') return `Give the reading something specific to work with. If you’re thinking about ${prompt}, try asking, “What should I consider before I act?” Read the interpretation with that decision in mind. It might help you work out what you want to do next.`
  if (language === 'ru') return `Дайте раскладу конкретную тему для работы. Если думаете о ${prompt}, попробуйте спросить: «Что мне стоит учесть, прежде чем действовать?» Читайте интерпретацию с учётом этого решения — она может помочь понять следующий шаг.`
  return `Дайте розкладу конкретну тему для роботи. Якщо думаєте про ${prompt}, спробуйте запитати: «Що мені варто врахувати, перш ніж діяти?» Читайте інтерпретацію з огляду на це рішення — вона може допомогти зрозуміти наступний крок.`
}

function learningContent(language, category, spreads) {
  const theme = themes[category.slug] ?? defaultTheme
  const preferred = category.slug === 'love' ? ['between-us', 'fate', 'breakup'] : []
  const links = (preferred.length ? preferred.map((slug) => spreads.find((spread) => spread.slug === slug)).filter(Boolean) : spreads.slice(0, 3))
  const href = (spread) => `/tarot/${category.slug}/${spread.slug}`
  const names = links.map((spread) => ({text: language === 'en' && spread.slug === 'between-us' ? 'Between Us' : spread.name, href: href(spread)}))
  let second
  if (category.slug === 'love' && names.length === 3) {
    const copy = language === 'en'
      ? ['If you want to choose a spread, try ', ' for a question about your current relationship, ', ' if you’re single and thinking about finding a partner, or ', ' if you’re deciding whether to stay or leave. If you’re unsure which one fits, start with your own question in the form above.']
      : language === 'ru'
        ? ['Если хотите выбрать расклад, попробуйте ', ' для вопроса о текущих отношениях, ', ' если вы одиноки и думаете о поиске партнёра, или ', ' если решаете, остаться или уйти. Если не уверены, какой вариант подходит, начните с собственного вопроса в форме выше.']
        : ['Якщо хочете обрати розклад, спробуйте ', ' для питання про ваші поточні стосунки, ', ' якщо ви самотні й думаєте про пошук партнера, або ', ' якщо вирішуєте, залишитися чи піти. Якщо не впевнені, який варіант підходить, почніть із власного питання у формі вище.']
    second = linkedBlock([copy[0], names[0], copy[1], names[1], copy[2], names[2], copy[3]])
  } else {
    const lead = language === 'en' ? `If you want to choose a spread for ${theme.focus[language]}, try ` : language === 'ru' ? `Если хотите выбрать расклад для темы «${theme.focus[language]}», попробуйте ` : `Якщо хочете обрати розклад для теми «${theme.focus[language]}», спробуйте `
    const end = language === 'en' ? ' to explore it. If you’re unsure which one fits, start with your own question in the form above.' : language === 'ru' ? ', чтобы рассмотреть ситуацию точнее. Если не уверены, какой вариант подходит, начните с собственного вопроса в форме выше.' : ', щоб точніше розглянути ситуацію. Якщо не впевнені, який варіант підходить, почніть із власного питання у формі вище.'
    const parts = [lead]
    names.forEach((name, index) => {
      parts.push(name)
      if (index === names.length - 1) parts.push(end)
      else if (index === names.length - 2) parts.push(language === 'ru' ? ' или ' : language === 'uk' ? ' або ' : ', or ')
      else parts.push(', ')
    })
    if (!names.length) parts.push(language === 'en' ? 'a spread that fits your question.' : language === 'ru' ? 'подходящий расклад.' : 'відповідний розклад.')
    second = linkedBlock(parts)
  }
  return [block([intro[language]]), second, block([thirdParagraph(language, category.slug, theme.prompt[language])])]
}

async function api(path, token, method = 'GET') {
  const response = await fetch(new URL(path, origin), {method, headers: {Accept: 'application/json', 'Accept-Language': locale, 'X-Platform': 'site', ...(token ? {Authorization: `Bearer ${token}`} : {})}})
  if (!response.ok) throw new Error(`Catalog request failed (${response.status})`)
  return response.json()
}

async function all(path, token) {
  const result = []
  for (let page = 1; ; page += 1) {
    const separator = path.includes('?') ? '&' : '?'
    const body = await api(`${path}${separator}page=${page}&per_page=50`, token)
    result.push(...body.data)
    if (page >= body.meta.last_page) return result
  }
}

const auth = await api('/api/user/anonymous', undefined, 'POST')
const token = `${auth.data.token_type} ${auth.data.access_token}`
const categories = await all('/api/tarot/category', token)
const selectedCategories = categoryFilter ? categories.filter((category) => category.slug === categoryFilter) : categories
if (categoryFilter && selectedCategories.length !== 1) throw new Error(`Category ${categoryFilter} is not present in the current catalog.`)
const docs = []
for (const category of selectedCategories) {
  const spreads = await all(`/api/tarot?category_id=${encodeURIComponent(category.id)}`, token)
  for (const [spreadSlug, current] of [[undefined, category], ...spreads.map((spread) => [spread.slug, spread])]) {
    const path = `/tarot/${category.slug}${spreadSlug ? `/${spreadSlug}` : ''}`
    const seo = content[locale][path]
    if (!seo) continue
    const description = seo.intro || current.site_description || current.description || heroFallback[locale]
    docs.push({
      type: 'tarotPage',
      content: {
        language: localeMap[locale],
        categorySlug: category.slug,
        ...(spreadSlug ? {spreadSlug} : {}),
        hero: {
          h1: seo.h1 || current.name,
          shortDescription: spreadSlug ? description : current.site_description || description,
          description,
          ...(spreadSlug ? {iconPath: `/icons/spreads/${category.slug}/${spreadSlug}.svg`} : {}),
        },
        learning: {
          content: learningContent(locale, category, spreads),
        },
        example: {
          cardSlug: 'knight-of-wands',
          ...example[locale],
          details: example[locale].details.map((detail) => ({_key: crypto.randomUUID(), ...detail})),
        },
        faq: (path === '/tarot/decision/yesno'
          ? locale === 'en'
            ? [{question: 'What kind of question works for this reading?', answer: 'Ask one question you could answer with yes or no. For example, “Should I bring up the change in my schedule this week?”'}]
            : locale === 'ru'
              ? [{question: 'Как задать вопрос для расклада «Да или нет»?', answer: 'Сформулируйте один вопрос, на который можно ответить «да» или «нет». Например, «Стоит ли обсудить изменение графика на этой неделе?»'}]
              : [{question: 'Як поставити запитання для розкладу «Так чи ні»?', answer: 'Сформулюйте одне запитання, на яке можна відповісти «так» або «ні». Наприклад, «Чи варто обговорити зміни графіка цього тижня?»'}]
          : defaultFaq(locale, seo.h1 || current.name)).map((item) => ({_key: crypto.randomUUID(), ...item})),
        seo: {
          title: seo.title,
          description: seo.description,
          ogType: 'website',
          twitterCard: 'summary_large_image',
        },
      },
    })
  }
}

process.stdout.write(JSON.stringify(docs))
