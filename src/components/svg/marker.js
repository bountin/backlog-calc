import React, { Component, PropTypes } from 'react';

/**
 * A horizontal marker for SVG charts.
 */
export default
class Marker extends Component {

    static propTypes = {
        x: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        className: PropTypes.string,
    };

    render() {
        const { x, top, height, className } = this.props;
        return <g className={className} transform={`translate(${x}, ${top})`}>
            <line x1="0" x2="0" y1="0" y2={height} />
            <circle r="6" cy="0" />
        </g>;
    }

}

