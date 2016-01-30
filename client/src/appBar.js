import {Observable} from 'rx';
import {h2, div, label, nav, a} from '@cycle/dom';

export function appBar(DOMSource) {
  let vdom$ = Observable.of(
    div('navbar-fixed', [
      nav([
        div('nav-wrapper', [
          a({className: 'brand-logo center', href: '#'}, 'Cycle Socket Chat'),
        ])
      ])
    ])
  );
  
  return {
    DOM: vdom$
  }
}
