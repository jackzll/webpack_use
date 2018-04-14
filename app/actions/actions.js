import actionType from './actionsType.js';

export function userNameAction(text){
		return{
			type:actionType.userName,
			text
		}
	}

export function provinceAction(value){
		return {
			type:actionType.province,
			value
		}
}

//@param={keyName:value}
export function activeAAction(param){
	return{
		type:actionType.activeA,
		value:{...param}
	}
}
