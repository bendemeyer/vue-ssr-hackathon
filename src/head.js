import { createHead } from '@unhead/vue';
import { hashCode } from '@unhead/dom';

function escape(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  // return value.replaceAll('&', '\\u0026').replaceAll('<', '\\u003C');

}

export default function setupHead() {
  const head = createHead();
  console.log(head);
  head.use({
    hooks: {
      'tag:normalise': ({ tag }) => {
        console.log(tag);
        if (tag.children && tag.tag !== 'title') {
          tag.children = escape(tag.children);
          // tag._hash = hashCode(tag.children);
          // tag.props[`data-h-${tag._hash}`] = true;
        }
      },
      // 'ssr:render': ({ tags }) => {
      //   for (const tag of tags) {
      //     if (tag.children) {
      //       tag.children = escape(tag.children);
      //     }
      //   }
      // }
    }
  })
  return head;
}
