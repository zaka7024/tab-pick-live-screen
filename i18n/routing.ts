import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['en', 'ar'],
 
  defaultLocale: 'ar',
  localeCookie: {
    name: 'USER_LOCALE',
    maxAge: 60 * 60 * 24 * 365
  }
});