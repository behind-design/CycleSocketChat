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
  };  
}

function main(sources) {
  const {textStream$, sendNowStream$} = intent(sources.DOM);
  const state$ = model(textStream$, sendNowStream$);
  var obj = view(state$, sources.DOM);
  obj['TextInput'] = sources.DOM.select('#input-msg');
  return obj;
}

function focusInputDriver(inputText) {
  console.log(inputText);
  //stream$.subscribe(msg => console.log(msg));
  //inputText.map(e => {e.target.focus(); return;});
}

run(main, {
  DOM: makeDOMDriver('#app'),
  //TextInput: focusInputDriver,
});