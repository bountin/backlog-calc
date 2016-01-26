import React, { Component, PropTypes } from 'react';
import { injectIntl, defineMessages, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import moment from 'moment';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Icon from 'react-fontawesome';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Results from './results';

import Styles from './styles/calculator.less';

import {
	isSuccessful,
	successDuration,
	successProbability,
	successBacklogSize,
} from '../utils/calculations';
import { validateInputs } from '../utils/validators';

const messages = defineMessages({
	introMessage : {
		id             : 'calculator.introMessage',
		defaultMessage : `Dear ProductOwner,
<br />
<br />
On this page you have the possibility to calculate, if you will be able to keep your commitment
towards your stakeholders. If you have an estimated backlog, the velocity of the team per week,
the start date of the project and the choosen date of delivery, you have everything that is
necessary in order to find out if you can deliver within the given timeframe.
<br />
<br />
We wish you a lot of success with your product development,
<br />
Your borisgloger-Team
<br />
<br />`,
	},

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

	velocityPlaceholder : {
		id             : 'calculator.velocityPlaceholder',
		defaultMessage : 'Story Points per week',
	},

	backlogSizeLabel : {
		id             : 'calculator.backlogSizeLabel',
		defaultMessage : 'Backlog Size',
	},

	backlogSizePlaceholder : {
		id             : 'calculator.backlogSizePlaceholder',
		defaultMessage : 'Total Story Points',
	},

	printLabel : {
		id             : 'calculator.printLabel',
		defaultMessage : 'Print',
	},

	submitLabel : {
		id             : 'calculator.submitLabel',
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

	state = {
		inputs  : {
			startDate : moment().startOf('day'),
			endDate   : moment().startOf('day').add(1, 'month'),
		},
		errors  : {},
		results : null,
	};

	render() {
		const { intl } = this.props;
		const {
			inputs,
			results,
			errors,
		} = this.state;

		return <section className="container">
			<Row>
				<Col xs={12} sm={9} md={10} lg={8} smOffset={3} mdOffset={2} className={Styles.intro}>
					<FormattedHTMLMessage {...messages.introMessage} />
				</Col>
			</Row>
			<form className="form-horizontal" onSubmit={::this._recalculate} noValidate>
				<Input
					type="text"
					ref="projectName"
					value={inputs.projectName}
					label={intl.formatMessage(messages.projectNameLabel)}
					labelClassName="col-xs-12 col-sm-3 col-md-2"
					wrapperClassName="col-xs-12 col-sm-9 col-md-10 col-md-8"
					onChange={::this._resetResults}
				/>

				<Input
					label={intl.formatMessage(messages.startDateLabel)}
					labelClassName="col-xs-12 col-sm-3 col-md-2"
					wrapperClassName="col-xs-12 col-sm-9 col-md-10 col-md-8"
					help={renderErrors(errors.startDate)}
					hasFeedback={!!errors.startDate}
					bsStyle={!!errors.startDate ? 'error' : null}>
					<DatePicker
						ref="startDate"
						className="form-control"
						selected={inputs.startDate}
						onChange={::this._resetResults}
					/>
				</Input>

				<Input
					label={intl.formatMessage(messages.endDateLabel)}
					labelClassName="col-xs-12 col-sm-3 col-md-2"
					wrapperClassName="col-xs-12 col-sm-9 col-md-10 col-md-8"
					help={renderErrors(errors.endDate)}
					hasFeedback={!!errors.endDate}
					bsStyle={!!errors.endDate ? 'error' : null}>
					<DatePicker
						ref="endDate"
						locale={intl.locale}
						className="form-control"
						selected={inputs.endDate}
						minDate={inputs.startDate}
						onChange={::this._resetResults}
					/>
				</Input>

				<Input
					type="number"
					ref="velocity"
					value={inputs.velocity}
					label={intl.formatMessage(messages.velocityLabel)}
					placeholder={intl.formatMessage(messages.velocityPlaceholder)}
					labelClassName="col-xs-12 col-sm-3 col-md-2"
					wrapperClassName="col-xs-12 col-sm-9 col-md-10 col-md-8"
					onChange={::this._resetResults}
					min="0"
					help={renderErrors(errors.velocity)}
					hasFeedback={!!errors.velocity}
					bsStyle={!!errors.velocity ? 'error' : null}
				/>

				<Input
					type="number"
					ref="backlogSize"
					value={inputs.backlogSize}
					label={intl.formatMessage(messages.backlogSizeLabel)}
					placeholder={intl.formatMessage(messages.backlogSizePlaceholder)}
					labelClassName="col-xs-12 col-sm-3 col-md-2"
					wrapperClassName="col-xs-12 col-sm-9 col-md-10 col-md-8"
					onChange={::this._resetResults}
					min="0"
					help={renderErrors(errors.backlogSize)}
					hasFeedback={!!errors.backlogSize}
					bsStyle={!!errors.backlogSize ? 'error' : null}
				/>

				<Input label="&nbsp;"
					labelClassName="col-xs-12 col-sm-3 col-md-2"
					wrapperClassName="col-xs-12 col-sm-9 col-md-10 col-md-8">
					<Button
						type="submit"
						bsStyle="default"
						className={classNames('pull-left', Styles.printHide, Styles.action)}>
						<FormattedMessage {...messages.submitLabel} />
					</Button>

					{(results != null) && <Button
						bsStyle="default"
						className={classNames('pull-right', Styles.printHide, Styles.action)}
						onClick={::this._print}>
						<FormattedMessage {...messages.printLabel} />
					</Button>}

					<div className={Styles.nobreak}>
						{results && <Results {...results} />}
					</div>
				</Input>
			</form>
		</section>;
	}

	_getInputs() {
		return {
			projectName : this.refs.projectName.getValue(),
			startDate   : this.refs.startDate.getValue(),
			endDate     : this.refs.endDate.getValue(),
			velocity    : parseInt(this.refs.velocity.getValue()),
			backlogSize : parseInt(this.refs.backlogSize.getValue()),
		};
	}

	_resetResults() {
		this.setState({
			inputs  : this._getInputs(),
			results : null
		});
	}

	_recalculate(e) {
		e.preventDefault();

		const inputs = this._getInputs();
		const errors = validateInputs(inputs);
		if (Object.keys(errors).length) {
			return this.setState({ errors });
		}

		const { backlogSize, velocity, startDate, endDate } = inputs;
		const duration = endDate.diff(startDate, 'days');
		const results = {
			isSuccessful   : isSuccessful(backlogSize, velocity, duration),
			completionDate : startDate.clone().add(successDuration(backlogSize, velocity), 'days'),
			probability    : successProbability(backlogSize, velocity, duration),
			backlogSize    : successBacklogSize(velocity, duration),
		};

		this.setState({ results, errors });
	}

	_print() {
		window.print();
	}

}

function renderErrors(errors = []) {
	if (!errors.length) {
		return null;
	}

	return <span>
		{errors.map(message => <span>
			<FormattedMessage {...message} />
			<br />
		</span>)}
	</span>
}

export default injectIntl(Calculator);
