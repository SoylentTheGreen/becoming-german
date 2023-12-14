import { Component, HostBinding, Input } from '@angular/core';
import {  getOpt, TranslationCategory } from '../../i18n/translation';

@Component({
  selector: 'bgn-item',
  template: ``,
})
export class ItemComponent<T> {
  @Input() item: T | null = null;
  @HostBinding('class.result-item') resultItem = true;

  tr(key: TranslationCategory, value: string) {
    return getOpt(key, value);
  }
}
