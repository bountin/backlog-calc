import React, { Component, PropTypes } from 'react';
import { injectIntl, defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import moment from 'moment';

import Icon from 'react-fontawesome';
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

	state = {};

	render() {
		const { intl } = this.props;
		const { startDate, endDate, result } = this.state;

		let resultElement = null;
		if (result === true) {
			resultElement = <Icon name="check-circle" />;
		} else if (result === false) {
			resultElement = <Icon name="times-circle" />;
		}

		return <section className="container">
			<form className="form-horizontal" onSubmit={::this.recalculate}>
				<Input
					type="text"
					ref="projectName"
					label={intl.formatMessage(messages.projectNameLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-9 col-lg-10"
					onChange={::this.reset}
				/>

				<Input
					label={intl.formatMessage(messages.startDateLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-9 col-lg-10">
					<DatePicker
						ref="startDate"
						locale={intl.locale}
						selected={startDate || moment()}
						maxDate={endDate}
						onChange={::this.reset}
					/>
				</Input>

				<Input
					label={intl.formatMessage(messages.endDateLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-9 col-lg-10">
					<DatePicker
						ref="endDate"
						locale={intl.locale}
						selected={endDate || moment().add(1, 'month')}
						minDate={startDate}
						onChange={::this.reset}
					/>
				</Input>

				<Input
					type="number"
					ref="velocity"
					label={intl.formatMessage(messages.velocityLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-9 col-lg-10"
					onChange={::this.reset}
					min="0"
				/>

				<Input
					type="number"
					ref="backlogSize"
					label={intl.formatMessage(messages.backlogSizeLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-9 col-lg-10"
					onChange={::this.reset}
					min="0"
				/>

				<Input wrapperClassName="col-xs-12 col-sm-9 col-lg-10 col-sm-offset-3 col-lg-offset-2">
					<Button type="submit" bsStyle="primary">
						<FormattedMessage {...messages.submitLabel} />
					</Button>

					{resultElement}
				</Input>
			</form>
		</section>;
	}

	reset() {
		const startDate = this.refs.startDate.getValue();
		const endDate = this.refs.endDate.getValue();
		const result = null;

		this.setState({
			startDate,
			endDate,
			result,
		});
	}

	recalculate(e) {
		e.preventDefault();

		const projectName = this.refs.projectName.getValue();
		const startDate = this.refs.startDate.getValue();
		const endDate = this.refs.endDate.getValue();
		const velocity = this.refs.velocity.getValue();
		const backlogSize = this.refs.backlogSize.getValue();

		this.setState({
			result: true,
		});
	}

}

export default injectIntl(Calculator);
