import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import Styles from './styles/Footer.less';

/**
 * @TODO doc
 */
export default
class Footer extends Component {

	static propTypes = {};

	render() {
		return <footer className={Styles.footer}>
			<div className="container">
				<Row><Col xs={12} sm={6} lg={8} smOffset={3} lgOffset={2}>
					<p><strong>Disclaimer:</strong> We are not saving any data you insert on the website.</p>
					<p className={Styles.printHide}>If you wish to contact us, please feel free to <a href="mailto:office@borisgloger.com?subject=Backlog%20Calculator">get in touch with us</a> - We are happy to answer your questions.</p>
				</Col></Row>
			</div>
		</footer>;
	}

}
