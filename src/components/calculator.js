import React, { Component, PropTypes } from 'react';
import { injectIntl, defineMessages, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import classNames from 'classnames';
import moment from 'moment';

import DatePicker from 'react-datepicker';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Container from './container';
import FormattedMultiLine from './formatted-multi-line';
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
    introMessage: {
        id: 'calculator.introMessage',
        defaultMessage: `Dear ProductOwner,
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

    projectNameLabel: {
        id: 'calculator.projectNameLabel',
        defaultMessage: 'Project Name',
    },

    startDateLabel: {
        id: 'calculator.startDateLabel',
        defaultMessage: 'Start Date',
    },

    endDateLabel: {
        id: 'calculator.endDateLabel',
        defaultMessage: 'Target Date',
    },

    velocityLabel: {
        id: 'calculator.velocityLabel',
        defaultMessage: 'Velocity',
    },

    velocityPlaceholder: {
        id: 'calculator.velocityPlaceholder',
        defaultMessage: 'Story Points per week',
    },

    backlogSizeLabel: {
        id: 'calculator.backlogSizeLabel',
        defaultMessage: 'Backlog Size',
    },

    backlogSizePlaceholder: {
        id: 'calculator.backlogSizePlaceholder',
        defaultMessage: 'Total Story Points',
    },

    printLabel: {
        id: 'calculator.printLabel',
        defaultMessage: 'Print',
    },

    submitLabel: {
        id: 'calculator.submitLabel',
        defaultMessage: 'Calculate',
    },
});

const LABEL_CLASS_NAME = 'col-xs-12 col-sm-3 col-md-2';
const WRAPPER_CLASS_NAME = 'col-xs-12 col-sm-9 col-md-10 col-md-8';

/**
 * Stateful main component displaying the backlog calculator component.
 *
 * The component state stores user inputs, validation errors and computed
 * results. Whenever the user enters data, it is immediately merged into the
 * state.
 *
 * This component needs react-intl injected and is therefore only exported
 * as higher-order component. In order to import it simply use the default
 * import syntax:
 *
 * import Calculator from './calculator';
 * const Calculator = require('./calculator').default;
 *
 * If you need to access the inner component class without augmentation,
 * import the actual calculator component. it is strongly discouraged to
 * render the internal component as it might behave differently than expected
 * during development.
 *
 * import { Calculator } from './calculator';
 * const { Calculator } = require('./calculator');
 *
 * This component is not pure.
 */
export class Calculator extends Component {
    static propTypes = {
        /**
         * Injected internationalization by react-intl's injectIntl().
         */
        intl: PropTypes.object.isRequired,
    };

    state = {
        /**
         * Parsed values of inputs entered into this component.
         * The inputs are parsed in _getInputs.
         */
        inputs: {
            startDate: moment().startOf('day'),
            endDate: moment().startOf('day').add(1, 'month'),
        },

        /**
         * Validation errors that occurred during the latest submit. The errors
         * are recomputed on every submit and displayed subsequently.
         *
         * This object must never be null!
         */
        errors: {},

        /**
         * Results of the last computation, if validation succeeds, otherwise
         * null.
         */
        results: null,
    };

    constructor(props) {
        super(props);
        this.handleFormSubmit = ::this.handleFormSubmit;
        this.handleInputChange = ::this.handleInputChange;
        this.handlePrint = ::this.handlePrint;
    }

    /**
     * Parses all input values and removes results from the state.
     *
     * @private
     */
    handleInputChange() {
        this.setState({
            inputs: this._getInputs(),
            results: null,
        });
    }

    /**
     * Prevents browser form submission and recalculates the results.
     *
     * @param {Event} e - An optional event triggering this action.
     * @returns {boolean} false.
     * @private
     */
    handleFormSubmit(e) {
        e.preventDefault();
        this._recalculate();
        return false;
    }

    /**
     * Prints the current screen.
     *
     * @private
     */
    handlePrint() {
        window.print();
    }

    /**
     * Fetch and parse values from all input elements in this component and
     * maps them to a key equal to the ref. This will yield:
     *
     *  - Moments for datepickers
     *  - Integers for number inputs
     *  - Strings for all other input types
     *
     * @returns {object} An object containing all parsed input values.
     * @private
     */
    _getInputs() {
        return {
            projectName: this.refs.projectName.getValue(),
            startDate: this.refs.startDate.getValue(),
            endDate: this.refs.endDate.getValue(),
            velocity: parseInt(this.refs.velocity.getValue(), 10),
            backlogSize: parseInt(this.refs.backlogSize.getValue(), 10),
        };
    }

    /**
     * Recalculates the results based on current inputs.
     *
     * @private
     */
    _recalculate() {
        const inputs = this._getInputs();
        const errors = validateInputs(inputs);
        if (Object.keys(errors).length) {
            this.setState({ errors });
            return;
        }

        const { backlogSize, velocity, startDate, endDate } = inputs;
        const duration = endDate.diff(startDate, 'days');
        const results = {
            isSuccessful: isSuccessful(backlogSize, velocity, duration),
            probability: successProbability(backlogSize, velocity, duration),
            completionDate: startDate.clone().add(successDuration(backlogSize, velocity), 'days'),
            backlogSize: successBacklogSize(velocity, duration),
        };

        this.setState({ results, errors });
    }

    /**
     * @inheritDoc
     */
    render() {
        const { intl } = this.props;
        const {
            inputs,
            results,
            errors,
            } = this.state;

        return <Container>
            <Row>
                <Col
                    xs={12} sm={9} md={10} lg={8}
                    smOffset={3} mdOffset={2}
                    className={Styles.intro}>

                    <FormattedHTMLMessage {...messages.introMessage} />

                </Col>
            </Row>

            <form
                className="form-horizontal"
                onSubmit={this.handleFormSubmit}
                noValidate={true}>

                <Input
                    type="text"
                    ref="projectName"
                    value={inputs.projectName}
                    label={intl.formatMessage(messages.projectNameLabel)}
                    labelClassName={LABEL_CLASS_NAME}
                    wrapperClassName={WRAPPER_CLASS_NAME}
                    onChange={this.handleInputChange}
                />

                <Input
                    label={intl.formatMessage(messages.startDateLabel)}
                    labelClassName={LABEL_CLASS_NAME}
                    wrapperClassName={WRAPPER_CLASS_NAME}
                    help={<FormattedMultiLine lines={errors.startDate} />}
                    hasFeedback={!!errors.startDate}
                    bsStyle={errors.startDate ? 'error' : null}>

                    <DatePicker
                        ref="startDate"
                        className="form-control"
                        selected={inputs.startDate}
                        onChange={this.handleInputChange}
                    />

                </Input>

                <Input
                    label={intl.formatMessage(messages.endDateLabel)}
                    labelClassName={LABEL_CLASS_NAME}
                    wrapperClassName={WRAPPER_CLASS_NAME}
                    help={<FormattedMultiLine lines={errors.endDate} />}
                    hasFeedback={!!errors.endDate}
                    bsStyle={errors.endDate ? 'error' : null}>

                    <DatePicker
                        ref="endDate"
                        locale={intl.locale}
                        className="form-control"
                        selected={inputs.endDate}
                        minDate={inputs.startDate}
                        onChange={this.handleInputChange}
                    />

                </Input>

                <Input
                    type="number"
                    ref="velocity"
                    value={inputs.velocity}
                    label={intl.formatMessage(messages.velocityLabel)}
                    placeholder={intl.formatMessage(messages.velocityPlaceholder)}
                    labelClassName={LABEL_CLASS_NAME}
                    wrapperClassName={WRAPPER_CLASS_NAME}
                    onChange={this.handleInputChange}
                    min="0"
                    help={<FormattedMultiLine lines={errors.velocity} />}
                    hasFeedback={!!errors.velocity}
                    bsStyle={errors.velocity ? 'error' : null}
                />

                <Input
                    type="number"
                    ref="backlogSize"
                    value={inputs.backlogSize}
                    label={intl.formatMessage(messages.backlogSizeLabel)}
                    placeholder={intl.formatMessage(messages.backlogSizePlaceholder)}
                    labelClassName={LABEL_CLASS_NAME}
                    wrapperClassName={WRAPPER_CLASS_NAME}
                    onChange={this.handleInputChange}
                    min="0"
                    help={<FormattedMultiLine lines={errors.backlogSize} />}
                    hasFeedback={!!errors.backlogSize}
                    bsStyle={errors.backlogSize ? 'error' : null}
                />

                <Input
                    label="&nbsp;"
                    labelClassName={LABEL_CLASS_NAME}
                    wrapperClassName={WRAPPER_CLASS_NAME}>

                    <Button
                        type="submit"
                        bsStyle="default"
                        className={classNames('pull-left', Styles.printHide, Styles.action)}>

                        <FormattedMessage {...messages.submitLabel} />

                    </Button>

                    {(results != null) && <Button
                        bsStyle="default"
                        className={classNames('pull-right', Styles.printHide, Styles.action)}
                        onClick={this.handlePrint}>

                        <FormattedMessage {...messages.printLabel} />

                    </Button>}

                    <div className={Styles.nobreak}>
                        {results && <Results {...results} />}
                    </div>

                </Input>

            </form>
        </Container>;
    }
}

export default injectIntl(Calculator);
