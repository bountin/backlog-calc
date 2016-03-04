import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

/**
 * An SVG area.
 */
export default
class Area extends Component {

    static propTypes = {
        data: PropTypes.array.isRequired,
        x: PropTypes.func.isRequired,
        y0: PropTypes.func.isRequired,
        y1: PropTypes.func.isRequired,

        scales: PropTypes.shape({
            x: PropTypes.func.isRequired,
            y: PropTypes.func.isRequired,
        }).isRequired,

        interpolate: PropTypes.string,
    };

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
        for (const key in this.props) {
            if (!this.constructor.propTypes.hasOwnProperty(key)) {
                other[key] = this.props[key];
            }
        }
        return other;
    }

    render() {
        const {
            data,
            x, y0, y1,
            scales,
            interpolate,
            } = this.props;

        const area = d3.svg.area()
            .interpolate(interpolate)
            .x(d => scales.x(x(d)))
            .y0(d => scales.y(y0(d)))
            .y1(d => scales.y(y1(d)));

        return <path
            d={area(data)}
            {...this.forwardProps()}
        />;
    }
}
