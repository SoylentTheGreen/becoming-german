import { Component, HostBinding } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
const linkText: () => [string, string][] = () => [
  ['request', $localize`:@@nav-request:Empfangen`],
  ['spenden', $localize`:@@nav-spenden:Spenden`],
  ['project', $localize`:@@nav-project:Projekt-Infos`],
  ['about', $localize`:@@nav-about:Impressum`],
];
const regex = /\/([^\/]*)\/?/;
const parseUrl = (e: NavigationEnd): string => {
  return pipe(
    e.urlAfterRedirects.match(regex),
    O.fromNullable,
    O.map(res => res[1]),
    O.chain(k =>
      pipe(linkText(), A.findFirst(l => l[0] === k))
    ),
    O.fold(() => '', l => l[1])
  )

};

@Component({
  selector: 'bgn-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  links = linkText();
  @HostBinding('class.open')
  open = false;
  current = '';
  sub = this.router.events
    .pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(parseUrl),
    )
    .subscribe((r) => (this.current = r));

  constructor(private router: Router) {}
}
