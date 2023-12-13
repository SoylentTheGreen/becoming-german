import { Component, Inject, LOCALE_ID } from '@angular/core';
import { I18n } from '../i18n';
import { Router } from '@angular/router';

@Component({
  selector: 'bgn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../start/start.component.scss'],
})
export class HomeComponent {
  constructor(
    @Inject(LOCALE_ID) public localeId: string,
    private i18n: I18n,
    private router: Router
  ) {}

  async setLanguage(lang: 'en' | 'de') {
    if(lang === this.localeId) {
      return this.router.navigate(['start']);
    }
    await this.i18n.setLocale(lang);
    location.assign('/start');
    return;
  }

}
