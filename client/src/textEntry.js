import {Observable} from 'rx';
import {h4, div, ul, li, span, p, input, label, a, i} from '@cycle/dom';
  
export function textEntryView(DOMSource) {  
  const vdom$ = Observable.of(
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
  
  return vdom$;
}