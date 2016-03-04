import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

/**
 * Axis for SVG charts, including labels.
 */
export default
class Axis extends Component {

    static propTypes = {
        scale: PropTypes.func.isRequired,
        orientation: PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
        tickFormat: PropTypes.func,
        tickPadding: PropTypes.number,
        innerTickSize: PropTypes.number,
        outerTickSize: PropTypes.number,
        label: PropTypes.string,
    };

    static defaultProps = {
        tickPadding: 0,
        innerTickSize: 3,
        outerTickSize: 6,
    };

    componentDidMount() {
        this.renderAxis();
    }

    componentDidUpdate() {
        this.renderAxis();
    }

    /**
     * Calculates the size of the axis in pixels.
     *
     * @returns {number} The size in pixels.
     * @private
     */
    getAxisSize() {
        const [min, max] = this.props.scale.range();
        return Math.abs(max - min);
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
        for (const key in this.props) {
            if (!this.constructor.propTypes.hasOwnProperty(key)) {
                other[key] = this.props[key];
            }
        }
        return other;
    }

    /**
     * Renders the axis into the DOM node using D3.
     * @private
     */
    renderAxis() {
        const axis = d3.svg.axis()
            .scale(this.props.scale)
            .orient(this.props.orientation)
            .tickFormat(this.props.tickFormat)
            .innerTickSize(this.props.innerTickSize)
            .outerTickSize(this.props.outerTickSize)
            .tickPadding(this.props.tickPadding);

        d3.select(this.node).call(axis);
    }

    render() {
        const { orientation, label } = this.props;
        let x;
        let y;
        let transform;
        let baseline;

        if (orientation === 'left' || orientation === 'right') {
            x = 0;
            transform = 'rotate(-90)';
        } else {
            x = this.getAxisSize();
            transform = '';
        }

        if (orientation === 'left' || orientation === 'top') {
            y = 6;
            baseline = 'hanging';
        } else {
            y = -6;
            baseline = 'baseline';
        }

        return <g ref={c => { this.node = c; }} {...this.forwardProps()}>
            <text
                children={label}
                transform={transform}
                x={x} y={y}
                style={{
                    textAnchor: 'end',
                    alignmentBaseline: baseline,
                }}
            />
        </g>;
    }

}
