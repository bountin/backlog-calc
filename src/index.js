// Polyfills
import 'babel-polyfill';
import './support/fetch';

// Third party styles
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'react-datepicker/dist/react-datepicker.css';

// Internationalization
import { addLocaleData } from 'react-intl/lib/locale-data-registry';
import patchIntl from './support/patch-intl';
import en from 'react-intl/lib/locale-data/en';
import de from 'react-intl/lib/locale-data/de';
addLocaleData(en);
addLocaleData(de);

// Start up the application
import React from 'react';
import { render } from 'react-dom';
import Root from './components/root';

patchIntl(() => render(<Root />, document.getElementById('root')));
