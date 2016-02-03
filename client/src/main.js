import {Observable} from 'rx';
import {run} from '@cycle/core';
import {h4, h2, div, label, nav, a, makeDOMDriver} from '@cycle/dom';
import {appBar} from './appBar.js';
import {chatPane} from './chatPane.js';
import {presencePane} from './presencePane.js';
import {textEntryView} from './textEntry.js';


function view(DOMSource) {
  const appBarView$ = appBar(DOMSource);
  const chatPaneView$ = chatPane(DOMSource);
  const presencePaneView$ = presencePane(DOMSource);
  const textEntryView$ = textEntryView(DOMSource);
  
  const vtree$ = Observable.of(
    div([
      appBarView$,
      div('.row', [
        div('.col .s6', [
          h4('Chat Messages'),
          textEntryView$,
        ]),
        div('.col .s6', [
          presencePaneView$,
        ]),
      ])
    ])
  );
  
  return vtree$; 
}

function main(sources) {
  return {
    DOM: view(sources.DOM)
  };
}

run(main, {
  DOM: makeDOMDriver('#app'),
});