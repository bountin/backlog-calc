import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl';
import classNames from 'classnames';

import Icon from 'react-fontawesome';
import Styles from './styles/results.less';

const messages = defineMessages({
    statusSuccess: {
        id: 'results.statusSuccess',
        defaultMessage: 'Looks good!',
    },

    statusFailure: {
        id: 'results.statusFailure',
        defaultMessage: 'You will not finish in time!',
    },

    completion: {
        id: 'results.completion',
        defaultMessage: 'Expected project completion on {date}',
    },

    probability: {
        id: 'results.probability',
        defaultMessage: 'Probability of success: {probability}',
    },

    backlogSize: {
        id: 'results.backlogSize',
        defaultMessage: 'Maximum successful backlog size: {backlogSize}',
    },

    unnamedProject: {
        id: 'results.unnamedProject',
        defaultMessage: 'Unnamed project',
    },
});

/**
 * Displays backlog calculation results.
 *
 * This component must be rendered with all properties fully populated. All
 * data is internally internationalized.
 *
 * This component is pure.
 */
export default
class ResultsProjectText extends Component {

    static propTypes = {
        /**
         * Name of the project
         */
        projectName: PropTypes.string,

        /**
         * Boolean, whether the project is likely to be finished successfully
         * in time with the given input data.
         */
        isSuccessful: PropTypes.bool.isRequired,

        /**
         * Likely completion date of the project (moment.js).
         */
        completionDate: PropTypes.object.isRequired,

        /**
         * The probability of timely success. Number between 0 and 1.
         */
        probability: PropTypes.number.isRequired,

        /**
         * Maximum backlog size that can be completed within the given time
         * frame. Number greater or equal to zero.
         */
        backlogSize: PropTypes.number.isRequired,

        /**
         * Start Date of the Project
         */
        startDate: PropTypes.object.isRequired,

        /**
         * End Date of the Project
         */
        endDate: PropTypes.object.isRequired,
    };

    /**
     * @inheritDoc
     */
    render() {
        const {
            projectName,
            isSuccessful,
            completionDate,
            probability,
            backlogSize,
        } = this.props;

        const resultClass = classNames(Styles.result, {
            [Styles.success]: isSuccessful,
            [Styles.failure]: !isSuccessful,
        });

        const statusMessage = isSuccessful
            ? <FormattedMessage {...messages.statusSuccess} />
            : <FormattedMessage {...messages.statusFailure} />;

        return <div className={Styles.screenHide}>

            <div className={classNames(resultClass, Styles.projectHead)}>
                <Icon className={Styles.icon} name={isSuccessful ? 'check-circle' : 'times-circle'} />
                <p className={Styles.name}>
                    <span>{projectName || messages.unnamedProject.defaultMessage}</span>
                </p>
            </div>
            <p className={Styles.description}>
                {statusMessage}

                <br />

                <FormattedMessage {...messages.completion} values={{
                    date: <b>
                        <FormattedDate
                            value={completionDate}
                            day="numeric"
                            month="long"
                            year="numeric"
                        />
                    </b>,
                }}
                />

                <br />

                <FormattedMessage {...messages.probability} values={{
                    probability: <b>
                        <FormattedNumber
                            value={probability}
                            style="percent"
                        />
                    </b>,
                }}
                />

                <br />

                <FormattedMessage {...messages.backlogSize} values={{
                    backlogSize: <b>
                        <FormattedNumber value={backlogSize} />
                    </b>,
                }}
                />
            </p>
        </div>;
    }

}
