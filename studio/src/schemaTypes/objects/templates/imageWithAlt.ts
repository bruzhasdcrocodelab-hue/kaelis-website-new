import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'imageWithAlt',
  title: 'Image With Alt Text',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
    }),
  ],
})
