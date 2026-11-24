import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tarotPageHero',
  title: 'Hero',
  type: 'object',
  options: {
    collapsible: true,
  },
  fields: [
    defineField({
      name: 'h1',
      title: 'H1',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      description: 'Used in category and spread cards.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Hero description',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'iconPath',
      title: 'Spread icon path',
      description: 'Optional. Use a path from /icons/spreads. Categories do not need an icon.',
      type: 'string',
      validation: (Rule) => Rule.custom((value) => !value || /^\/icons\/spreads\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\.svg$/.test(value) || 'Use a /icons/spreads/*.svg path.'),
    }),
  ],
})
