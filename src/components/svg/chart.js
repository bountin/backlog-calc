import React, { Component, PropTypes } from 'react';

/**
 * An SVG chart base component.
 */
export default
class Chart extends Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        padding: PropTypes.any,
        children: PropTypes.any,
    };

    static defaultProps = {
        padding: {},
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
    parsePadding(prop) {
        const propObject = typeof prop === 'string'
            // Do not call .map(parseInt) directly; this results in NaN!
            ? prop.split(/\s*,\s*/).map(s => parseInt(s, 10))
            : prop;

        if (propObject instanceof Array) {
            const [top, right, bottom = top, left = right] = propObject;
            return { top, right, bottom, left };
        } else {
            const { top = 0, right = 0, bottom = 0, left = 0 } = propObject;
            return { top, right, bottom, left };
        }
    }

    render() {
        const { width, height, padding, children } = this.props;
        const parsedPadding = this.parsePadding(padding);

        return <svg
            width={ width + parsedPadding.left + parsedPadding.right }
            height={ height + parsedPadding.top + parsedPadding.bottom }
            {...this.forwardProps()}
        >
            <g transform={`translate(${parsedPadding.left}, ${parsedPadding.right})`}>
                {children}
            </g>
        </svg>;
    }

}
