// Polyfills
import 'babel-polyfill';
import './support/Headers';

// Third party styles
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'react-datepicker/dist/react-datepicker.css';

// Internationalization
import { addLocaleData } from 'react-intl/lib/locale-data-registry';
import patchIntl from './support/PatchIntl';
import en from 'react-intl/lib/locale-data/en';
import de from 'react-intl/lib/locale-data/de';
addLocaleData(en);
addLocaleData(de);

// Start up the application
import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Root from './components/Root';

patchIntl(() => render(<Root />, document.getElementById('root')));
