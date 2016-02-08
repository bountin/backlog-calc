import React from 'react';

const intl = {
	formatMessage(message) {
		return '' + message.id;
	}
};

export function defineMessages(messages) {
	return messages;
}

export function injectIntl(Component) {
	return class IntlComponent extends React.Component {
		render() { return <Component intl={intl} {...this.props} />; }
	};
}
