import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, Injectable, LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { Language, languages } from '@becoming-german/model';


@Injectable({
  providedIn: 'root',
})
export class I18n {
  locale = 'de';
  private defaultLocale = languages.map((l) => l.toString()).includes(navigator.language)
    ? navigator.language
    : 'de';

  private fromStorage() {
    return localStorage.getItem('locale')?.toLowerCase() || this.defaultLocale.toLowerCase();
  }

  async setLocale(newLocale: Language | null) {
    this.locale = newLocale || this.fromStorage();
    localStorage.setItem('locale', this.locale.toLowerCase());
    // Use web pack magic string to only include required locale data
    const localeModule = await import(
      /* webpackInclude: /(de|en|fr)\.mjs$/ */
      `../../../../node_modules/@angular/common/locales/${this.locale}.mjs`
    );

    // Set locale for built in pipes, etc.
    registerLocaleData(localeModule.default);

    // Load translation file
    const localeTranslationsModule = await import(`apps/becoming-german/src/assets/${this.locale}.json`);

    // Load translations for the current locale at run-time
    loadTranslations(localeTranslationsModule.translations);
  }
}

// Load locale data at app start-up
function setLocale() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (i18n: I18n) => () => i18n.setLocale(null),
    deps: [I18n],
    multi: true,
  };
}

// Set the runtime locale for the app
function setLocaleId() {
  return {
    provide: LOCALE_ID,
    useFactory: (i18n: I18n) => i18n.locale,
    deps: [I18n],
  };
}

export const I18nModule = {
  setLocale: setLocale,
  setLocaleId: setLocaleId,
};
