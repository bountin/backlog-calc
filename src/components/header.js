import React, { Component } from 'react';

import Container from './container';
import Styles from './styles/header.less';
import logo from './assets/logo.png';

/**
 * Application header featuring the application logo and title.
 *
 * This component is pure.
 */
export default
class Header extends Component {

	/**
	 * @inheritDoc
	 */
	render() {
		return <header className={Styles.header}>
			<Container>
				<h1>

					<img
						src={logo}
						className={Styles.logo}
						alt="Boris Gloger"
					/>

					<span className={Styles.title}>
						Backlog Calculator
					</span>

				</h1>
			</Container>
		</header>;
	}

}
