// @/plugins/markdownit.ts
import { defineNuxtPlugin } from '#app'
import md from "markdown-it";
import div from 'markdown-it-div';
import attrs from 'markdown-it-attrs';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import fn from 'markdown-it-footnote'; 
import def from 'markdown-it-deflist';
import ins from 'markdown-it-ins';
import container from 'markdown-it-container';


export default defineNuxtPlugin(() => {
  const renderer = new md({ 
    html:         true,
    xhtmlOut:     true,
    breaks:       true,
    linkify:      true,
    typographer:  true,
    quotes: '“”‘’',
  })  
  .use(div)
  .use(attrs)
  .use(sub)
  .use(sup)
  .use(fn) 
  .use(def)
  .use(ins)
  .use(container,'codeblock',{marker:'@'});
  return {
    provide: {
      mdRenderer: renderer,
    },
  };
});