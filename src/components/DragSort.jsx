import React, { Component} from 'react';
import {findDOMNode}from 'react-dom';
import PropTypes from 'prop-types';
import update from 'react/lib/update';
import '../sass/common.scss';
import {createStore} from 'redux';
import HTML5Backend from 'react-dnd-html5-backend'
import {DragSource,DropTarget,DragDropContext} from 'react-dnd';
import flow from 'lodash/flow';
import _ from 'lodash';
require("babel-polyfill");//引入es6api方法;
//退拽
let ItemTypes={
  CARD: 'card',
};
const cardSource = {
  beginDrag(props){
    return {
      id: props.id,
      index: props.index,
    };
  },
};
class Item extends React.Component{
		static propTypes = {
			    connectDragSource: PropTypes.func.isRequired,
			    connectDropTarget: PropTypes.func.isRequired,
			    index: PropTypes.number.isRequired,
			    isDragging: PropTypes.bool.isRequired,
			    id: PropTypes.any.isRequired,
			    text: PropTypes.string.isRequired,
			    moveCard: PropTypes.func.isRequired,
  		};
		constructor(props){
			super(props);
		}
		render=()=>{
			 const {text,isDragging,connectDragSource,connectDropTarget,id} = this.props;
			 const opacity = isDragging ? 0 : 1;
			return(
				connectDragSource(connectDropTarget(
						<div className="drap-item" style={{opacity:opacity}}>
							{text+id}
						</div>

				))
				
			)
		}

}
const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};
var DragItemSource=DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}));
var DragItemTarget=DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  	connectDropTarget: connect.dropTarget(),
}));
var DragItemDeal=flow(DragItemSource,DragItemTarget)(Item);
// var DragItem=DragSource(type, spec, collect)(Item);


class DragBox extends React.Component{
	constructor(props){
		super(props);
		var data=[];
		for(let i=0;i<30;i++){
			data.push({
				id:i,
				text:'Drag'
			})
		}
		this.state={
			cards:data
		}
	}
	moveCard=(dragIndex, hoverIndex)=>{
	    const { cards } = this.state;
	    const dragCard = cards[dragIndex];

	    this.setState(update(this.state, {
	      cards: {
	        $splice: [
	          [dragIndex, 1],
	          [hoverIndex, 0, dragCard],
	        ],
	      },
	    }));
  	}
	render(){
		const { cards } = this.state;
		console.log(this.state);
		let cardItems=cards.map((card,index)=>{
			return <DragItemDeal key={card.id} id={card.id} index={index} text={card.text} moveCard={this.moveCard}/>	
		})
		return(
			<div className="drapArea">
				<h5>拖拽区域</h5>
				<div className="container">
					{cardItems}
				</div>
			</div>
		)

	}
}
var DragBoxRole=DragDropContext(HTML5Backend)(DragBox);
class DragSort extends React.Component{
	constructor(props){
			super(props)
	}
	render(){
		return(
			<div>222322
				<DragBoxRole/>
			</div>
		)
	}

}
export default DragSort;