import React from 'react';
import ReactDOM from 'react-dom';
import DomUtils from './dom-utils';

import defaultStyle from './styles/tooltip-inner';

/* The content of the tooltip while fully displayed */
const TooltipInner = React.createClass({

	propTypes: {
		/* Customize style */
		className: React.PropTypes.string,
		style: React.PropTypes.object,
		position: React.PropTypes.object,

		/* Force the width of the inner tooltip */
		width: React.PropTypes.string,
		height: React.PropTypes.string,
		onHideRequest: React.PropTypes.func.isRequired,
		clicked: React.PropTypes.bool,
		children: React.PropTypes.node.isRequired
	},

	getInitialState() {
		const overlay = document.createElement('div');
		return {
			visible: false,
			overlayDiv: overlay
		};
	},


	//
	//	Life cycle
	//

	componentDidMount() {
		document.body.appendChild(this.state.overlayDiv);
		ReactDOM.render(this._renderOverlay(), this.state.overlayDiv);
	},

	componentWillReceiveProps() {
		this.setState({
			containingNode: ReactDOM.findDOMNode(this),
			position: this.props.position
		});
	},

	componentDidUpdate() {
		ReactDOM.render(this._renderOverlay(), this.state.overlayDiv);
	},

	componentWillUnmount() {
		if (this.state.overlayDiv && this.state.overlayDiv.parentNode) {
			this.state.overlayDiv.parentNode.removeChild(this.state.overlayDiv);
		}
	},


	//
	//	Utils
	//

	getAvailableRightSpace() {

	},

	getMaxWidth() {
		return DomUtils.getParentOverflowScroll(this.state.containingNode).innerWidth - this.props.position.left;
	},

	getMaxHeight() { // TODO

	},

	handleMouseMove(e) {
		const domNode = ReactDOM.findDOMNode(this);
		const target = document.elementFromPoint(e.pageX, e.pageY);
		if (target === domNode || DomUtils.isDescendant(domNode, target)) {
			this.setTooltipDisplayed();
		} else {
			this.setTooltipHidden();
		}
	},

	handleOverlayClick(e) {
		e.stopPropagation();
		this.props.onHideRequest();
	},

	_renderOverlay() {
		if (!this.state.containingNode || !this.props.position) {
			return (<span></span>);
		}

		if (!this.props.clicked) {
			return (<span></span>);
		}

		const style = {
			position: 'fixed',
			opacity: '0',
			background: 'rgba(0,0,0)',
			cursor: 'pointer',
			width: '100%',
			height: '100%',
			top: '0',
			left: '0'
		};

		return (<div style={style} onClick={this.handleOverlayClick}>this should be transparent overlay that cover the whole window</div>);
	},

	/*getHorizontalDir() {
		if (this.props.horizontalDir === 'left' || this.props.horizontalDir === 'right') {
			return this.props.horizontalDir;
		}
		return this.props.position.left > this.state.containingNode.offsetHeight;
	},

	getVerticalDir(dir) {
		return dir;
	},*/

	render() {
		const style = this.props.style || defaultStyle.toJS();

		//const windowWidth = window.innerWidth;
		//const windowHeight = windowWidth.innerHeight;

		if (!this.state.containingNode || !this.props.position) {
			return <span />;
		}

		//const verticalDir = this.getVerticalDir();
		//const horizontalDir = this.getHorizontalDir();

		// React.findDOMNode(this).innerHeight;
		// this.getDOMNode().innerHeight


		style.left = this.props.position.left;
		style.top = this.props.position.top + this.props.position.height + 5; // 5px of margin
		style.maxWidth = this.getMaxWidth();

		return <span style={style}>{this.props.children}</span>;
	}

});

export default TooltipInner;
