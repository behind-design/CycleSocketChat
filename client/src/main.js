import {run} from '@cycle/core';
import {h4, h2, div, label, nav, a, makeDOMDriver} from '@cycle/dom';
import {appBar} from './appBar.js';
import {chatPane} from './chatPane.js';
import {presencePane} from './presencePane.js';
import {textEntryIntent} from './textEntry.js';
import {textEntryView} from './textEntry.js';
import {textEntryLoseFocus} from './textEntry.js';

function intentLoseFocus(DOMSource) {
  const {buttonClick$, textEntryBlur$} = textEntryLoseFocus(DOMSource);
  
  return Rx.Observable.combineLatest(buttonClick$, textEntryBlur$, (buttonClick, textEntryBlur) => {
    return {buttonClick, textEntryBlur};
  });
}

function intent(DOMSource) {
  const {textStream$, sendNowStream$} = textEntryIntent(DOMSource);
  
  return Rx.Observable.combineLatest(textStream$, sendNowStream$, (textStream, sendNowStream) => {
    return {textStream, sendNowStream};
  });
}

function model(sendNowStream$) {
  return Rx.Observable.combineLatest(
    sendNowStream$.startWith(true),
    () => {return {textValue: ''}}
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
  const lostFocusStream$ = intentLoseFocus(sources.DOM);
  const httpStream$ = intent(sources.DOM);
  
  const state$ = model(httpStream$);
  var sink = view(state$, sources.DOM);
  sink['SetFocusEffect'] = lostFocusStream$;
  sink['HttpPostEffect'] = httpStream$;
  return sink;
}

run(main, {
  DOM: makeDOMDriver('#app'),
  SetFocusEffect: function(lostFocusStream$) {
    lostFocusStream$.subscribe((lostFocusStream) => {
      //console.log(lostFocusStream.buttonClick);
      //console.log(lostFocusStream.textEntryBlur);
      lostFocusStream.textEntryBlur.focus();
      lostFocusStream.textEntryBlur.value = '';
    })
  },
  HttpPostEffect: function(httpStream$) {
    httpStream$.subscribe((httpStream) => {
      console.log(httpStream.textStream);
    });
  },
});