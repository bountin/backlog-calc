import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

/**
 * A shape as defined by D3:
 *
 * - circle        - a circle.
 * - cross         - a Greek cross or plus sign.
 * - diamond       - a rhombus.
 * - square        - an axis-aligned square.
 * - triangle-down - a downward-pointing equilateral triangle.
 * - triangle-up   - an upward-pointing equilateral triangle.
 *
 * @see https://github.com/mbostock/d3/wiki/SVG-Shapes
 */
export default
class Shape extends Component {

    static propTypes = {
        type: PropTypes.string.isRequired,
    };

    render() {
        const { type, ...other } = this.props;
        const d = d3.svg.symbol().type(type)();
        return <path d={d} {...other} />;
    }

}
