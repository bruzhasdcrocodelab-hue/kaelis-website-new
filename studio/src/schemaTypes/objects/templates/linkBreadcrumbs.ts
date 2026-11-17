import { LinkIcon } from "@sanity/icons"
import { defineType, defineField } from "sanity"

export default defineType({
  name: "linkBreadcrumb",
  title: "Ссылка хлебных крошек",
  type: "object",
  icon: LinkIcon,
  preview: {
    select: {
      label: "label",
      url: "url",
    },
    prepare(selection: { label?: string; url?: string }) {
      const { label, url } = selection
      return {
        title: label || "Ссылка без названия",
        subtitle: url ? `URL: ${url}` : "URL не указан",
      }
    },
  },
  fields: [
    defineField({
      name: "label",
      title: "Текст ссылки",
      type: "string",
      description: "Текст, который будет отображаться в хлебных крошках",
      validation: (Rule) => Rule.required().error("Обязательное поле"),
    }),
    defineField({
      name: "url",
      title: "URL адрес",
      type: "string",
      description: "Путь или полный URL (например: /catalog)",
      validation: (Rule) => Rule.required().error("Обязательное поле"),
    }),
  ],
})