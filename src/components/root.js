import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import * as messages from '../messages';

import Calculator from './calculator';
import Header from './header';
import Footer from './footer';

import './assets/stratum.css';
import './styles/root.less';

/**
 * The application root component. It initializes all providers:
 *
 *  - IntlProvider: Provides i18n messages to react-intl components and
 *    injectIntl. The default language is obtained from the browser.
 *    Locale data is loaded from ../messages.
 *
 * This component is pure.
 */
export default
class Root extends Component {

	state = {};

	/**
	 * @inheritDoc
	 */
	render() {
		const locale = this.state.locale
			|| navigator.language
			|| navigator.browserLanguage;

		const intlData = {
			locale,
			messages: messages[locale] || messages[locale.match(/\w+/)[0]],
		};

		return <IntlProvider key="intl" {...intlData}>

			<div>
				<Header />
				<Calculator />
				<Footer />
			</div>

		</IntlProvider>;
	}

}
