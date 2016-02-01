import {Observable} from 'rx';
import {run} from '@cycle/core';
import {h4, h2, div, label, nav, a, makeDOMDriver} from '@cycle/dom';
import {appBar} from './appBar.js';
import {chatPane} from './chatPane.js';
import {presencePane} from './presencePane.js';
import {textEntryView} from './textEntry.js';
import {textEntryIntent} from './textEntry.js';
import {textEntryIntentWithSendButtonClicked} from './textEntry.js';

function intentWithSendButtonClicked(DOMSource) {
  const {textStream$, buttonClick$} = textEntryIntentWithSendButtonClicked(DOMSource);
  
  return buttonClick$.withLatestFrom(textStream$, (buttonClick, textStream) => {
    return textStream;
  });
}

function intentTextEntry(DOMSource) {
  return textEntryIntent(DOMSource);
}

function model(sendNowStream$) {
  return Observable.of({});
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
  
  return vtree$; 
}

function main(sources) {
  const textStreamWithSendButtonClicked$ = intentWithSendButtonClicked(sources.DOM);
  const textStream$ = intentTextEntry(sources.DOM);
  
  const state$ = model(textStream$);
  
  const sink = {
    DOM: view(state$, sources.DOM),
    EffectHttpSendButtonCliked: textStreamWithSendButtonClicked$,
    EffectHttpEnterKeyPressed: textStream$,
  }
    
  return sink;
}

run(main, {
  DOM: makeDOMDriver('#app'),
  EffectHttpSendButtonCliked: function(textStream$) {    
    textStream$.subscribe((textStream) => {
      console.log(textStream.value);
      textStream.focus();
      textStream.value = '';
    })
  },
  EffectHttpEnterKeyPressed: function(textStream$) {
    textStream$.filter(textStream => textStream.keyCode === 13).subscribe((textStream) => {
      console.log(textStream.target.value);
      textStream.target.focus();
      textStream.target.value = '';
    });
  },
});