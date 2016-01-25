import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Styles from './styles/header.less';
import logo from './resources/logo.png';

/**
 * @TODO doc
 */
export default
class Header extends Component {

	static propTypes = {};

	render() {
		return <header className={Styles.header}>
			<div className="container">
				<h1>
					<img src={logo} className={Styles.logo} alt="Boris Gloger" />
					Backlog Calculator
				</h1>
			</div>
		</header>;
	}

}
