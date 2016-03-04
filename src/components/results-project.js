import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import Bar from './svg/bar';
import Styles from './styles/chart.less';

/**
 * Displays a containing the account balance history, events of active
 * scenarios and a marker for the current date. On mouse over, a little
 * indicator displays additional information to the hovered date.
 */
export default
class ResultsProject extends Component {

    static propTypes = {

        /**
         *  Project ID
         */
        id: PropTypes.number.isRequired,

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

        /**
         * Name of the project
         */
        projectName: PropTypes.string,

        /**
         * Optional class name for the chart wrapper
         */
        className: PropTypes.string,

        /**
         * Chart scales
         */
        scales: PropTypes.object,

        onSelect: PropTypes.func,
    };

    render() {
        const {
            startDate,
            endDate,
            backlogSize,
            completionDate,
            probability,
            scales,
        } = this.props;

        const extendedBarLength = Math.abs(scales.x(completionDate) - scales.x(endDate));
        const renderExtendedBar = !completionDate.isSame(endDate);
        const isPositive = completionDate.isBefore(endDate);

        const barEndDate = moment.min(endDate, completionDate);
        const circleWidth = scales.x(barEndDate) - 30;

        return <g>
            {renderExtendedBar &&
            <Bar
                transform={`translate(${scales.x(barEndDate)}, 0)`}
                text={ `${String(completionDate.diff(endDate, 'days'))} d` }
                height={scales.y.rangeBand()}
                width={extendedBarLength}
                className={classNames(Styles.extension, isPositive && Styles.positiveExtension)}
                rx={4}
                ry={4}
                onClick={this.props.onSelect}
            />
            }

            <Bar
                transform={`translate(${scales.x(startDate)}, 0)`}
                text={String(backlogSize)}
                height={scales.y.rangeBand()}
                width={scales.x(barEndDate) - scales.x(startDate)}
                className={Styles.project}
                rx={4}
                ry={4}
                onClick={this.props.onSelect}
            />

            <circle
                transform={`translate(${circleWidth}, 0)`}
                cx="10"
                cy="20"
                r="10"
                className={ classNames({
                    [Styles.ok]: probability >= 1,
                    [Styles.warning]: probability >= 0.8 && probability < 1,
                    [Styles.error]: probability < 0.8,
                    [Styles.semaphore]: true,
                }) }
            />
        </g>;
    }

}
