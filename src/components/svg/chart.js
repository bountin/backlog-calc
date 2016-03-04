import React, { Component, PropTypes } from 'react';

/**
 * An SVG chart base component.
 */
export default
class Chart extends Component {

	static propTypes = {
		width   : PropTypes.number.isRequired,
		height  : PropTypes.number.isRequired,
		padding : PropTypes.any,
	};

	static defaultProps = {
		padding : {},
	};

	render() {
		const { width, height, padding, children } = this.props;
		padding = this._parsePadding(padding);

		return <svg
			width={ width + padding.left + padding.right }
			height={ height + padding.top + padding.bottom }
			{...this.forwardProps()}>
			<g transform={`translate(${padding.left}, ${padding.right})`}>
				{children}
			</g>
		</svg>;
	}

	/**
	 * Resolves all runtime properties that are not specified in
	 * {@link propTypes}. Usually, these properties are passed down to
	 * one of the child elements.
	 *
	 * TODO: Move to utils / mixin
	 *
	 * @returns {object} All properties for forwarding.
	 */
	forwardProps() {
		const other = {};
		for (let key in this.props) {
			if (!this.constructor.propTypes.hasOwnProperty(key))
				other[key] = this.props[key];
		}
		return other;
	}

	/**
	 * Parses the padding property from any of the following formats:
	 *
	 * String:
	 *  - 'vertical, horizontal'
	 *  - 'top, horizontal, bottom'
	 *  - 'top, right, bottom, left'
	 *
	 * Array:
	 *  - [vertical, horizontal]
	 *  - [top, horizontal, bottom]
	 *  - [top, right, bottom, left]
	 *
	 * Object
	 *  - { top, right }
	 *  - { top, right, bottom }
	 *  - { top, right, left }
	 *  - { top, right, bottom, left }
	 *
	 * @param {any} prop A padding specification.
	 * @returns {object} The parsed padding as object.
	 */
	_parsePadding(prop) {
		if (typeof prop === 'string')
			// Do not call .map(parseInt) directly; this results in NaN!
			prop = prop.split(/\s*,\s*/).map(s => parseInt(s));

		if (prop instanceof Array) {
			const [top, right, bottom = top, left = right] = prop;
			return {top, right, bottom, left};
		} else {
			const {top = 0, right = 0, bottom = 0, left = 0} = prop;
			return {top, right, bottom, left};
		}
	}

}
