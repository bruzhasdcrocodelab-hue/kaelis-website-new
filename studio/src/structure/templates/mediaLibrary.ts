import { StructureBuilder } from 'sanity/structure'
import {ImagesIcon, DocumentsIcon} from '@sanity/icons'

export const mediaLibrary = (S: StructureBuilder,) => {
  return (
    S.listItem()
      .title('Media Library')
        .icon(ImagesIcon)
        .child(
          S.list()
            .title('Media Types')
            .items([
              S.documentTypeListItem('sanity.imageAsset')
                .title('Images')
                .icon(ImagesIcon),
              S.documentTypeListItem('sanity.fileAsset')
                .title('Files')
                .icon(DocumentsIcon),
            ])
        ))
}

export default mediaLibrary