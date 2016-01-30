import {run} from '@cycle/core';
import {h4, h2, div, label, nav, a, makeDOMDriver} from '@cycle/dom';
import {appBar} from './appBar.js';
import {chatPane} from './chatPane.js';
import {presencePane} from './presencePane.js';
import {textEntryIntent} from './textEntry.js';
import {textEntryView} from './textEntry.js';

function intent(DOMSource) {
  const {textStream$, sendNowStream$} = textEntryIntent(DOMSource);
  return {textStream$, sendNowStream$};
}

function model(textStream$, sendNowStream$) {
  return Rx.Observable.combineLatest(
    sendNowStream$.startWith(true),
    () => {return {value: ''}}
  );
}

function view(state$, DOMSource) {
  const appBarView$ = appBar(DOMSource).DOM;
  
  const chatPaneView$ = chatPane(DOMSource).DOM;
  const presencePaneView$ = presencePane(DOMSource).DOM;
  const textEntryView$ = textEntryView(state$).DOM;
  
  const vtree$ = state$.map(state =>
    div([
      appBarView$,
      div({className: 'row'}, [
        div({className: 'col s6'}, [
          h4('Chat Messages'),
          textEntryView$,
        ]),
        div({className: 'col s6'}, [
          presencePaneView$,
        ]),
      ])
    ])
  );
    
  return {
    DOM: vtree$,
    TextEntry: textEntryView$,
  };  
}

function main(sources) {
  const {textStream$, sendNowStream$} = intent(sources.DOM);
  const state$ = model(textStream$, sendNowStream$);
  return view(state$, sources.DOM);
}

function focusInputDriver(textEntry$) {
  //const inputText = sources.DOM.select('#input-msg');
  textEntry$.subscribe(el => {    
    const inputEl = el.children[0].children[0];
    //inputEl.set('autofocus', true);
    console.log(inputEl);
    console.log(inputEl.properties);
  });
  //inputText.map(e => {e.target.focus(); return;});
}

run(main, {
  DOM: makeDOMDriver('#app'),
  TextEntry: focusInputDriver,
});