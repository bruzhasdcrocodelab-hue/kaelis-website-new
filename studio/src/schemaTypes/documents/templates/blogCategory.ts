import { MasterDetailIcon } from "@sanity/icons";
import {defineField, defineType} from 'sanity'

export default defineType({
  name: "blogCategory",
  type: "document",
  title: "Articles Category",
  icon: MasterDetailIcon,
  preview: {
    select: {
      title: "title",
      subtitle: "language"
    }
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
    {
      title: "Title",
      name: "title",
      type: "string",
    },
  ],
});
