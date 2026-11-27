import {defineArrayMember, defineField, defineType} from 'sanity'

const cardSlugs = [
  'the-fool', 'the-magician', 'the-high-priestess', 'the-empress', 'the-emperor', 'the-hierophant', 'the-lovers', 'the-chariot', 'strength', 'the-hermit', 'wheel-of-fortune', 'justice', 'the-hanged-man', 'death', 'temperance', 'the-devil', 'the-tower', 'the-star', 'the-moon', 'the-sun', 'judgement', 'the-world',
  'ace-of-wands', 'two-of-wands', 'three-of-wands', 'four-of-wands', 'five-of-wands', 'six-of-wands', 'seven-of-wands', 'eight-of-wands', 'nine-of-wands', 'ten-of-wands', 'page-of-wands', 'knight-of-wands', 'queen-of-wands', 'king-of-wands',
  'ace-of-cups', 'two-of-cups', 'three-of-cups', 'four-of-cups', 'five-of-cups', 'six-of-cups', 'seven-of-cups', 'eight-of-cups', 'nine-of-cups', 'ten-of-cups', 'page-of-cups', 'knight-of-cups', 'queen-of-cups', 'king-of-cups',
  'ace-of-pentacles', 'two-of-pentacles', 'three-of-pentacles', 'four-of-pentacles', 'five-of-pentacles', 'six-of-pentacles', 'seven-of-pentacles', 'eight-of-pentacles', 'nine-of-pentacles', 'ten-of-pentacles', 'page-of-pentacles', 'knight-of-pentacles', 'queen-of-pentacles', 'king-of-pentacles',
  'ace-of-swords', 'two-of-swords', 'three-of-swords', 'four-of-swords', 'five-of-swords', 'six-of-swords', 'seven-of-swords', 'eight-of-swords', 'nine-of-swords', 'ten-of-swords', 'page-of-swords', 'knight-of-swords', 'queen-of-swords', 'king-of-swords',
]

export default defineType({
  name: 'tarotExample',
  title: 'Example card',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: 'cardSlug',
      title: 'Card',
      type: 'string',
      options: {
        list: cardSlugs.map((value) => ({title: value, value})),
      },
    }),
    defineField({name: 'cardTitle', title: 'Card title', type: 'string'}),
    defineField({name: 'heading', title: 'Section heading', type: 'string'}),
    defineField({name: 'cardDescriptionLabel', title: 'Card description label', type: 'string'}),
    defineField({name: 'quickReadLabel', title: 'Quick read label', type: 'string'}),
    defineField({name: 'quickReadText', title: 'Quick read text', type: 'text', rows: 3}),
    defineField({name: 'fullDescriptionLabel', title: 'Full description label', type: 'string'}),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'text', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
          ],
          preview: {
            select: {title: 'title'},
          },
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({name: 'askLabel', title: 'Button label', type: 'string'}),
  ],
})
