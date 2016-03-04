import React, { Component, PropTypes } from 'react';

/**
 * A rectangular ClipPath.
 */
export default
class ClipRect extends Component {

	static propTypes = {
		id     : PropTypes.string.isRequired,
		x      : PropTypes.number.isRequired,
		y      : PropTypes.number.isRequired,
		width  : PropTypes.number.isRequired,
		height : PropTypes.number.isRequired,
	};

	static defaultProps = {
		x : 0,
		y : 0,
	};

	render() {
		const {id, x, y, width, height} = this.props;
		return <clippath id={id}>
			<rect x={x} y={y} width={width} height={height} />
		</clippath>
	}

}
