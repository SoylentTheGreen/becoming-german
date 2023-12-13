import { Component, HostBinding } from '@angular/core';

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
  @HostBinding('class.open')
  open = false;
}
