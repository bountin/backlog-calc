import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';

class Root extends Component {

	render () {
		return <h1>It works!</h1>;
	}
}

render(<Root />, document.getElementById('root'));
