import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl';
import classNames from 'classnames';

import Icon from 'react-fontawesome';
import Styles from './styles/results.less';

const messages = defineMessages({
	statusSuccess : {
		id             : 'results.statusSuccess',
		defaultMessage : 'Looks good!',
	},

	statusFailure : {
		id             : 'results.statusFailure',
		defaultMessage : 'You will not finish in time!',
	},

	completion : {
		id             : 'results.completion',
		defaultMessage : 'Expected project completion on {date}',
	},

	probability : {
		id             : 'results.probability',
		defaultMessage : 'Probability of success: {probability}',
	},

	backlogSize : {
		id             : 'results.backlogSize',
		defaultMessage : 'Maximum successful backlog size: {backlogSize}',
	},
});

/**
 * @TODO doc
 */
export default
class Results extends Component {

	static propTypes = {
		isSuccessful   : PropTypes.bool.isRequired,
		completionDate : PropTypes.object.isRequired,
		probability    : PropTypes.number.isRequired,
		backlogSize    : PropTypes.number.isRequired,
	};

	render() {
		const {
			isSuccessful,
			completionDate,
			probability,
			backlogSize,
		} = this.props;

		const resultClass = classNames(Styles.result, {
			[Styles.success] : isSuccessful,
			[Styles.failure] : !isSuccessful,
		});

		const statusMessage = isSuccessful
			? <FormattedMessage {...messages.statusSuccess} />
			: <FormattedMessage {...messages.statusFailure} />;

		return <div className={resultClass}>
			<Icon className={Styles.icon} name={isSuccessful ? 'check-circle' : 'times-circle'} />
			{isSuccessful ? '' : ''}
			<p className={Styles.description}>
				{statusMessage}
				<br />
				<FormattedMessage {...messages.completion} values={{
					date : <b><FormattedDate value={completionDate} day="numeric" month="long" year="numeric" /></b>
				}} />
				<br />
				<FormattedMessage {...messages.probability} values={{
					probability : <b><FormattedNumber value={probability} style="percent" /></b>
				}} />
				<br />
				<FormattedMessage {...messages.backlogSize} values={{
					backlogSize : <b><FormattedNumber value={backlogSize} /></b>
				}} />
			</p>
		</div>;
	}

}
