import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import IndexPage from '../../components/IndexPage';
import { AppContainer } from 'react-hot-loader';
console.log(process.env.NODE_ENV);
const render=(App)=>{
	ReactDOM.render(<AppContainer><App/></AppContainer>,document.getElementById('root'));
}
render(IndexPage);
if (module.hot) {
  module.hot.accept(()=>{ const newPage = require('../../components/IndexPage').default;render(newPage)});
  
}
