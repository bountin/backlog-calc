import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

/**
 * Renders several lines of text with line breaks. Each line is translated
 * via react-intl's FormattedMessage.
 */
export default
class FormattedMultiLine extends Component {

	static propTypes = {

		/**
		 * The text to render in lines. This prop can either be a string
		 * with several new lines or an array of strings.
		 */
		lines: PropTypes.arrayOf(PropTypes.object.isRequired),

	};

	/**
	 * @inheritDoc
	 */
	render() {
		let { lines = [] } = this.props;

		if (lines.constructor === String) {
			lines = lines.split(/\n+/g);
		}

		if (lines.constructor !== Array || lines.length <= 0) {
			return null;
		}

		return <span>
			{lines.map(message => <span key={message.id}>
				<FormattedMessage {...message} />
				<br />
			</span>)}
		</span>;
	}

}
