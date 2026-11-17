import { DocumentsIcon } from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'policy',
  title: 'Private Policy',
  type: 'document',
  icon: DocumentsIcon,
  preview: {
    select: {
      title: 'title',
      subtitle: 'language',
    },
  },
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'На каком языке отображать проект',
      options: {
        list: [
          { title: 'Русский', value: 'ru' },
          { title: 'English', value: 'en' },
          { title: 'Украинский', value: 'ua' },
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      title: 'Published',
      name: 'published',
      type: 'string',
      description: 'Когда опубчиковано (Last updated: September, 8, 2025)',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Название проекта',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Название ссылки проекта',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      title: 'Content',
      name: 'content',
      description: 'Текст блога',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
          },
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'H5', value: 'h5'},
            {title: 'H6', value: 'h6'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
        },
        {
          type: 'image',
        },
      ],
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
  ],
})