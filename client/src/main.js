import {Observable} from 'rx';
import {run} from '@cycle/core';
import {h4, h2, div, label, nav, a, makeDOMDriver} from '@cycle/dom';
import {appBar} from './appBar.js';
import {chatPane} from './chatPane.js';
import {presencePane} from './presencePane.js';
import {textEntryView} from './textEntry.js';
import {textEntryIntentWithEnterKeyPressed} from './textEntry.js';
import {textEntryIntentWithSendButtonClicked} from './textEntry.js';

function intentWithSendButtonClicked(DOMSource) {
  const {textStream$, buttonClick$} = textEntryIntentWithSendButtonClicked(DOMSource);
  
  return buttonClick$.withLatestFrom(textStream$, (buttonClick, textStream) => {
    return textStream;
  });
}

function intentWithEnterKeyPressed(DOMSource) {
  const {textStream$, enterKeyPressed$} = textEntryIntentWithEnterKeyPressed(DOMSource);
  
  return enterKeyPressed$.withLatestFrom(textStream$, (enterKeyPressed, textStream) => {
    return textStream;
  });
}

function intent(DOMSource) {
  return Observable.merge(intentWithSendButtonClicked(DOMSource), intentWithEnterKeyPressed(DOMSource));
}

function model(sendNowStream$) {
  return Observable.of({});
}

function view(state$, DOMSource) {
  const appBarView$ = appBar(DOMSource);
  
  const chatPaneView$ = chatPane(DOMSource);
  const presencePaneView$ = presencePane(DOMSource);
  const textEntryView$ = textEntryView(state$);
  
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
  const textStream$ = intent(sources.DOM);
  
  const state$ = model(textStream$);
  
  const sink = {
    DOM: view(state$, sources.DOM),
    EffectHttp: textStream$,
  }
    
  return sink;
}

run(main, {
  DOM: makeDOMDriver('#app'),
  EffectHttp: function(textStream$) {    
    textStream$.subscribe((textStream) => {
      console.log(textStream.value);
      textStream.focus();
      textStream.value = '';
    })
  }
});