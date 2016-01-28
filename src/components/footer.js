import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import Styles from './styles/footer.less';

const messages = defineMessages({

	disclaimerMessage : {
		id             : 'footer.disclaimerMessage',
		defaultMessage : '{disclaimer}: We are not saving any data you insert on the website.',
	},

	disclaimer : {
		id             : 'footer.disclaimer',
		defaultMessage : 'Disclaimer',
	},

	contactMessage : {
		id             : 'footer.contactMessage',
		defaultMessage : 'If you wish to contact us, please feel free to {contactLink} – We are happy to answer your questions.',
	},

	contact : {
		id             : 'footer.contact',
		defaultMessage : 'get in touch with us',
	},

	floorMessage : {
		id             : 'footer.floorMessage',
		defaultMessage : 'This Backlog Calculator was developed in cooperation with {floorLink}.',
	},

});

/**
 * @TODO doc
 */
export default
class Footer extends Component {

	static propTypes = {};

	render() {
		return <footer className={Styles.footer}>
			<div className="container">
				<Row>
					<Col xs={12} sm={9} md={10} lg={8} smOffset={3} mdOffset={2}>
						<p>
							<FormattedMessage {...messages.disclaimerMessage} values={{
								disclaimer : <strong><FormattedMessage {...messages.disclaimer} /></strong>,
							}} />
						</p>
						<p className={Styles.printHide}>
							<FormattedMessage {...messages.contactMessage} values={{
								contactLink : <a href="mailto:office@borisgloger.com?subject=Backlog%20Calculator">
									<FormattedMessage {...messages.contact} />
								</a>,
							}} />
						</p>
					</Col>
				</Row>
				<Row className={Styles.floor}>
					<Col xs={4} sm={3} md={2}>
						<svg className={Styles.logo} viewBox="0 0 319.9 137.9">
							<path className="st0" d="M177.7,63.3c0-11.4,14.8-13.3,14.8-19.6c0-2.8-2.1-4.4-4.8-4.4c-2.3,0-3.9,1.4-4.7,2.4
							c-0.8,0.8-1.7,1.2-2.6,0.4l-1.2-0.9c-0.9-0.7-1.2-1.6-0.5-2.5c1.4-1.8,4.3-4.8,9.5-4.8c5.5,0,10.3,3.4,10.3,9.4
							c0,10.2-14.2,11.9-14.5,17.9h13.1c1.2,0,1.9,0.6,1.9,1.8v1.2c0,1.3-0.6,1.9-1.9,1.9h-17.4c-1.2,0-2-0.6-2-1.9V63.3z"></path>
							<path className="st0" d="M203.6,60.9l0.9-1.3c0.7-1,1.5-1.1,2.5-0.4c1,0.8,2.8,2,5.3,2c3.1,0,5.9-2.1,5.9-5.4c0-3.3-2.7-5.5-6.3-5.5
							c-1.6,0-2.9,0.5-3.7,0.8c-0.9,0.3-1.7,0.4-2.5,0.1l-0.4-0.1c-1-0.4-1.5-1.1-1.4-2.2l1.2-12.6c0.1-1.2,0.8-1.8,1.9-1.8h13
							c1.3,0,1.9,0.7,1.9,1.9v1.3c0,1.2-0.6,1.8-1.9,1.8h-9.8l-0.5,5.2c0,0.8-0.2,1.5-0.2,1.5h0.1c0,0,1.5-0.7,3.4-0.7
							c7,0,11.2,4.7,11.2,10.4c0,6.3-4.9,10.9-11.4,10.9c-4.4,0-7.4-1.9-8.9-3.2C203,62.8,203,61.8,203.6,60.9z"></path>
							<path className="st0" d="M233.8,37.2h-4.7c-0.7,0-1-0.3-1-1v-0.7c0-0.7,0.3-1,1-1h12.6c0.7,0,1,0.4,1,1v0.7c0,0.7-0.3,1-1,1H237v13.8
							c0,0.7-0.3,1-1,1h-1.1c-0.7,0-1-0.3-1-1V37.2z"></path>
							<path className="st0" d="M245.9,35.5c0-0.7,0.3-1,1-1h1.1c0.7,0,1,0.4,1,1v6.4h8v-6.4c0-0.7,0.3-1,1-1h1.1c0.7,0,1,0.4,1,1v15.5
							c0,0.7-0.3,1-1,1h-1.1c-0.7,0-1-0.3-1-1v-6.3h-8v6.3c0,0.7-0.3,1-1,1h-1.1c-0.7,0-1-0.3-1-1V35.5z"></path>

							<path className="st0" d="M178.1,79.2c0-1.2,0.6-1.9,1.8-1.9h14.5c1.2,0,1.9,0.7,1.9,1.9v1.3c0,1.2-0.7,1.8-1.9,1.8h-10.6v9h8.7
							c1.2,0,1.9,0.6,1.9,1.8v1.3c0,1.2-0.7,1.9-1.9,1.9h-8.7v10.9c0,1.3-0.6,1.9-1.8,1.9h-2.1c-1.2,0-1.8-0.6-1.8-1.9V79.2z"></path>
							<path className="st0" d="M201.9,79.2c0-1.2,0.6-1.9,1.8-1.9h2.1c1.2,0,1.8,0.7,1.8,1.9v24.9h11.8c1.3,0,1.9,0.6,1.9,1.8v1.2
							c0,1.3-0.6,1.9-1.9,1.9h-15.7c-1.2,0-1.8-0.6-1.8-1.9V79.2z"></path>
							<path className="st0" d="M238.6,76.8c9.6,0,16.4,7.1,16.4,16.2c0,9.3-6.8,16.6-16.4,16.6c-9.6,0-16.4-7.3-16.4-16.6
							C222.2,83.9,229,76.8,238.6,76.8z M238.6,104.3c6.1,0,10.5-4.9,10.5-11.4c0-6.2-4.4-10.9-10.5-10.9c-6.1,0-10.5,4.7-10.5,10.9
							C228.1,99.4,232.5,104.3,238.6,104.3z"></path>
							<path className="st0" d="M275,76.8c9.6,0,16.4,7.1,16.4,16.2c0,9.3-6.8,16.6-16.4,16.6c-9.6,0-16.4-7.3-16.4-16.6
							C258.6,83.9,265.4,76.8,275,76.8z M275,104.3c6.1,0,10.5-4.9,10.5-11.4c0-6.2-4.4-10.9-10.5-10.9c-6.1,0-10.5,4.7-10.5,10.9
							C264.5,99.4,268.9,104.3,275,104.3z"></path>
							<path className="st0" d="M296.8,79.2c0-1.2,0.6-1.9,1.8-1.9h8.6c3.1,0,4.7,0.3,6,0.8c3.2,1.3,5.3,4.4,5.3,8.7c0,3.8-2,7.3-5.3,8.7v0.1
							c0,0,0.4,0.5,1,1.7l5.2,9.6c0.8,1.3,0.2,2.2-1.3,2.2h-2.4c-1,0-1.7-0.4-2.2-1.3l-5.6-10.5h-5.5v10c0,1.3-0.6,1.9-1.8,1.9h-2.1
							c-1.2,0-1.8-0.6-1.8-1.9V79.2z M307.7,92.2c3.1,0,5-1.9,5-5c0-2-0.8-3.6-2.5-4.3c-0.8-0.4-1.7-0.5-3.4-0.5h-4.2v9.9H307.7z"></path>

							<path className="st0" d="M105.2,60.9c-0.7-0.7-1.3-1-2.1-1c-0.2,0-0.5,0-0.8,0.1c-0.1,0-0.3,0.1-0.4,0.1c0,0,0,0-0.1,0L98.7,61
							c-0.5,0.1-0.8,0.5-0.9,0.9c-0.2,0.6,0.1,1.3,0.8,2l1.7,1.6c0.1,0.1,0.1,0.2,0.2,0.2l12.7,12.4c0,0-40.8,10-41.4,10.2
							c-0.8,0.2-1.2,0.5-1.3,1c-0.1,0.6,0.3,1,0.4,1.1l2.6,2.6c0.1,0.1,0.2,0.3,0.4,0.4l0.4,0.4c0.3,0.3,0.9,0.5,1.4,0.5
							c0.1,0,0.3,0,0.4,0l44.6-11c1.2-0.3,2.1-1.2,2.4-2.4c0.3-1.2,0-2.4-0.9-3.3L105.2,60.9z"></path>
							<path className="st0" d="M157.4,36.1c0-0.9-0.4-1.8-1-2.4L123.2,1c-0.8-0.8-2-1.1-3.2-0.9L53.6,16.3C52.1,16.7,51,18,51,19.6l0,15.8
							l0,6c0,1.1,0.9,2,2,2h1.4h0h1.4c1.1,0,2-0.9,2-2l0-17.4L72,37.8c0.7,0.7,1.3,1,2.1,1c0.2,0,0.5,0,0.8-0.1c0.1,0,3.5-1,3.5-1
							c0.5-0.1,0.8-0.5,0.9-0.9c0.2-0.6-0.1-1.3-0.8-2L64.1,20.7l55.7-13.6L145,31.9L24.2,61.8C23,62.1,22,63,21.7,64.2
							c-0.3,1.2,0,2.4,0.9,3.3l53.5,52l-45.6,11.3L10,110.7c0,0,30.3-7.4,31-7.6c0.8-0.2,1.2-0.5,1.3-1c0.1-0.6-0.3-1-0.4-1.1l-3.4-3.3
							c-0.3-0.3-0.9-0.5-1.4-0.5c-0.1,0-0.3,0-0.4,0L36,97.3c0,0,0,0,0,0l-33.4,8.3c-1.2,0.3-2.1,1.2-2.4,2.4c-0.3,1.2,0,2.4,0.9,3.3
							L27.2,137c0.6,0.6,1.5,1,2.4,1c0.3,0,0.5,0,0.8-0.1l53.3-13.2c1.2-0.3,2.1-1.2,2.4-2.4c0.3-1.2,0-2.4-0.9-3.3l-53.5-52l119-29.4
							l0,21.7c0,1.1,0.9,2,2,2h2.8c1.1,0,2-0.9,2-2L157.4,36.1z"></path>
						</svg>
					</Col>
					<Col xs={8} sm={9} md={10} lg={8}>
						<FormattedMessage {...messages.floorMessage} values={{
							floorLink : <a href="http://25th-floor.com" target="_blank">25th-floor</a>,
						}} />
					</Col>
				</Row>
			</div>
		</footer>;
	}

}
