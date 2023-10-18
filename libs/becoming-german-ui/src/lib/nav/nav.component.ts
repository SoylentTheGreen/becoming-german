import { Component } from '@angular/core';
const linkText: [string, string][] = [
  ['project', $localize`:@@nav-project:Das Projekt`],
  ['news', $localize`:@@nav-news:Aktuelles`],
  ['contact', $localize`:@@nav-contact:Kontakt`],
  ['about', $localize`:@@nav-about:Impressum`],
];



@Component({
  selector: 'bgn-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  links = linkText;
  constructor() {
    console.log('the nav component is being initialized')
  }
}
