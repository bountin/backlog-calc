import React, { Component, PropTypes } from 'react';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import DatePicker from 'react-datepicker';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import FormattedMultiLine from './formatted-multi-line';
import { validateInputs } from '../utils/validators';

import Styles from './styles/form.less';

const LABEL_CLASS_NAME = 'col-xs-12 col-sm-3 col-md-2';
const WRAPPER_CLASS_NAME = 'col-xs-12 col-sm-9 col-md-10 col-md-8';

const messages = defineMessages({

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

    submitLabel: {
        id: 'calculator.submitLabel',
        defaultMessage: 'Save',
    },

});

/**
 * @TODO doc
 */
export class CalculatorForm extends Component {

    static propTypes = {
        /**
         * Injected internationalization by react-intl's injectIntl().
         */
        intl: PropTypes.object.isRequired,

        project: PropTypes.object.isRequired,

        onSave: PropTypes.func,
    };

    static defaultProps = {
        onSave: () => {},
    };

    state = {

        /**
         * Parsed values of inputs entered into this component.
         * The inputs are parsed in getInputs.
         */
        inputs: {
        },

        /**
         * Validation errors that occurred during the latest submit. The errors
         * are recomputed on every submit and displayed subsequently.
         *
         * This object must never be null!
         */
        errors: {},

    };

    constructor(props) {
        super(props);
        /* eslint react/no-direct-mutation-state:0 */
        this.state.inputs = { ...props.project };

        this.handleFormSubmit = ::this.handleFormSubmit;
        this.handleInputChange = ::this.handleInputChange;
    }

    componentWillReceiveProps(props) {
        this.setState({ inputs: { ...props.project } });
    }

    /**
     * Parses all input values and removes results from the state.
     *
     * @private
     */
    handleInputChange() {
        this.setState({ inputs: this.getInputs() });
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

        const { inputs } = this.state;
        const errors = validateInputs(inputs);
        this.setState({ errors });
        if (Object.keys(errors).length) {
            return false;
        }

        this.props.onSave(inputs);
        return false;
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
    getInputs() {
        return {
            id: this.state.inputs.id,
            projectName: this.refs.projectName.getValue(),
            startDate: this.refs.startDate.getValue(),
            endDate: this.refs.endDate.getValue(),
            velocity: parseInt(this.refs.velocity.getValue(), 10),
            backlogSize: parseInt(this.refs.backlogSize.getValue(), 10),
        };
    }

    render() {
        const { intl } = this.props;
        const { inputs, errors } = this.state;

        return <form
            className={classNames('form-horizontal', Styles.form)}
            onSubmit={this.handleFormSubmit}
            noValidate
        >
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
                bsStyle={errors.startDate ? 'error' : null}
            >
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
                bsStyle={errors.endDate ? 'error' : null}
            >
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
                wrapperClassName={WRAPPER_CLASS_NAME}
            >
                <Button
                    type="submit"
                    bsStyle="success"
                    className={classNames('pull-left', Styles.printHide, Styles.action)}
                >
                    <FormattedMessage {...messages.submitLabel} />
                </Button>
            </Input>

        </form>;
    }

}

export default injectIntl(CalculatorForm);
