import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tarotPageSpreadsSection',
  title: 'Spreads section',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      description: 'Optional. A localized title is generated from the category name when empty.',
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Optional. A localized default is used when empty.',
    }),
  ],
})
