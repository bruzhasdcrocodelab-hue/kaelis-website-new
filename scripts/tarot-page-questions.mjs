const questionsByCategory = {
  answer: {
    en: ['What should I understand about this situation right now?', 'What is the most helpful next step for me?', 'What influence am I overlooking?'],
    ru: ['Что мне важно понять об этой ситуации сейчас?', 'Какой следующий шаг будет для меня самым полезным?', 'Какое влияние я могу не замечать?'],
    ua: ['Що мені важливо зрозуміти про цю ситуацію зараз?', 'Який наступний крок буде для мене найкориснішим?', 'Який вплив я можу не помічати?'],
  },
  decision: {
    en: ['What do I need to see before making this decision?', 'Which option is more aligned with my priorities?', 'What could change if I wait before choosing?'],
    ru: ['Что мне нужно увидеть перед принятием этого решения?', 'Какой вариант больше соответствует моим приоритетам?', 'Что может измениться, если я подожду с выбором?'],
    ua: ['Що мені потрібно побачити перед ухваленням цього рішення?', 'Який варіант більше відповідає моїм пріоритетам?', 'Що може змінитися, якщо я зачекаю з вибором?'],
  },
  dreams: {
    en: ['What might this dream be inviting me to notice?', 'What feeling from this dream deserves my attention?', 'How can I reflect on this recurring dream?'],
    ru: ['На что этот сон может приглашать меня обратить внимание?', 'Какое чувство из этого сна заслуживает моего внимания?', 'Как мне осмыслить этот повторяющийся сон?'],
    ua: ['На що цей сон може запрошувати мене звернути увагу?', 'Яке почуття з цього сну заслуговує на мою увагу?', 'Як мені осмислити цей повторюваний сон?'],
  },
  education: {
    en: ['What should I focus on in my learning right now?', 'What can help me make the most of this opportunity?', 'What strength can support my next academic step?'],
    ru: ['На чём мне стоит сосредоточиться в учёбе сейчас?', 'Что поможет мне использовать эту возможность наилучшим образом?', 'Какая сильная сторона поддержит мой следующий шаг в учёбе?'],
    ua: ['На чому мені варто зосередитися в навчанні зараз?', 'Що допоможе мені якнайкраще використати цю можливість?', 'Яка сильна сторона підтримає мій наступний крок у навчанні?'],
  },
  family: {
    en: ['What needs my care in this family situation?', 'How can I communicate more openly with my family?', 'What can bring more balance to our home?'],
    ru: ['Что нуждается в моей заботе в этой семейной ситуации?', 'Как мне общаться с семьёй более открыто?', 'Что может принести больше гармонии в наш дом?'],
    ua: ['Що потребує моєї турботи в цій сімейній ситуації?', 'Як мені спілкуватися з родиною відкритіше?', 'Що може принести більше гармонії в наш дім?'],
  },
  forecast: {
    en: ['What should I prepare for in the near future?', 'What energy is shaping the next phase of my life?', 'Where should I direct my attention in the coming weeks?'],
    ru: ['К чему мне стоит подготовиться в ближайшем будущем?', 'Какая энергия формирует следующий этап моей жизни?', 'На что мне направить внимание в ближайшие недели?'],
    ua: ['До чого мені варто підготуватися найближчим часом?', 'Яка енергія формує наступний етап мого життя?', 'На що мені спрямувати увагу в найближчі тижні?'],
  },
  health: {
    en: ['What should I keep in mind while supporting my wellbeing?', 'Which habit could best support my balance right now?', 'What can help me be more attentive to my needs?'],
    ru: ['Что мне важно учитывать, поддерживая своё самочувствие?', 'Какая привычка лучше всего поддержит мой баланс сейчас?', 'Что поможет мне внимательнее относиться к своим потребностям?'],
    ua: ['Що мені важливо враховувати, підтримуючи своє самопочуття?', 'Яка звичка найкраще підтримає мій баланс зараз?', 'Що допоможе мені уважніше ставитися до своїх потреб?'],
  },
  hidden: {
    en: ['What important detail am I not seeing yet?', 'What is operating beneath the surface of this situation?', 'What question should I ask to gain more clarity?'],
    ru: ['Какую важную деталь я пока не вижу?', 'Что происходит под поверхностью этой ситуации?', 'Какой вопрос мне задать, чтобы обрести больше ясности?'],
    ua: ['Яку важливу деталь я ще не бачу?', 'Що відбувається під поверхнею цієї ситуації?', 'Яке питання мені поставити, щоб здобути більше ясності?'],
  },
  love: {
    en: ['What does this relationship need from me right now?', 'How can I better understand the connection between us?', 'What would help me act with honesty and care?'],
    ru: ['Что этим отношениям нужно от меня сейчас?', 'Как мне лучше понять связь между нами?', 'Что поможет мне действовать честно и бережно?'],
    ua: ['Що цим стосункам потрібно від мене зараз?', 'Як мені краще зрозуміти зв’язок між нами?', 'Що допоможе мені діяти чесно й дбайливо?'],
  },
  money: {
    en: ['What should I consider before making this financial move?', 'What can help me create more financial stability?', 'Where would a practical, careful approach help most?'],
    ru: ['Что мне стоит учесть перед этим финансовым шагом?', 'Что поможет мне создать больше финансовой устойчивости?', 'Где практичный и осторожный подход будет наиболее полезен?'],
    ua: ['Що мені варто врахувати перед цим фінансовим кроком?', 'Що допоможе мені створити більше фінансової стабільності?', 'Де практичний і обережний підхід буде найкориснішим?'],
  },
  personality: {
    en: ['What part of myself is asking to be understood?', 'What strength can I rely on right now?', 'Which pattern is ready for my attention?'],
    ru: ['Какая часть меня просит, чтобы её поняли?', 'На какую сильную сторону я могу опереться сейчас?', 'Какой паттерн готов привлечь моё внимание?'],
    ua: ['Яка частина мене просить, щоб її зрозуміли?', 'На яку сильну сторону я можу спертися зараз?', 'Який патерн готовий привернути мою увагу?'],
  },
  'soul-path': {
    en: ['What feels most meaningful on my path right now?', 'What inner quality can guide my next step?', 'What am I ready to learn about myself?'],
    ru: ['Что сейчас ощущается самым важным на моём пути?', 'Какое внутреннее качество может направить мой следующий шаг?', 'Что я готов(а) узнать о себе?'],
    ua: ['Що зараз відчувається найважливішим на моєму шляху?', 'Яка внутрішня якість може спрямувати мій наступний крок?', 'Що я готовий або готова дізнатися про себе?'],
  },
  trips: {
    en: ['What should I consider before this journey?', 'What can help this trip go more smoothly?', 'What opportunity might this change of place bring?'],
    ru: ['Что мне стоит учесть перед этой поездкой?', 'Что поможет этой поездке пройти более гладко?', 'Какую возможность может принести эта смена места?'],
    ua: ['Що мені варто врахувати перед цією подорожжю?', 'Що допоможе цій поїздці пройти легше?', 'Яку можливість може принести ця зміна місця?'],
  },
  work: {
    en: ['What should I focus on in my work right now?', 'What can help me take the next career step?', 'How can I use my strengths more effectively at work?'],
    ru: ['На чём мне стоит сосредоточиться в работе сейчас?', 'Что поможет мне сделать следующий карьерный шаг?', 'Как мне эффективнее использовать свои сильные стороны на работе?'],
    ua: ['На чому мені варто зосередитися в роботі зараз?', 'Що допоможе мені зробити наступний кар’єрний крок?', 'Як мені ефективніше використовувати свої сильні сторони в роботі?'],
  },
}

