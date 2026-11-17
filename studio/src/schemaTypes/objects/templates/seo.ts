import {defineField, defineType} from 'sanity'

export default defineType({
  preview: {
    select: {
      title: 'seoTitle',
    },
  },

  title: 'Seo',
  name: 'seo',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      title: 'Title template',
      name: 'titleTemplate',
      type: 'boolean',
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'text',
    }),
    defineField({
      title: 'Keywords',
      name: 'keywords',
      type: 'text',
      description: 'Separate keywords with SPACE',
    }),
    defineField({
      title: 'Image',
      name: 'image',
      type: 'imageWithAlt',
    }),
    defineField({
      title: 'ogtype',
      name: 'ogType',
      type: 'string',
    }),
    defineField({
      title: 'Twitter card',
      name: 'twitterCard',
      type: 'string',
      options: {
        list: [
          {title: 'App', value: 'app'},
          {title: 'Summary', value: 'summary'},
          {title: 'Summary large image', value: 'summary_large_image'},
          {title: 'Player', value: 'player'},
        ],
      },
    }),
  ],
})
