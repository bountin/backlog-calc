import d3 from 'd3';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import Axis from './svg/axis';
import Chart from './svg/chart';
import Label from './svg/label';
import Styles from './styles/chart.less';

/**
 * Displays a containing the account balance history, events of active
 * scenarios and a marker for the current date. On mouse over, a little
 * indicator displays additional information to the hovered date.
 */
export default
class ResultChart extends Component {

    static propTypes = {
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
     * Computes a nicer domain for the y-axis. It takes into account
     * minimum and maximum account balances, as well as jitter in the
     * history to scale the graph to a nice size.
     *
     * TODO: improve quality of the computed range.
     *
     * @param {Array} data The full balance history.
     * @return {number[]} An array containing the domain boundaries.
     * @private
     */
    computeDomain(data) {
        const value = d => d.pct50;

        const min = d3.min(data, value);
        const max = d3.max(data, value);
        const mean = d3.mean(data, value);
        const median = d3.median(data, value);

        const lower = Math.min(median - mean, min);
        const upper = Math.max(median + mean, max);
        const diff = upper - lower;

        return [lower - diff * 0.15, upper + diff * 0.15];
    }

    /**
     * Recomputes scales which translate domain values into coordinates
     * on the SVG graph. The scales object contains two components, 'x'
     * and 'y'.
     *
     * @param {{width: number, height: number}} size The size of the chart.
     * @return {{x: function, y: function}} The new scales object.
     * @private
     */
    computeScales({ startDate, endDate }, size) {
        return {
            x: d3.time.scale()
                .range([0, size.width])
                .domain([startDate, endDate]),
            y: d3.scale.ordinal()
                .range([size.height, 0])
                .domain(['Project']),
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

        console.log('HEIGHT', container, size.height, container.clientHeight);

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

        const formatDate = d => moment(d).format('WW');

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
                    outerTickSize={0}
                    className={classNames(Styles.axis, Styles.x)}
                />

                <Axis
                    orientation="left"
                    scale={scales.y}
                    ticks={4}
                    tickPadding={-size.width + 10}
                    innerTickSize={size.width}
                    outerTickSize={0}
                    className={classNames(Styles.axis, Styles.y)}
                    clipPath="url(#graph-clip)"
                />

                <Label
                    text={String(this.props.backlogSize)}
                    height={50}
                    width={scales.x(this.props.endDate)}
                />

            </Chart>
        </div>;
    }

}
