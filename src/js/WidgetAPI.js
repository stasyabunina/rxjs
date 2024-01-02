import { interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

export default class WidgetAPI {
  constructor(url) {
    this.url = url;
  }

  init() {
    this.response$ = ajax.getJSON(this.url);

    return interval(3000).pipe(
      switchMap(() => this.response$),
      map((value) => value.messages),
    );
  }
}
