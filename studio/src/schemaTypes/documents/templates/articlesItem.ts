import { MasterDetailIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'articlesItem',
  type: 'document',
  title: 'Articles',
  icon: MasterDetailIcon,

  preview: {
    select: {
      title: 'title',
      subtitle: 'language',
      media: 'coverImage.image',
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
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'desc',
      title: 'Description',
      type: 'text',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'url вида: /your-slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Обязательное поле'),
    }),

    defineField({
      name: 'breadcrumbs',
      title: 'Breadcrumbs',
      type: 'array',
      of: [{ type: 'linkBreadcrumb' }],
    }),

    defineField({
      name: 'date',
      title: 'Date',
      description: 'Дата публикации статьи',
      type: 'date',
      options: {
        dateFormat: 'DD-MMM-YYYY',
      },
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'imageWithAlt',
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'array',
      description: 'Выберите одну или несколько категорий из списка',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blogCategory' }],
          options: {
            filter: ({ document }: { document: any }) => {
              const currentLang = document?.i18n_lang
              const selectedIds =
                document?.category
                  ?.filter((item: any) => item?._ref)
                  .map((item: any) => item._ref) || []

              return {
                filter: 'i18n_lang == $lang && !(_id in $selectedIds)',
                params: {
                  lang: currentLang,
                  selectedIds,
                },
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.unique().error('Нельзя выбирать одинаковые категории'),
    }),

    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
          },
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'H5', value: 'h5' },
            { title: 'H6', value: 'h6' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        },
        { type: 'image' },
      ],
    }),
  ],
})