import React, { Component} from 'react';
import {findDOMNode}from 'react-dom';
import PropTypes from 'prop-types';
// import PropTypes from 'prop-types';
import styles from'../sass/common.scss';
import _ from 'lodash';
import {createStore} from 'redux';
import allReducer from '../reducer/indexReducer';
import {activeAAction} from '../actions/actions';
var JQ=require('jquery');
const store=createStore(allReducer,window.devToolsExtension && window.devToolsExtension());
console.log('store',store.getState());
const {userNameAction}=actions;
import { Button, Radio, Icon,Form, Input,Select,DatePicker,Spin,InputNumber} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment'
// class ChildComponent extends React.Component{
// 	//子组件声明上下文信息；
// 	static contextTypes = {
//   		store: PropTypes.object
// 	}
// 	render(){
// 		let store=this.context.store;
// 		const {province}=store.getState()['activesA'];
// 		// console.log('province',province)
// 		return(
// 			<div>
// 				<Select  value={province} style={{ width: 120 }} onChange={(value)=>{store.dispatch(activeAAction({'province':value}))}} placeholder="请选择">
// 			      <Option value="bj">北京</Option>
// 			      <Option value="hb">河北</Option>
// 			      <Option value="sd">山东</Option>
// 			      <Option value="tj">天津</Option>
// 	    		</Select>
// 			</div>
// 		)
// 	}
// }

// class UserExplain extends React.Component{
// 	componentWillReceiveProps(nextProps){

// 	}
// 	constructor(props){
// 		super(props);
// 		this.key=0;
// 		this.state={
// 			value:[]
// 		}
// 	}
// 	add=()=>{

// 	}
// 	del=()=>{

// 	}
// 	input=()=>{

// 	}
// 	render(){
// 		return(


// 		)
// 	}
// // }
// function HigherOrderComponent(WrapComponet){
// 	class InnerComponent extends React.Component{
// 				constructor(props){
// 						super(props);
// 				}
// 				//返回上限文信息
// 				getChildContext() {
// 			    	return {store:store};
// 			  	}
// 				handleSubmit=(e)=>{
// 					e.preventDefault();
// 				}
// 				componentDidMount(){ 
// 					this.mounted = true;
// 					store.subscribe(()=>{
// 						this.forceUpdate();
// 					});
// 					// setTimeout(()=>{if(this.mounted){

// 					// }},1000)
// 				}
// 				shouldComponentUpdate(){
// 					return true;
// 				}
// 				componentWillUnmount() {
// 			    	this.mounted = false;
// 				}
// 				handleFormChange = (changedFields) => {
// 					store.dispatch(activeAAction({...changedFields}))
// 				}
// 				render(){
// 					const data=store.getState()['activesA'];
// 					return <WrapComponet data={data} onChange={this.handleFormChange}/>
// 				}
// 	}
// 	// 父组件声明上限文信息
// 	InnerComponent.childContextTypes={
// 		store: PropTypes.object
// 	}
// 	return InnerComponent;
// }





// class IndexPageForm extends React.Component{
// 	//子组件声明上下文信息；
// 	static contextTypes = {
//   		store: PropTypes.object,
// 	}
// 	render(){
// 		let store=this.context.store;
// 		const { getFieldDecorator } =this.props.form;
// 		return(
// 				<div className={styles.content}>
// 					<Form onSubmit={this.handleSubmit}>
// 					<FormItem label="姓名"
// 				          required={false}
// 				         {...formItemLayout}
// 		        	>
// 			        	{
// 			        	 	getFieldDecorator('userName', {
// 		          				rules: [{ required: true, message: 'Username is required!' }],
// 		       			 	})(<Input placeholder="passenger name" style={{ width:200, marginRight: 8 }} />)
// 						}
// 					</FormItem>
// 					<FormItem {...formItemLayout} label="用户说明">
// 	          			<TextDesc/>
// 	        		</FormItem>
// 	        		<FormItem {...formItemLayout} label=" " colon={false}>
// 	          			<Button type="primary" htmlType="submit">提交</Button>
// 	        		</FormItem>
// 				 </Form>
// 				</div>
// 		)
// 	}
// }






// let IndexPage=Form.create({
//   onFieldsChange(props,changedFields) {
//   	console.log(changedFields);
    
//   },
//   mapPropsToFields(props) {
//   	console.log('mapPropsToFields',props.data)
//     return {
//       userName:{
//       	value:props.data.userName
//       },
//     };
//   },
//   onValuesChange(props, values) {
//     props.onChange(values);
//   },
// })(IndexPageForm);
// export default HigherOrderComponent(IndexPage);

// class UserName extends React.Component{
// 	constructor(props){
// 		super(props);
// 	}
// 	render(){
// 		const { getFieldDecorator } =this.props.form;
// 		<FormItem label="姓名" required={this.props.required} {...this.props.formItemLayout}>
// 			    {
// 			        	 	getFieldDecorator('userName', {
// 		          				rules: [{ required: true, message: '请输入用户名' }],
// 		       			 	})(<Input placeholder="passenger name" style={{ width:200, marginRight: 8 }} />)
// 				}
// 		</FormItem>

// 	}
// }