const questionsBySpread = {
  yesno: {
    en: ['Should I take this step now?', 'What should I consider before I decide yes or no?', 'What result is most likely if I move forward?'],
    ru: ['Стоит ли мне сделать этот шаг сейчас?', 'Что мне учесть, прежде чем ответить «да» или «нет»?', 'Какой результат наиболее вероятен, если я продолжу?'],
    ua: ['Чи варто мені зробити цей крок зараз?', 'Що мені врахувати, перш ніж відповісти «так» або «ні»?', 'Який результат найімовірніший, якщо я продовжу?'],
  },
  abuse: {
    en: ['What can help me protect my safety and boundaries?', 'What support would be most helpful to seek right now?', 'What is an important next step for my wellbeing?'],
    ru: ['Что поможет мне защитить свою безопасность и границы?', 'За какой поддержкой мне будет полезнее всего обратиться сейчас?', 'Какой следующий шаг важен для моего благополучия?'],
    ua: ['Що допоможе мені захистити свою безпеку й межі?', 'По яку підтримку мені буде найкорисніше звернутися зараз?', 'Який наступний крок важливий для мого добробуту?'],
  },
  pregnancy: {
    en: ['What can help me feel more prepared for this new chapter?', 'What support would be most helpful to receive now?', 'What should I nurture in myself during this time?'],
    ru: ['Что поможет мне почувствовать себя более подготовленной к этому новому этапу?', 'Какую поддержку мне сейчас полезнее всего получить?', 'Что мне стоит бережно поддержать в себе в это время?'],
    ua: ['Що допоможе мені відчути себе більш підготовленою до цього нового етапу?', 'Яку підтримку мені зараз найкорисніше отримати?', 'Що мені варто дбайливо підтримати в собі в цей час?'],
  },
}

export function exampleQuestionsFor(language, categorySlug, spreadSlug) {
  const questions = (questionsBySpread[spreadSlug] ?? questionsByCategory[categorySlug])?.[language]
  if (!questions) throw new Error(`Missing questions for ${language}/${categorySlug}/${spreadSlug ?? ''}`)
  return questions.map((text, index) => ({_key: `try-${index + 1}`, _type: 'object', text}))
}
