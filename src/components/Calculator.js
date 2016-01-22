import React, { Component, PropTypes } from 'react';
import { injectIntl, defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';

import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';

const messages = defineMessages({
	projectNameLabel : {
		id             : 'calculator.projectNameLabel',
		defaultMessage : 'Project Name',
	},

	startDateLabel : {
		id             : 'calculator.startDateLabel',
		defaultMessage : 'Start Date',
	},

	endDateLabel : {
		id             : 'calculator.endDateLabel',
		defaultMessage : 'Target Date',
	},

	velocityLabel : {
		id             : 'calculator.velocityLabel',
		defaultMessage : 'Velocity',
	},

	backlogSizeLabel : {
		id             : 'calculator.backlogSizeLabel',
		defaultMessage : 'Backlog Size',
	},

	submitLabel : {
		id             : 'calculator.submit',
		defaultMessage : 'Calculate',
	}
});

/**
 * @TODO doc
 */
class Calculator extends Component {

	static propTypes = {
		intl : PropTypes.object.isRequired,
	};

	render() {
		const { intl } = this.props;

		return <section className="container">
			<form className="form-horizontal" onSubmit={::this.recalculate}>
				<Input
					type="text"
					ref="projectName"
					label={intl.formatMessage(messages.projectNameLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-9 col-lg-10"
				/>

				<Input
					label={intl.formatMessage(messages.startDateLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-9 col-lg-10">
					<DatePicker
						ref="startDate"
					/>
				</Input>

				<Input
					label={intl.formatMessage(messages.endDateLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-9 col-lg-10">
					<DatePicker
						ref="endDate"
					/>
				</Input>

				<Input
					type="number"
					ref="velocity"
					label={intl.formatMessage(messages.velocityLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-9 col-lg-10"
				/>

				<Input
					type="number"
					ref="backlogSize"
					label={intl.formatMessage(messages.backlogSizeLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-9 col-lg-10"
				/>

				<Button type="submit">
					<FormattedMessage {...messages.submitLabel} />
				</Button>
			</form>
		</section>;
	}


	recalculate(e) {
		e.preventDefault();
		const projectName = this.refs.projectName.getValue();
		const startDate = this.refs.startDate.getValue();
		const endDate = this.refs.endDate.getValue();
		const velocity = this.refs.velocity.getValue();
		const backlogSize = this.refs.backlogSize.getValue();

		// TODO: Calculate.
	}

}

export default injectIntl(Calculator);
