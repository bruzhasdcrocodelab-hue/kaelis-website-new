import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tarotPageSeo',
  title: 'SEO',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({name: 'title', title: 'Meta title', type: 'string', validation: (Rule) => Rule.required().max(60).warning('Keep the title to 60 characters or fewer.')}),
    defineField({name: 'description', title: 'Meta description', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(160).warning('Keep the description to 160 characters or fewer.')}),
    defineField({name: 'keywords', type: 'text', rows: 2}),
    defineField({name: 'image', title: 'Open Graph image', type: 'imageWithAlt'}),
    defineField({
      name: 'ogType',
      title: 'Open Graph type',
      type: 'string',
      options: {list: [{title: 'Website', value: 'website'}]},
      initialValue: 'website',
    }),
    defineField({
      name: 'twitterCard',
      title: 'Twitter card',
      type: 'string',
      options: {list: [
        {title: 'Summary large image', value: 'summary_large_image'},
        {title: 'Summary', value: 'summary'},
      ]},
    }),
    defineField({name: 'noIndex', title: 'Exclude from search engines', type: 'boolean', initialValue: false}),
  ],
})
