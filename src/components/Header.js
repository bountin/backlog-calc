import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

/**
 * @TODO doc
 */
export default
class Header extends Component {

	static propTypes = {};

	render() {
		return <header>
			<div className="container">
				<h1>Ze Boris Gloger Backlog Calculator</h1>
			</div>
		</header>;
	}

}
