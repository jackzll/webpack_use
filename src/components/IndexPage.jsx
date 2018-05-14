import React, { Component} from 'react';
import {findDOMNode}from 'react-dom';
import PropTypes from 'prop-types';
import styles from'../sass/common.scss';
import _ from 'lodash';
import { Button, Radio, Icon,Form, Input,Select,DatePicker,Spin,InputNumber,Tabs,message} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
const TabPane = Tabs.TabPane;
import {VoucherType,
	Spining,
	CommonValidityVoucher,
	ValidityVoucher,
	UserName,
	CommonTextDesc,
	TextDesc,
	HocCreateActivity} from './component.jsx';
/**
*	@objData[object]
*	转换成ant-form双向编订要求的值
*   {
*		[name]:{value:}	
*	}
*
*/
function transformFormState(objData){
		if(typeof objData==='object'){
			let result={};
			for(let name in objData){
				result[name]={
					value:objData[name]
				}
			}
			return {...result}
		}
	}

class MultiVoucherItemForm extends React.Component{
	constructor(props){
		super(props);
		this._isMounted=false;
		this.state={
			common:this.props.common,
		}
	}
	handleSubmit=(e)=>{
		let result={}
		this.props.form.validateFields({ force: true },(err, values) => {
				console.log('err',err)
				let keyFlag=this.props.keyFlag;
			    if (!err) { 
			        console.log(`MultiVoucher${keyFlag}Received values of form:`, values);
			       	result={
			       		key:keyFlag,
			        	from:`MultiVoucher${keyFlag}`,
			        	result:values
			        }
			    }else{
			    	result={
			    		key:keyFlag,
			    		title:this.props.title,
			        	from:`MultiVoucher${keyFlag}`,
			        	error:err
			        }
			    	console.log(`MultiVoucher${keyFlag}hasError:`, err);
			    }
    	});
    	return{
    		...result
    	} 
	}
	reset=(e)=>{
		this.props.form.resetFields();
	}
	componentDidMount(){
		this._isMounted=true;
		this.props.getRefs&&this.props.getRefs(this);
	}
	componentWillUnmount(){
		this._isMounted=false;
		this.props.getRefs&&this.props.getRefs(this);
	}
	render(){
		let common={...this.props.common,form:this.props.form};
		return(<Form onSubmit={this.handleSubmit}>
				<VoucherType  {...common} options={[{value:'0',label:'代金券'},{value:'1',label:'兑换券'}]} />
				<UserName required={true} {...common}  visable={this.props.form.getFieldValue('VoucherType')==='0'}/>
				<CommonValidityVoucher required={true} {...common}  visable={true}/>
				<CommonTextDesc required={true} {...common}  visable={true}/>
			</Form>)
	}
}
let MultiVoucherItem=Form.create({
			  onFieldsChange(props,changedFields) {
			  		if(Object.keys(changedFields).length<=0) return;
			  		props.voucherChange&&props.voucherChange(props.keyFlag,changedFields);
			  },
			  mapPropsToFields(props) {
					return {
							...props.data
						};
			  },
			  onValuesChange(props, values) {
			    // props.onChange&&props.onChange(values);
			  },
})(MultiVoucherItemForm);


