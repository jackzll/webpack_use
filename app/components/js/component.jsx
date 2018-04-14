import React, { Component} from 'react';
import {findDOMNode}from 'react-dom';
import PropTypes from 'prop-types';
import { Button, Radio, Icon,Form, Input,Select,DatePicker,Spin,InputNumber} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import _ from 'lodash';

//高阶组件wrapper
export function HocCreateActivity(ComponentInner){
	class InnerComponent extends React.Component{
		constructor(props){
			super(props);
			this.state={
				
			}
		}
		checkName(rules,value,cb){

		}
		//react高阶组件，公用方法可以写这里，通过props传入
		render(){
			return(<div>
						<ComponentInner />
					</div>)
		}	
	}
	return InnerComponent
}

export class TextDesc extends React.Component{
	componentWillReceiveProps(nextProps){
		if('value' in nextProps){
			this.setState({
				value:this.formatValue(_.cloneDeep(nextProps.value))
			})
		}
	}
	handleChange=()=>{

	}
	constructor(props){
		super(props);
		this.key=0;
		this._isMounted=false;
		let value=this.formatValue(_.cloneDeep(this.props.value));
		this.state={
			value:value
		}
	}
	componentDidMount(){
		this._isMounted=true;

	}
	componentWillUnmount(){
		this._isMounted=false;
	}
	formatValue=(valueArr)=>{
		if(Array.isArray(valueArr)&&valueArr.length>0){
			return valueArr.map(ele=>{
				if(ele.key!=undefined)return ele;
				return {
					key:`$$$desc${this.key++}`,
					value:ele,
					error:''
				}
			})
		}
		return [{
					key:`$new${this.key++}`,
					value:'请输入名户名',
					error:''
		}];
	}
	itemChange=(key,value)=>{
		let newValue=this.state.value.map(item=>{
			if (item.key===key){
				item.value=value;
			}
			return item;
		});
		this.setState({
			value:newValue
		},function(){
			if(this._isMounted){
				this.triggerChange();
			}
		});	
	}
	triggerChange=()=>{
		this.props.onChange&&this.props.onChange(_.cloneDeep(this.state.value));
	}
	add=()=>{
		this.state.value.push({
					key:`$$addTextDesc${this.key++}`,
					value:'',
					error:'',					
		});
		this.setState({
			value:this.state.value
		},function(){
			this.triggerChange();
		})
	}
	del=(key)=>{
		let result=this.state.value.filter(ele=>key!==ele.key);
		this.setState({value:result},function(){
			this.triggerChange();
		});
	}
	render(){

		return(
			<div>
				<div>
					{
						this.state.value.map((ele)=>{

							return 	(<FormItem validateStatus={ele.error?'error':'success'} help={ele.error} key={ele.key} style={{marginBottom:24}}>
										<Input placeholder="请输入用户说明" value={ele.value} style={{ width:200, marginRight: 8 }}  onChange={(e)=>{this.itemChange(ele.key,e.target.value)}}/> <a onClick={()=>this.del(ele.key)} style={{display:this.state.value.length>1?'inline-block':'none'}}>删除</a>
									</FormItem>)
						})
					}
					
				</div>
				<div>
					<a onClick={this.add}>添加</a>
				</div>
			</div>
		)
		
	}
}

export function CommonTextDesc(props){
		let fileName=props.fileName||'CommonTextDesc';	
		return(
				<div>
					{
						props.form.getFieldDecorator(fileName,{
								rules: [
		          						{validator:(rule,value,callback)=>{
		          							if(props.visable&&props.required){
			          							let error=null;
			          							let newValue=value.map((ele)=>{
			          								if(typeof ele==='object'){
				          								if(!ele.value){
				          									ele.error="请输入用户说明";
				          									error="请输入用户说明";
				          								}else{
				          									ele.error="";
				          								}
				          								return ele;
			          								}else if(typeof ele==='string'){
			          									if(!ele){
			          										error="请输入用户说明";
			          									}
			          									return {value:ele,error:!ele?'请输入用户说明':''};
			          								}
			          								
			          							})
			          							if(error){
			          								props.form.setFieldsValue({[fileName]:newValue});
			          								callback(error);
			          							}else{
			          								callback();
			          							}
			          							
			          							
		          							}
		          							callback();
		          						}}
		          					],
		          				initialValue:props.initialValue,
		          				onChange:props.onChange||function(){}
						})
					}
					<FormItem {...props.formItemLayout} label="用户说明" required={props.required} style={{display:props.visable?'block':'none'}}>
		          			<TextDesc value={props.form.getFieldValue(fileName)} onChange={(value)=>{props.form.setFieldsValue({[fileName]:value});props.form.validateFields([fileName], { force: true })}}/>
		        	</FormItem>
	        	</div>
		)
}


