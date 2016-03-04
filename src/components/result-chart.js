import d3 from 'd3';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import Axis from './svg/axis';
import Bar from './svg/bar';
import Chart from './svg/chart';
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
     * Recomputes scales which translate domain values into coordinates
     * on the SVG graph. The scales object contains two components, 'x'
     * and 'y'.
     *
     * @param {{width: number, height: number}} size The size of the chart.
     * @return {{x: function, y: function}} The new scales object.
     * @private
     */
    computeScales({ startDate, completionDate }, size) {
        return {
            x: d3.time.scale()
                .range([0, size.width])
                .domain([
                    startDate.clone().subtract(1, 'week'),
                    completionDate.clone().add(1, 'week'),
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
        size.height = size.height > 100 ? size.height : 100;

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

        const {
            startDate,
            endDate,
            backlogSize,
            completionDate,
            probability,
        } = this.props;

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

                <Bar
                    transform={`translate(${scales.x(endDate) - 10}, ${scales.y('Project')})`}
                    text={String(completionDate.diff(endDate, 'days'))}
                    height={scales.y.rangeBand()}
                    width={scales.x(completionDate) - scales.x(endDate) + 10}
                    className={Styles.extension}
                    rx={4}
                    ry={4}
                />

                <Bar
                    transform={`translate(${scales.x(startDate)}, ${scales.y('Project')})`}
                    text={String(backlogSize)}
                    height={scales.y.rangeBand()}
                    width={scales.x(endDate)}
                    className={Styles.project}
                    rx={4}
                    ry={4}
                />

                <circle
                    transform={`translate(${scales.x(startDate) + scales.x(endDate) - 30}, ${scales.y('Project')})`}
                    cx="10"
                    cy="20"
                    r="10"
                    className={classNames({
                        [Styles.ok]: probability >= 1,
                        [Styles.warning]: probability >= 0.8 && probability < 1,
                        [Styles.error]: probability < 0.8,
                        [Styles.semaphore]: true,
                    })}
                />

            </Chart>
        </div>;
    }

}
