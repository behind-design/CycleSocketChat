import {Observable} from 'rx';
import {h4, div, ul, li, span, p, input, label, a, i} from '@cycle/dom';

export function textEntryIntentWithSendButtonClicked(DOMSource) {
  const textStream$ = DOMSource.select('#input-msg').events('keyup').map(e => e.target);
  const buttonClick$ = DOMSource.select('#send-btn').events('click').map(e => e.target);

  return {textStream$, buttonClick$};
}

export function textEntryIntent(DOMSource) {    
  const textStream$ = DOMSource.select('#input-msg').events('keyup');  
  return textStream$;
}
  
export function textEntryView(state$) {  
  const vdom$ = state$.map(state =>
    div({className: 'row'}, [
      div({className: 'input-field col s10'}, [
        input({id: 'input-msg', className: 'validate', autofocus: true}),
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