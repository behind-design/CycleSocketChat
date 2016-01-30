import {Observable} from 'rx';
import {h4, div, ul, li, span, p, input, label, a, i} from '@cycle/dom';

export function textEntryIntent(DOMSource) {
  let sendBtnClickStream$ = DOMSource.select('#send-btn').events('click').map(() => true);
  let enterKeyPressedStream$ = DOMSource.select('#input-msg').events('keyup').filter(e => e.keyCode == 13);
  let textStream$ = DOMSource.select('#input-msg').events('keyup').map(e => e.target.value); //.takeUntil(enterKeyStream$);
  let sendNowStream$ = Rx.Observable.merge(sendBtnClickStream$, enterKeyPressedStream$); 
  
  return {
    textStream$, sendNowStream$   
  }
}
  //let mergedStream$ = textStream$.takeUntil(sendMessageStream);
  
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
  
  
export function textEntryView(textValue$) {  
  let vdom$ = textValue$.map(textValue =>
    div({className: 'row'}, [
      div({className: 'input-field col s10'}, [
        input({id: 'input-msg', className: 'validate', value: textValue.value}),
        label({className: 'active'}, 'Type your chat, enter or hit button to send')
      ]),
      div({className: 'input-field col s2'}, [
        a({id: 'send-btn', className: 'btn-floating btn-large waves-effect waves-light red'}, [
          i({className: 'material-icons'}, 'send')
        ]) 
      ]),
    ])                             
  );    
  
  return {
    DOM: vdom$,
    //textEntryView$: vdom$,    
    //textEntryIntent$: textValue$, //textStream$,
  }
}