//多券
class MultiVoucher extends React.Component {
	componentWillReceiveProps(nextprops){
		if('data' in nextprops){
			this.setState({panes:_.cloneDeep(nextprops.data),activeKey:nextprops.activeKey});
		}
	}
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    this._isMounted=false;
    this._childrens=[];
    let key=new Date().getTime();
    this.formateValue={
    			key:this.newTabIndex,
    			...transformFormState({
    				VoucherType:'0',
					UserName:'',
					CommonValidityVoucher:{relativeTime:''},
					CommonTextDesc:['请输入用户信息']
    			})
		}
    const panes =_.cloneDeep(this.props.data||this.formateValue);
    this.state = {
      activeKey: panes[0].key,
      panes,
    };
  }
  triggerChange(key){
  	this.props.onChange&&this.props.onChange(_.cloneDeep(this.state.panes),key||this.state.activeKey);
  }
  onChange = (activeKey) => {
    this.setState({ activeKey },function(){
    	this.triggerChange();
    });
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }
  add = () => {
    const panes = this.state.panes;
    const activeKey = `券${this.newTabIndex++}`;
    panes.push({ title:activeKey,...Object.assign(_.cloneDeep(this.formateValue),{key:activeKey})});
    this.setState({ panes, activeKey },function(){
    	this.triggerChange();
    });
  }
  remove = (targetKey) => {
    let activeKey = this.state.activeKey;
    let statePanes=this.state.panes;
   	statePanes.forEach((pane, i) => {
      if (pane.key === targetKey) {
      		activeKey=i===0?statePanes[i+1].key:statePanes[i-1].key;
      }
    });
    const panes = statePanes.filter(pane => pane.key !== targetKey);
    this.setState({ panes, activeKey},function(){
    	this.triggerChange();
    });
  }
  getChild=(formInst)=>{
  	let childrens=this._childrens;
  	if(!childrens.includes(formInst)){
			childrens.push(formInst);
		}
		this._childrens=childrens.filter(item=>item._isMounted);
  }
  handleSubmit=()=>{
  		let values=[]
  		for (let inst of this._childrens){
  			let result=inst.handleSubmit();
  			if(result.error){
  				this.setState({activeKey:result.key},function(){this.triggerChange(result.key)});
  				message.error(`请完善${result.title}`);
  				break;
  			}
  			values.push(result);
  		}
		return [...values];
  }
  reset=()=>{
		this._childrens.map(inst=>{
				return inst.reset(); 
		});
	}
  componentDidMount(){
  	this._isMounted=true;
  	this.props.getRefs&&this.props.getRefs(this);
  }
  componentWillUnmount(){
  	this._isMounted=false;
  }
  render() {
  
    return (
      <Tabs
        onChange={this.onChange}
        activeKey={this.state.activeKey}
        type="editable-card"
        onEdit={this.onEdit}
      >
        {this.state.panes.map((pane,index)=> <TabPane tab={`券${index+1}`} forceRender={true} key={pane.key} closable={pane.closable}><MultiVoucherItem title={`券${index+1}`} voucherChange={this.props.voucherChange} onChange={this.fieldsChange} keyFlag={pane.key} data={pane} common={this.props.common} getRefs={this.getChild}/></TabPane>)}
      </Tabs>
    );
  }
}

//MainForm组件；
class MainForm extends React.Component{
	constructor(props){
		super(props);
		this._isMounted=false;
		this._timer=null;
		this.state={
			..._.cloneDeep(this.props.data)
		}
	}
	handleSubmit=(e)=>{
		let result={}
		this.props.form.validateFields({ force: true },(err, values) => {
			    if (!err) {
			        console.log('MainForm Received values of form: ', values);
			        result={
			        	from:`MainForm`,
			        	result:values
			        }
			    }else{
			    	result={
			        	from:`MainForm`,
			        	error:err
			        }
			    }
			   
    	});
    	return{
    		...result
    	} 
	}

	userNameChange=(v)=>{
		console.log('userName',v.target.value);
	}
	radioGroupChange=(e)=>{
	}
	ValidityVoucherChange=(value)=>{
		console.log('ValidityVoucherChange',value);
	}
	setFileValue=(fileName,value)=>{
		this.props.form.setFieldsValue({[fileName]:value});
	}
	reset=(e)=>{
		this.props.form.resetFields();
	}
	componentWillUnmount(){
		this._isMounted=false;
		this.props.getRefs&&this.props.getRefs(this);
	}
	componentDidMount(){
		this._isMounted=true;
		this.props.getRefs&&this.props.getRefs(this);
	}
	render(){
		let common={...this.props.common,form:this.props.form};
		return (<Form onSubmit={this.handleSubmit}>
					<VoucherType onChange={this.radioGroupChange} {...common} options={[{value:'0',label:'代金券'},{value:'1',label:'兑换券'}]} initialValue={this.state.VoucherType}/>
					<UserName required={true} {...common} initialValue={this.state.UserName} onChange={this.userNameChange} visable={this.props.form.getFieldValue('VoucherType')==='0'}/>
					<CommonValidityVoucher required={true} {...common} initialValue={this.state.CommonValidityVoucher} onChange={this.ValidityVoucherChange} visable={true}/>
					<CommonTextDesc required={true} {...common} initialValue={this.state.CommonTextDesc} onChange={this.ValidityVoucherChange} visable={true}/>
				</Form>);
		
	}
}




let MainArea=Form.create({
			  onFieldsChange(props,changedFields) {
			  	console.log('changed',changedFields);
			  	if(Object.keys(changedFields).length<=0) return;
			  	props.onChange&&props.onChange(changedFields);
			  },
			  mapPropsToFields(props) {
			  		return {
			  			...props.data
			  		}
			  },
			  onValuesChange(props, values) {
			    props.onChange&&props.onChange(values);
			  },
})(MainForm);




