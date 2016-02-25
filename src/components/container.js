import React, { Component, PropTypes } from 'react';

/**
 * Responsive layout container that wraps any children.
 *
 * This component is pure.
 */
export default
class Container extends Component {

    static propTypes = {

        /**
         * Any child elements that will be wrapped by the container.
         */
        children: PropTypes.any,

    };

    /**
     * @inheritDoc
     */
    render() {
        return <div className="container">
            {this.props.children}
        </div>;
    }

}
