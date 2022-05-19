import S from "@sanity/desk-tool/structure-builder";
import {
  HiOutlineCog,
  HiOutlineClipboardList,
  HiOutlineFilter,
  HiOutlineNewspaper
} from "react-icons/hi";

// import PagePreview from "./previews/PagePreview";
// import BlogPreview from "./previews/BlogPreview";

// import DocumentsPane from "sanity-plugin-documents-pane";

const hiddenDocTypes = listItem =>
  !["siteconfig"].includes(listItem.getId());

export default () =>
  S.list()
    .title("Content Manager")
    .items([
      S.listItem()
        .title("Site Config")
        .icon(HiOutlineCog)
        .child(
          S.editor().schemaType("siteconfig").documentId("siteconfig")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes)
    ]);

// export const getDefaultDocumentNode = props => {
//   /**
//    * Here you can define fallback views for document types without
//    * a structure definition for the document node. If you want different
//    * fallbacks for different types, or document values (e.g. if there is a slug present)
//    * you can set up that logic in here too.
//    * https://www.sanity.io/docs/structure-builder-reference#getdefaultdocumentnode-97e44ce262c9
//    */
//   const { schemaType } = props;
//   if (schemaType === "page") {
//     return S.document().views([
//       S.view.form(),
//       //S.view.component(ProductsOverviewPreview).title("Products Overview"),
//       S.view.component(PagePreview).title("Live Preview")
//     ]);
//   }
//   if (schemaType === "post") {
//     return S.document().views([
//       S.view.form(),
//       //S.view.component(ProductsOverviewPreview).title("Products Overview"),
//       S.view.component(BlogPreview).title("Live Preview")
//     ]);
//   }

//   if (schemaType === "author") {
//     return S.document().views([
//       S.view.form(),
//       //S.view.component(ProductsOverviewPreview).title("Products Overview"),
//       S.view
//         .component(DocumentsPane)
//         .options({
//           query: `*[_type == "post" && references($id)]`,
//           params: { id: `_id` },
//           useDraft: false
//         })
//         .title("Posts by Author")
//     ]);
//   }

//   if (schemaType === "category") {
//     return S.document().views([
//       S.view.form(),
//       //S.view.component(ProductsOverviewPreview).title("Products Overview"),
//       S.view
//         .component(DocumentsPane)
//         .options({
//           query: `*[_type == "post" && references($id)]`,
//           params: { id: `_id` },
//           useDraft: false
//         })
//         .title("Posts by Category")
//     ]);
//   }

//   return S.document().views([S.view.form()]);
// };