let initialValue={
				mianData:{
						...transformFormState({
							VoucherType:'0',
							UserName:'mianData',
							CommonValidityVoucher:{relativeTime:''},
							CommonTextDesc:['请输入用户信息','mianData'],
						})
					
					},
				vouchers:[
					{
						key:'newVoucher',
						...transformFormState({
							VoucherType:'0',
							UserName:'mianData',
							CommonValidityVoucher:{relativeTime:''},
							CommonTextDesc:['请输入用户信息'],
						})
					}
				]
			};


//最外层组件
class IndexPage extends React.Component{
	constructor(props){
		super(props);
		this._isMounted=false;
		this._timer=null;
		this._forms=[];
		this._initialValue=initialValue;
		this.state={
			dataLoading:false,
			activeKey:this._initialValue['vouchers'][0].key,
			..._.cloneDeep(this._initialValue)
		}
	}
	submite=(e)=>{
		e.preventDefault();
		let data=this._forms.map(inst=>{
				if(inst._isMounted){
					return inst.handleSubmit(); 
				}
				
		});
		console.log('childrensData',data);
	}
	//重置表单,即将原始值重置
	reset=()=>{
		this.setState({..._.cloneDeep(this._initialValue),activeKey:this._initialValue['vouchers'][0].key});
	}
	//获取表单实例
	getRefs=(formInst)=>{
		let _forms=this._forms;
		if(!_forms.includes(formInst)){
			_forms.push(formInst);
		}
		this._forms=_forms.filter(item=>item._isMounted);
	}
	//每张券中字段变化
	VouchersItemChange=(key,fields)=>{
		let vouchers=this.state.vouchers.map(ele=>{
	  		let voucher=ele;
	  		debugger;
		  	if(key===ele.key){
		  			voucher=Object.assign({},ele,fields);
	  		}
  			return voucher;
  		});
		this.setState({vouchers});
	}
	//券的增加和删除
	VoucherChange=(vouchers,activeKey)=>{
		this.setState({
			vouchers,
			activeKey
		})
	}
	MainAreaChange=(fields)=>{
		let mianData=this.state.mianData=Object.assign({},this.state.mianData,fields);
		this.setState({mianData},function(){
			console.log('this.state.mianData',this.state.mianData);
		});
	}
	componentDidMount(){
		this._isMounted=true;
		this.setState({dataLoading:true});
		let result={

					mianData:{
						...transformFormState({
							VoucherType:'0',
							UserName:'请求成功后的值',
							CommonValidityVoucher:{relativeTime:'23'},
							CommonTextDesc:['请输入用户信息','请求成功后的值']
						})
						
					},
					vouchers:[
						{
							key:'1101',
							...transformFormState({
								VoucherType:'0',
								UserName:'',
								CommonValidityVoucher:{relativeTime:''},
								CommonTextDesc:['请输入用户信息','请输入用户信息','请输入用户信息']
							})
						},
						{
							key:'1102',
							...transformFormState({
								VoucherType:'0',
								UserName:'',
								CommonValidityVoucher:{relativeTime:''},
								CommonTextDesc:['请输入用户信息']
							})
						}
					]
		}
		this._timer=setTimeout(()=>{
			if(this._isMounted){
				this.setState({
					dataLoading:false,
					activeKey:result.vouchers[0].key,
					...result
				},function(){
					this.forceUpdate()
				})
			}
		},2000)
		
	}
	componentWillUnmount(){
		clearTimeout(this._timer);
		this._isMounted=false;
	}
	render(){
			const formItemLayout = {
			      labelCol: {
			        xs: { span: 24 },
			        sm: { span: 3 },
			      },
			      wrapperCol: {
			        xs: { span: 24 },
			        sm: { span: 18 },
			      },
			};
			let common={
				formItemLayout
			}
		if(this.state.dataLoading){
		 	return (
		 		<Spining loading={this.state.dataLoading} tip="数据加载中...,请稍后"/>
		 	);
		}else{
			return 	(<div style={{width:1000,margin:'0 auto',paddingTop:24}}>
					<img src={require('../images/1.png')}/>
					<MainArea data={this.state.mianData} common={common}  onChange={this.MainAreaChange} getRefs={this.getRefs}/>
					<MultiVoucher data={this.state.vouchers} common={common} getRefs={this.getRefs} onChange={this.VoucherChange} voucherChange={this.VouchersItemChange} activeKey={this.state.activeKey}/>
					<FormItem {...formItemLayout} label=" " colon={false}>
	          			<Button type="primary" onClick={this.submite} style={{marginRight:16}}>提交</Button>
	          			<Button type="default" onClick={this.reset}>重置</Button>
	        		</FormItem>
				</div>)
		}
	}
}
// 经过高阶组件处理后
export default HocCreateActivity(IndexPage);