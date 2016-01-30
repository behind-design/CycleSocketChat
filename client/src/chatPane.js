import {Observable} from 'rx';
import {h4, div, ul, li, span, p, input, label, a, i} from '@cycle/dom';

export function chatPane(DOMSource) {
      
  let vdom$ = Observable.of(textValue =>
    div([      
    ])
                             
    /*                             
    div([
      h4('Chat Messages'),
      div({className: 'row'}, [
        div({className: 'input-field col s10'}, [
          input({id: 'input-msg', className: 'validate', value: textValue}),
          label({className: 'active'}, 'Type your chat, enter or hit button to send')
        ]),
        div({className: 'input-field col s2'}, [
          a({id: 'send-btn', className: 'btn-floating btn-large waves-effect waves-light red'}, [
            i({className: 'material-icons'}, 'send')
          ]) 
        ]),
      ])
    ])*/
  );    
  
  return {
    DOM: vdom$,    
  }
}