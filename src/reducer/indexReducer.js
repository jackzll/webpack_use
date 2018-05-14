import { combineReducers } from 'redux';
import actionType from '../actions/actionsType.js';
// var initState={
// 	countValue:0,
// 	inputActive:false
// }
// reducer;
// let Counter=function(state=0,action){
// 	switch(action.type) {
// 		case 'add':return state+1;
// 		case 'dec':return state-1;
// 		case 'input':return action.value;
// 		default:return state;
// 	}
// }
// let Desc=function(state="",action){
// 	 switch(action.type){
// 	 	case 'desc' :return action.text;
// 	 	default:return state;
// 	 }
	 
// }


let initalValue={
	userName:'亮',
	province:'bj',
	explain:['用户说明']

}


let activesInit={
	activesA:{
		...initalValue
	},
	activesB:{
		...initalValue
	}
}


let activesA=function(state=activesInit.activesA,action){
	switch(action.type){
		case actionType.activeA:
		return Object.assign({},state,{
			...action.value
		})
		default:
		return state;
	}
};


// let userName=function(state=initalValue.userName,action){
// 	switch(action.type){
// 		case actionType.userName:
// 				return action.text;
// 		default :
// 				return state;
// 	}
// }
// let province=function(state=initalValue.province,action){
// 	switch(action.type){
// 		case actionType.province:
// 			return action.value;
// 		default :
// 			return state;
// 	}
// }
// let explain=(state=initalValue.explain,action)=>{
// 	switch(action.type){
// 		case actionType.explainAdd:
// 		 Object.assign([],actions.value)
// 		 default :
// 		 return state;
// 	}
// }
// let allReducer=function(state={Counter:0,Desc:''},action){
// 	return{
// 		Counter:reducerCounter(state.Counter,action),
// 		Desc:reducerDesc(state.Desc,action)
// 	}
// };



export default combineReducers({
	activesA
});
