import {MasterDetailIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const slugRule = (label: string) => (value: string | undefined) => {
  if (!value) return `${label} is required.`
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || 'Use lowercase letters, numbers, and hyphens only.'
}

export default defineType({
  name: 'tarotPage',
  title: 'Tarot pages',
  type: 'document',
  icon: MasterDetailIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: 'Русский', value: 'ru'},
          {title: 'Українська', value: 'ua'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categorySlug',
      title: 'Category slug',
      type: 'string',
      validation: (Rule) => Rule.required().custom(slugRule('Category slug')),
    }),
    defineField({
      name: 'spreadSlug',
      title: 'Spread slug',
      description: 'Leave empty for a category page.',
      type: 'string',
      validation: (Rule) => Rule.custom((value) => !value || slugRule('Spread slug')(value)),
    }),
    defineField({name: 'hero', type: 'tarotPageHero', validation: (Rule) => Rule.required(), group: 'content'}),
    defineField({
      name: 'spreadsSection',
      type: 'tarotPageSpreadsSection',
      group: 'content',
      hidden: ({document}) => Boolean(document?.spreadSlug),
    }),
    defineField({name: 'learning', type: 'tarotLearning', validation: (Rule) => Rule.required(), group: 'content'}),
    defineField({
      name: 'example',
      title: 'Example reading',
      type: 'tarotExample',
      description: 'Optional. The current Knight of Wands example is used when empty.',
      group: 'content',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [{type: 'tarotFaqItem'}],
      validation: (Rule) => Rule.required().min(1),
      group: 'content',
    }),
    defineField({name: 'seo', type: 'tarotPageSeo', validation: (Rule) => Rule.required(), group: 'seo'}),
  ],
  preview: {
    select: {
      title: 'hero.h1',
      language: 'language',
      categorySlug: 'categorySlug',
      spreadSlug: 'spreadSlug',
    },
    prepare({title, language, categorySlug, spreadSlug}) {
      return {
        title: title || `${categorySlug}${spreadSlug ? ` / ${spreadSlug}` : ''}`,
        subtitle: `${language?.toUpperCase() || 'NO LANGUAGE'} · /tarot/${categorySlug}${spreadSlug ? `/${spreadSlug}` : ''}`,
      }
    },
  },
})
