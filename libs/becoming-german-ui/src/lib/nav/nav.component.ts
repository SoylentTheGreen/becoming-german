import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Language } from '@becoming-german/model';
import { I18n } from '../i18n';

const linkText: () => [string, string][] = () => [
  ['request', $localize`:@@nav-request:Empfangen`],
  ['spenden', $localize`:@@nav-spenden:Spenden`],
  ['project', $localize`:@@nav-project:Projekt-Infos`],
  ['about', $localize`:@@nav-about:Impressum`],
];

@Component({
  selector: 'bgn-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  links = linkText();

  constructor(
    @Inject(LOCALE_ID) public localeId: string,
    private i18n: I18n,
  ) {}

  async toggleLang() {
    await this.i18n.setLocale(this.localeId === 'en' ? 'de' : 'en' );
    location.reload();
  }
}
