import {Observable} from 'rx';
import {h2, div, label, nav, a} from '@cycle/dom';

export function appBar(DOMSource) {
  let vdom$ = Observable.of(
    div({className: 'navbar-fixed'}, [
      nav([
        div({className: 'nav-wrapper'}, [
          a({className: 'brand-logo center', href: '#'}, 'Cycle Socket Chat'),
        ])
      ])
    ])
  );
  
  return vdom$;
}
