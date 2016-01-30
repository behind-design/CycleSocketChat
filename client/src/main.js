import {run} from '@cycle/core';
import {h4, h2, div, label, nav, a, makeDOMDriver} from '@cycle/dom';
import {appBar} from './appBar.js';
import {chatPane} from './chatPane.js';
import {presencePane} from './presencePane.js';
import {textEntryIntent} from './textEntry.js';
import {textEntryView} from './textEntry.js';

function intent(DOMSource) {
  const {textStream$, sendNowStream$} = textEntryIntent(DOMSource);
  console.log('intent');
  return {textStream$, sendNowStream$};
}

function model(textStream$, sendNowStream$) {
  /*
  let mergedStream$ = textStream$.takeUntil(sendNowStream$);
  mergedStream$.subscribe(msg => console.log(msg), 
    e => {}, 
    () => {
      return {value: ''};
    }
  );
  */
  console.log(sendNowStream$);
  return sendNowStream$.subscribe((e) => {
    console.log(e);
    return {value: ''};
  });
  
  //let textValue$ = mergedStream$.map(a => a).startWith('');
  
  //var text = '';
  //var onNext = t => { text = t; }
  //var onError = e => {}
  //var onComplete = () => {
  //  mergedStream$ = textStream$.takeUntil(sendMessageStream);
  //  textValue$ = mergedStream$.map(a => a).startWith('');
  //  mergedStream$.subscribe(onNext, onError, onComplete);        
  //}

  //mergedStream$.subscribe(onNext, onError, onComplete);
  
}

function view(state, DOMSource) {
  console.log('view');
  const appBarView$ = appBar(DOMSource).DOM;
  
  const chatPaneView$ = chatPane(DOMSource).DOM;
  const presencePaneView$ = presencePane(DOMSource).DOM;
  const textEntryView$ = textEntryView(Rx.Observable.of(state)).DOM;
  
  const vtree$ = Rx.Observable.combineLatest(appBarView$, chatPaneView$, presencePaneView$, textEntryView$,
                                             (appBar, chatPane, presencePane, textEntry) => 
    div([
        appBar,
        div({className: 'row'}, [
          div({className: 'col s6'}, [
            h4('Chat Messages'),
            textEntry,
          ]),
          div({className: 'col s6'}, [
            presencePane,
          ]),
        ])
      ])                                            
  );
    
  return {
    DOM: vtree$,
    //TextStream: textStream$,
    //SendNowStream: sendNowStream$,
  };  
}

function main(sources) {
  const {textStream$, sendNowStream$} = intent(sources.DOM);
  const state = model(textStream$, sendNowStream$);
  return view(state, sources.DOM);
}

function consoleLogDriver(stream$) {
  console.log(stream$);
  stream$.subscribe(msg => console.log(msg), e => {}, () => console.log('done'));
}

run(main, {
  DOM: makeDOMDriver('#app'),
  //TextStream: consoleLogDriver,
  //SendNowStream: consoleLogDriver,
});