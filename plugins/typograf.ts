import { Context } from '@nuxt/types';
import Typograf from 'typograf';

const tp = new Typograf({ locale: ['ru', 'en-US'] });
tp.disableRule('*');
tp.enableRule('common/nbsp/afterShortWord');

export function useTypograf(text: string): string {
  return tp.execute(text);
}
export default ({ app }: Context, inject: any) => {
  inject('useTypograf', (text: string) => tp.execute(text && text.split(' - ').join(' &mdash; ').replace(/[\s]"([^"]*)"/g, "&laquo;$1&raquo;").replace(/[\s]'([^']*)'/g, "&laquo;$1&raquo;")))
}
