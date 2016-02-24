import React from 'react';

const intl = {
	formatMessage(message) {
		return String(message.id);
	},
};

export function defineMessages(messages) {
	return messages;
}

export function injectIntl(Component) {
	return class IntlComponent extends React.Component {
		render() { return <Component intl={intl} {...this.props} />; }
	};
}

export const FormattedDate = 'div';
export const FormattedTime = 'div';
export const FormattedRelative = 'div';
export const FormattedNumber = 'div';
export const FormattedMessage = ({ id }) => <span>{id}</span>;
export const FormattedHTMLMessage = ({ id }) => <span>{id}</span>;
