import React, { Component, PropTypes } from 'react';
import d3 from 'd3';

const PADDING_X = 6;
const PADDING_Y = 3;

/**
 * An label with automatically adjusting background.
 */
export default
class Label extends Component {

    static propTypes = {
        text: PropTypes.string.isRequired,
        baseline: PropTypes.string,
        anchor: PropTypes.string,
        rx: PropTypes.number,
        ry: PropTypes.number,
        width: PropTypes.number,
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
        const { text, rect } = this;

        const size = text.getBBox();
        size.x -= PADDING_X;
        size.y -= PADDING_Y;
        size.width += 2 * PADDING_X;
        size.height += 2 * PADDING_Y;

        d3.select(rect).attr(size);
    }

    render() {
        const { text, baseline, anchor, rx, ry } = this.props;
        const style = { textAnchor: anchor, alignmentBaseline: baseline };

        return <g {...this.forwardProps()}>
            <rect ref={c => { this.rect = c; }} rx={rx} ry={ry} width={this.props.width} />
            <text ref={c => { this.text = c; }} children={text} style={style} />
        </g>;
    }

}
