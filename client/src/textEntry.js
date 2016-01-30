import {Observable} from 'rx';
import {h4, div, ul, li, span, p, input, label, a, i} from '@cycle/dom';

export function textEntryIntent(DOMSource) {
  const sendBtnClickStream$ = DOMSource.select('#send-btn').events('click').map(() => true);
  const enterKeyPressedStream$ = DOMSource.select('#input-msg').events('keyup').filter(e => e.keyCode == 13);
  const textStream$ = DOMSource.select('#input-msg').events('keyup').map(e => e.target.value);
  const sendNowStream$ = Rx.Observable.merge(sendBtnClickStream$, enterKeyPressedStream$); 
  
  return {
    textStream$, sendNowStream$   
  }
}
  
export function textEntryView(textValue$) {  
  const vdom$ = textValue$.map(textValue =>
    div({className: 'row'}, [
      div({className: 'input-field col s10'}, [
        input({id: 'input-msg', className: 'validate', value: textValue.value, autofocus: 'true'}),
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
  }
}