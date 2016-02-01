import {Observable} from 'rx';
import {h4, div, table, thead, tbody, th, tr, td} from '@cycle/dom';

export function presencePane(DOMSource) {
  let vdom$ = Observable.of(
    div([
      h4('Active Users'),
      table({className: 'striped'}, [
        thead([
          tr([
            th({'data-field': 'id'}, 'Nickname', []),
            th({'data-field': 'name'}, 'Time joined', [])
          ])
        ])
      ])
    ])
  );
  
  return vdom$;
}
