import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { I18n } from './i18n';

@Injectable({
              providedIn: 'root',
            })
export class LanguageService {
  constructor(
    @Inject(LOCALE_ID) private localeId: string,
    private i18n: I18n,
  ) {}
}
