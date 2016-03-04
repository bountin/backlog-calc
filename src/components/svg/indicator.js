import React, { Component, PropTypes } from 'react';

/**
 * An indicator for SVG charts.
 */
export default
class Indicator extends Component {

	static propTypes = {
		x         : PropTypes.number.isRequired,
		y         : PropTypes.number.isRequired,
		className : PropTypes.string,
	};

	render() {
		const {x, y, className} = this.props;
		return <g className={className} transform={`translate(${x}, ${y})`}>
			<circle className='outer' r='8' />
			<circle className='inner' r='4' />
		</g>;
	}

}

