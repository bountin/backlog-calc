import React, { Component, PropTypes } from 'react';
import { injectIntl, defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import moment from 'moment';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Icon from 'react-fontawesome';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';

import Styles from './styles/Calculator.less';

import {successfulProject, projectDuration, successProbability} from '../utils/calculations';
import {validateProjectDates, validateBacklogSize} from '../utils/validators';

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
		errors: {},
		result: null
	};

	render() {
		const { intl } = this.props;
		const {
			projectName,
			startDate = moment(),
			endDate = moment().add(1, 'month'),
			velocity,
			backlogSize,
			result,
			errors,
			} = this.state;

		let resultTextElement = null, resultIconElement = null, resultStyle = null;
		if (errors.overall) {
			resultIconElement = <Icon className={Styles.icon} name="times-circle" />;
			resultTextElement = <div className={Styles.status}>
				{errors.overall}
			</div>;
			resultStyle = Styles.failure;
		} else if (result != null) {
			if (result && result.reachable === true) {
				resultIconElement = <Icon className={Styles.icon} name="check-circle" />;
				resultTextElement = <div className={Styles.status}>
					<span>Looks good!</span>;
					<br />
					Expected project completion on <b>{result.expected.format("YYYY-MM-DD")}</b>.
					<br/>
					Probability of success: <b><FormattedNumber value={result.probability} style="percent" /></b>
				</div>;
				resultStyle = Styles.success;
			} else if (result && result.reachable === false) {
				resultIconElement = <Icon className={Styles.icon} name="times-circle" />;
				resultTextElement = <div className={Styles.status}>
					<span>You will not finish in time!</span>;
					<br />
					Expected project completion on <b>{result.expected.format("YYYY-MM-DD")}</b>.
					<br/>
					Probability of success: <b><FormattedNumber value={result.probability} style="percent" /></b>
				</div>;
				resultStyle = Styles.failure;
			}
		}
		let resultElement = <span className={classNames(Styles.result, resultStyle, Styles.status)}>
				<div className={Styles.statusParent}>
					{resultIconElement}
					{resultTextElement}
				</div>
			</span>;

		let invalidDatesComponent = errors.dates ? <div className="form-group"><span
			className="col-xs-offset-12 col-sm-offset-3 col-lg-offset-2 col-xs-12 col-sm-6 col-lg-8">
			Invalid Dates!
		</span></div> : null;

		let invalidBacklogSizeComponent = errors.backlogSize ? <div className="form-group"><span
			className="col-xs-offset-12 col-sm-offset-3 col-lg-offset-2 col-xs-12 col-sm-6 col-lg-8">
			Invalid Backlog Size or Velocity!
		</span></div> : null;

		return <section className="container">
			<Row>
				<Col xs={12} sm={6} lg={8} smOffset={3} lgOffset={2} className={Styles.intro}>
					<p>
						Dear ProductOwner,
					</p>
					<p>
						On this page you have the possibility to calculate, if you will be able to keep your commitment
						towards your stakeholders. If you have an estimated backlog, the velocity of the team per week,
						the start date of the project and the choosen date of delivery, you have everything that is
						necessary in order to find out if you can deliver within the given timeframe.
					</p>
					<p>
						We wish you a lot of success with your product development, <br />
						Your borisgloger-Team
					</p>
					<p>&nbsp;</p>
				</Col>
			</Row>
			<form className="form-horizontal" onSubmit={::this.recalculate}>
				<Input
					type="text"
					ref="projectName"
					value={projectName}
					label={intl.formatMessage(messages.projectNameLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-6 col-lg-8"
					onChange={::this.reset}
				/>

				<Input
					label={intl.formatMessage(messages.startDateLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-6 col-lg-8">
					<DatePicker
						ref="startDate"
						className={classNames("form-control", errors.dates ? Styles.invalidField : "")}
						locale={intl.locale}
						selected={startDate}
						maxDate={endDate}
						onChange={::this.reset}
					/>
				</Input>

				<Input
					label={intl.formatMessage(messages.endDateLabel)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-6 col-lg-8">
					<DatePicker
						ref="endDate"
						locale={intl.locale}
						className={classNames("form-control", errors.dates ? Styles.invalidField : "")}
						selected={endDate}
						minDate={startDate}
						onChange={::this.reset}
					/>
				</Input>

				{invalidDatesComponent}

				<Input
					type="number"
					ref="velocity"
					value={velocity}
					label={intl.formatMessage(messages.velocityLabel)}
					placeholder={intl.formatMessage(messages.velocityPlaceholder)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-6 col-lg-8"
					onChange={::this.reset}
					min="0"
					className={classNames(errors.backlogSize ? Styles.invalidField : "")}
				/>

				<Input
					type="number"
					ref="backlogSize"
					value={backlogSize}
					label={intl.formatMessage(messages.backlogSizeLabel)}
					placeholder={intl.formatMessage(messages.backlogSizePlaceholder)}
					labelClassName="col-xs-12 col-sm-3 col-lg-2"
					wrapperClassName="col-xs-12 col-sm-6 col-lg-8"
					onChange={::this.reset}
					min="0"
					className={classNames(errors.backlogSize ? Styles.invalidField : "")}
				/>

				{invalidBacklogSizeComponent}

				<Input wrapperClassName="col-xs-12 col-sm-6 col-lg-8 col-sm-offset-3 col-lg-offset-2">
					{(result != null) &&
					<Button bsStyle="default" className={classNames("pull-right", Styles.printHide)}
					        onClick={::this.print}>
						<FormattedMessage {...messages.printLabel} />
					</Button>}

					<Button type="submit" bsStyle="default" className={classNames(Styles.printHide, Styles.calculate)}>
						<FormattedMessage {...messages.submitLabel} />
					</Button>

					{resultElement}
				</Input>
			</form>
		</section>;
	}

	reset() {
		const projectName = this.refs.projectName.getValue();
		const startDate = this.refs.startDate.getValue();
		const endDate = this.refs.endDate.getValue();
		const velocity = parseInt(this.refs.velocity.getValue());
		const backlogSize = parseInt(this.refs.backlogSize.getValue());
		const result = null;
		const errors = {};

		this.setState({
			projectName,
			startDate   : startDate < endDate ? startDate : endDate,
			endDate     : endDate < startDate ? startDate : endDate,
			velocity    : Math.max(0, velocity),
			backlogSize : Math.max(0, backlogSize),
			result,
			errors,
		});
	}

	recalculate(e) {
		e.preventDefault();

		const projectName = this.refs.projectName.getValue();
		const startDate = this.refs.startDate.getValue();
		const endDate = this.refs.endDate.getValue();
		const velocity = parseInt(this.refs.velocity.getValue());
		const backlogSize = parseInt(this.refs.backlogSize.getValue());
		let errors = {}, hasErrors = false;
		let result = null;

		if (!validateProjectDates(startDate, endDate)) {
			errors.dates = 1;
			hasErrors = true;
			console.log("invalid dates");
		}
		if (!validateBacklogSize(backlogSize, velocity)) {
			errors.backlogSize = 1;
			hasErrors = true;
		}

		if (!hasErrors) {
			try {
				result = {
					reachable : successfulProject(startDate, endDate, velocity, backlogSize),
					expected  : projectDuration(startDate, endDate, velocity, backlogSize),
					probability: successProbability(startDate, endDate, velocity, backlogSize)
				};
			} catch (e) {
				errors.overall = e;
				result = null;
				hasErrors = true;
			}
		}

		this.setState({
			result,
			errors,
		});
	}

	print() {
		window.print();
	}

}

export default injectIntl(Calculator);
