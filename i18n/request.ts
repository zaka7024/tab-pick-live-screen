import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';
import {routing} from './routing';
 
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  let cookieName = 'USER_LOCALE';
  if (routing.localeCookie && typeof routing.localeCookie === 'object' && 'name' in routing.localeCookie) {
    cookieName = routing.localeCookie.name as string;
  }
  const locale = cookieStore.get(cookieName)?.value || routing.defaultLocale;
  
  // Ensure the locale is valid
  const validLocale = routing.locales.includes(locale as any) ? locale : routing.defaultLocale;
 
  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});