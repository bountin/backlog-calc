import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

/**
 * An bar with centered text.
 */
export default
class Bar extends Component {

    static propTypes = {
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        rx: PropTypes.number,
        ry: PropTypes.number,

        text: PropTypes.string,
        baseline: PropTypes.string,
        anchor: PropTypes.string,

        onClick: PropTypes.func,
    };

    static defaultProps = {
        rx: 0,
        ry: 0,
    };

    componentDidMount() {
        this.updateTextSize();
    }

    componentDidUpdate() {
        this.updateTextSize();
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
     * Resizes the background rect based on the text element.
     * @private
     */
    updateTextSize() {
        const { text } = this;
        const { height, width } = this.props;

        if (!this.props.text) {
            return;
        }

        const size = text.getBBox();
        d3.select(text).attr({
            x: (width - size.width) / 2,
            y: height / 2,
            'alignment-baseline': 'central',
        });
    }

    render() {
        const { text, baseline, anchor, rx, ry } = this.props;
        const style = { textAnchor: anchor, alignmentBaseline: baseline };
        const { height, width } = this.props;

        return <g {...this.forwardProps()}>
            <rect ref={c => { this.rect = c; }} rx={rx} ry={ry} width={width}
                height={height} onClick={this.props.onClick}
            />
            {text && <text ref={c => { this.text = c; }} children={text} style={style}
                onClick={this.props.onClick}
            />}
        </g>;
    }

}
