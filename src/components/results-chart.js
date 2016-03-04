import d3 from 'd3';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import Axis from './svg/axis';
import Chart from './svg/chart';
import Styles from './styles/chart.less';
import ResultsProject from './results-project';

/**
 * Displays a containing the account balance history, events of active
 * scenarios and a marker for the current date. On mouse over, a little
 * indicator displays additional information to the hovered date.
 */
export default
class ResultsChart extends Component {

    static propTypes = {

        results: PropTypes.arrayOf(PropTypes.shape({

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

        })).isRequired,

        /**
         * Optional class name for the chart wrapper
         */
        className: PropTypes.string,

    };

    constructor(props) {
        super(props);
        this.resize = ::this.resize;

        this.state = {
            padding: { top: 40, right: 0, bottom: 0, left: 100 },
        };
    }

    componentDidMount() {
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillReceiveProps(props) {
        const { balance } = props;
        if (balance && balance.length) {
            this.setState({ scales: this.computeScales(props, this.state.size) });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    /**
     * 
     * @param results
     * @param size
     * @returns {{x: *, y: *}}
     */
    computeScales(results, size) {
        const startDate = moment.min(results.map( p => p.startDate ));
        const endDate = moment.max(results.map( p => p.endDate ));
        const completionDate = moment.max(results.map( p => p.completionDate ));

        const maxDate = moment.max(endDate, completionDate);
        return {
            x: d3.time.scale()
                .range([0, size.width])
                .domain([
                    startDate.clone().subtract(1, 'week'),
                    maxDate.clone().add(1, 'week'),
                ]),
            y: d3.scale.ordinal()
                .domain(['Project'])
                .rangeRoundBands([0, size.height], 0.1, 0.2),
        };
    }

    /**
     * @TODO doc
     * @private
     */
    resize() {
        const container = this.node;
        const { padding } = this.state;
        const size = {
            width: container.clientWidth - padding.left - padding.right,
            height: container.clientHeight - padding.top - padding.bottom,
        };

        // quickfix height if we are mounting the component since the graph has
        // not rendered yet.
        size.height = size.height > 100 ? size.height : 100; // @TODO

        this.setState({
            size,
            scales: this.computeScales(this.props, size),
        });
    }

    render() {
        const {
            scales,
            size,
            padding,
        } = this.state;

        if (!size || !scales) {
            return <div ref={ c => { this.node = c; }} />;
        }

        const formatDate = d => moment(d).format('DD.MM');
        // const barEndDate = moment.min(endDate, completionDate);

        return <div className={this.props.className} ref={ c => { this.node = c; }}>
            <Chart
                width={size.width}
                height={size.height}
                padding={padding}
                className={classNames(Styles.chart)}
            >

                <Axis
                    orientation="top"
                    scale={scales.x}
                    tickFormat={formatDate}
                    tickPadding={15}
                    innerTickSize={-size.height}
                    outerTickSize={0.25}
                    className={classNames(Styles.axis, Styles.x)}
                />

                <Axis
                    orientation="left"
                    scale={scales.y}
                    ticks={4}
                    tickPadding={-size.width + 10}
                    innerTickSize={size.width}
                    outerTickSize={0.25}
                    className={classNames(Styles.axis, Styles.y)}
                    clipPath="url(#graph-clip)"
                />

                { this.props.results.map(project => <ResultsProject {...project} key={project.id} scales={scales} />) }

            </Chart>

        </div>;
    }

}
