import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DragSort from '../../components/DragSort';
import { AppContainer } from 'react-hot-loader';

const render=(App)=>{
	ReactDOM.render(<AppContainer><App/></AppContainer>,document.getElementById('root'));
}
render(DragSort);
if (module.hot) {
  module.hot.accept('../../components/DragSort', () => {
    render(DragSort);
  });
}
