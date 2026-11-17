// structure.ts
import { StructureResolver } from 'sanity/structure'
import { langList } from './templates/langList'
import mediaLibrary from './templates/mediaLibrary'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([

      langList(S, 'Articles Category', 'blogCategory'),
      langList(S, 'Articles', 'articlesItem'),

      S.divider(),

      langList(S, 'Private Policy', 'policy'),

      S.divider(),

      mediaLibrary(S),

      // Остальные документы (если есть)
      ...S.documentTypeListItems().filter((item) => 
        item.getId() !== 'articlesItem' 
        && item.getId() !== 'blogCategory'
        && item.getId() !== 'policy'
        && item.getId() !== 'sanity.imageAsset' // Исключаем медиа-ассеты из общего списка
        && item.getId() !== 'sanity.fileAsset'   // Исключаем файловые ассеты из общего списка
      ),
    ])