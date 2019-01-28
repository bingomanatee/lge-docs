import axios from 'axios';
import marked from 'marked';
import {Store} from '@wonderlandlabs/looking-glass-engine';

export default (file) => {
  const store = new Store({
    state: {intro: ''},
    starter: () => {
      let path = file;
      if (!/!\/md\//.test(file)) {
        path = `/md/${file}`;
      }
      if (!/\.md$/.test(path)) {
        path = `${path}.md`;
      }
      console.log('starter running');
      return axios.get(path).then(result => {
        const markdown = result.data;
        if (!markdown || /<!doctype/.test(markdown)) {
          throw new Error('cannot find ' + path);
        }
        try {
          const html = marked(markdown);
          return {html, markdown, file}
        } catch (error) {
          throw {
            source: 'error parsing markdown for ' + file,
            error,
            file
          };
        }
      });
    }
  });
  store.start();
  return store;
}
