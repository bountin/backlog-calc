import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

/**
 * An SVG Line series.
 */
export default
class Line extends Component {

    static propTypes = {
        data: PropTypes.array.isRequired,
        x: PropTypes.func.isRequired,
        y: PropTypes.func.isRequired,

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
            x, y,
            scales,
            interpolate,
        } = this.props;

        const line = d3.svg.line()
            .interpolate(interpolate)
            .x(d => scales.x(x(d)))
            .y(d => scales.y(y(d)));

        return <path
            d={line(data)}
            {...this.forwardProps()}
        />;
    }

}

