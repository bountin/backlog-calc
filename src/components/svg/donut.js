import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

/**
 * An SVG area.
 */
export default
class Donut extends Component {

	static propTypes = {
		data        : PropTypes.array.isRequired,
		outerRadius : PropTypes.number.isRequired,
		innerRadius : PropTypes.number.isRequired,
		value       : PropTypes.func.isRequired,
	};

	render() {
		const {
			data,
			value,
			outerRadius,
			innerRadius,
			color,
		} = this.props;

		const pie = d3.layout.pie()
			.sort(null);

		const arc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius);

		const pieces = pie(data.map(value));

		return <g transform={`translate(${outerRadius}, ${outerRadius})`}>
			{pieces.map((d, i) => <path
				key={i}
				d={arc(d)}
				fill={color(i)}
			/>)}

			{pieces.map((d, i) => <text
				key={i}
				textAnchor="middle"
				transform={`translate(${arc.centroid(d)})`}
				className="donut-label">
				{formatCurrency(d.value)}
			</text>)}
		</g>;
	}
}

/**
 * Formats the given amount as currency number including the currency symbol.
 * NOTE: Currently, Euros are hard-coded!
 *
 * TODO: Move to utils.
 *
 * @param {number} amount The amount to format.
 * @returns {string} The formatted amount including the currency symbol.
 */
function formatCurrency(amount) {
	return amount ? '\u20ac ' + d3.format(',.2f')(amount) : '';
}