//组件写法,如果使用的是 react@<15.3.0，则 getFieldDecorator 调用不能位于纯函数组件中,
export function UserName(props){
	let fileName=props.fileName||'UserName';
	return (
		<FormItem label="券名称" {...props.formItemLayout} required={props.required} style={{display:props.visable?'block':'none'}}>
			    {
			       	props.form.getFieldDecorator(fileName, {
		          				rules: [
		          						{validator:(rule,value,callback)=>{
		          							if(props.visable&&props.required){
		          								if(!value){
		          									callback('请输入用户名');
		          								}
		          								else if(!/[a-zA-Z]{1,}/g.test(value)){
		          									callback('用户名必须包含英文字母');
			          							}else{
			          								callback()
			          							}
		          							}
		          							callback()
		          							
		          						}}
		          					],
		          				initialValue:props.initialValue||'',
		          				onChange:props.onChange||function(){}
		       		})(<Input placeholder="用户名" style={{ width:200, marginRight: 8 }} />)
				}
		</FormItem>
	)
}

// 自定义组件
// value格式 onChange
// {
// 	['relativeTime']:time,
//	['absoluteTime']:[start,end]
// }
export class ValidityVoucher extends React.Component{
	componentWillReceiveProps(nextProps){
		if('value' in nextProps&&Object.keys(nextProps.value).length>0){
			let key=Object.keys(nextProps.value)[0];
			this.setState({selectType:key,...nextProps.value});
		}
	}
	constructor(props){
		super(props);
		var v=this.props.value||{relativeTime:undefined}
		this.state={
			selectType:Object.keys(v)[0],
			relativeTime:v.relativeTime,
			absoluteTime:v.absoluteTime
		}
	}
	triggerChange=()=>{
		this.props.onChange&&this.props.onChange({[this.state.selectType]:this.state[this.state.selectType]});
	}
	handleChange=(v)=>{
		this.setState({selectType:v},function(){
			this.triggerChange();
		})
	}
	TimeChange=(keyname,value)=>{
		this.setState({[keyname]:value},function(){
			this.triggerChange();
		})
	}
	render(){
		return(
			<div>
				<Select
		          size='large'
		          onChange={this.handleChange}
		          style={{ width: 100,marginRight:8}}
		          value={this.state.selectType}
		        >
			        <Option value="relativeTime">相对时间</Option>
			        <Option value="absoluteTime">绝对日期</Option>
		        </Select>
		        <RangePicker
			      onChange={(v)=>{this.TimeChange('absoluteTime',v)}}
			      size='large'
			      value={this.state.absoluteTime?this.state.absoluteTime:null}
			      style={{ width: 200,display:(this.state.selectType==='absoluteTime')?'inline-block':'none'}}
			    />
			    <div style={{display:(this.state.selectType==='relativeTime')?'inline-block':'none'}}>领取后<InputNumber value={this.state.relativeTime} onChange={(v)=>{this.TimeChange('relativeTime',v)}}  placeholder="请输入" style={{ width:70, margin:'0 8px' }} size='large' min={1}/>内有效</div>
			</div>
		)
	}
}

export function CommonValidityVoucher(props){
	let fileName=props.fileName||'CommonValidityVoucher';
	return (<FormItem label="券有效期" required={props.required} {...props.formItemLayout} style={{display:props.visable?'block':'none'}}>
			    {
			       	props.form.getFieldDecorator(fileName, {
		          				rules:[
		          						{validator:(rule,value,callback)=>{
		          							if(props.required&&props.visable){
												if(!value||(Array.isArray(value.absoluteTime)&&value.absoluteTime.length<=0)||('absoluteTime' in value&&!value.absoluteTime)){
		          									callback('券有效期不能为空');
				          						}else if('relativeTime' in value&&!value.relativeTime){
				          								callback('券有效期不能为空');
				          						}else{
				          								callback()
				          						}
		          							}
		          							callback()
		          							
		          						}}
		          					],
		          				initialValue:props.initialValue,
		          				onChange:props.onChange||function(){}
		       		})(<ValidityVoucher/>)
				}
		</FormItem>)
}
//加载组件
export function Spining(props){
	return(
		<div style={{minHeight:600,width:'100%',textAlign:'center',paddingTop:200}}>
			<Spin spinning={props.loading} size="large" tip={props.tip}/>
		</div>
	)
}
//radioButton
export function VoucherType(props){
	const {visable=true}=props;
	let fileName=props.fileName||'VoucherType';
	return(<FormItem label="券类型" required={props.required} {...props.formItemLayout} style={{display:visable?'block':'none'}}>
					{	props.form.getFieldDecorator(fileName, {
							initialValue:props.initialValue,
		          			onChange:props.onChange||function(){}
						})(
							<RadioGroup>
								{props.options.map(ele=> <Radio key={ele.value} value={ele.value}>{ele.label}</Radio>)}
						    </RadioGroup>
					    )
					}
			</FormItem>) 
}

