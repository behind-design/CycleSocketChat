import {Observable} from 'rx';
import {run} from '@cycle/core';
import {h4, h2, div, label, nav, a, makeDOMDriver} from '@cycle/dom';
import {appBar} from './appBar.js';
import {chatPane} from './chatPane.js';
import {presencePane} from './presencePane.js';
import {textEntryIntent} from './textEntry.js';
import {textEntryView} from './textEntry.js';
import {textEntryLoseFocus} from './textEntry.js';

function intentByBtnClick(DOMSource) {
  const {buttonClick$, textStream$} = textEntryLoseFocus(DOMSource);
  
  return buttonClick$.withLatestFrom(textStream$, (buttonClick, textStream) => {
    return textStream;
  });
}

function intentByEnterKeyPressed(DOMSource) {
  const textStream$ = textEntryIntent(DOMSource);
  return textStream$; 
  
  /*
  return Rx.Observable.combineLatest(enterKeyPressed$, (enterKeyPressed) => {
    return {textStream, sendNowStream};
  });*/
}

function model(sendNowStream$) {
  return Observable.combineLatest(
    sendNowStream$.startWith(''),
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
  const lostFocusStream$ = intentByBtnClick(sources.DOM);
  const textStream$ = intentByEnterKeyPressed(sources.DOM);
  const state$ = model(lostFocusStream$);
  var sink = view(state$, sources.DOM);
  sink['SetFocusEffect'] = lostFocusStream$;
  sink['HttpPostEffect'] = textStream$;
  return sink;
}

run(main, {
  DOM: makeDOMDriver('#app'),
  SetFocusEffect: function(textStream$) {    
    textStream$.subscribe((textStream) => {
      console.log(textStream.value);
      textStream.focus();
      textStream.value = '';
    })
  },
  HttpPostEffect: function(textStream$) {
    textStream$.filter(e => e.keyCode === 13).subscribe((textStream) => {
      console.log(textStream.target.value);
      textStream.target.focus();
      textStream.target.value = '';
    });
  },
});