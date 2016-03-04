import d3 from 'd3';
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import Chart from './svg/chart';
import ClipRect from './svg/clip-rect';
import Axis from './svg/axis';
import Area from './svg/area';
import Line from './svg/line';
import Marker from './svg/marker';
import Indicator from './svg/indicator';

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
    };

    static defaultProps = {
        today: new Date(),
    };

    monthFormat = d3.time.format('%b');
    yearFormat = d3.time.format('%Y');

    constructor(props) {
        super(props);
        this._resize = ::this._resize;

        this.state = {
            padding: { top: 0, right: 0, bottom: 40, left: 0 },
        };
    }

    componentWillReceiveProps(props) {
        const { balance } = props;
        if (balance && balance.length) {
            this.setState({ scales: this._computeScales(balance, this.state.size) });
        }
    }

    componentDidMount() {
        this._resize();
        window.addEventListener('resize', this._resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    getTickFormat(year, d) {
        return (d.getFullYear() !== year) ? (year === d.getFullYear()) && this.yearFormat(d) : this.monthFormat(d);
    }

    render() {
        const {
            isSuccessful,
            completionDate,
            probability,
            backlogSize
        } = this.props;

        const {
            scales,
            size,
            padding,
            hovered,
        } = this.state;

        if (!size || !scales) {
            return <div ref={ c => { this.node = c; }} />;
        }

        const offset = this._calculateOffset();
        let year = 0;

        let tickFormat = this.getTickFormat.bind(this, year);

        return <div ref={ c => { this.node = c; }}>
            <Chart
                width={size.width}
                height={size.height}
                padding={padding}
                onClick={::this._onClick}
                onMouseMove={::this._onMouseMove}
                style={{ top: offset }}
                className={classNames(Styles.chart)}
            >
            </Chart>
        </div>;
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
    _computeDomain(data) {
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
     * @param {Array} balance The full balance history.
     * @param {{width: number, height: number}} size The size of the chart.
     * @return {{x: function, y: function}} The new scales object.
     * @private
     */
    _computeScales(balance, size) {
        return {
            x: d3.time.scale()
                .range([0, size.width])
                .domain(d3.extent(balance, d => d.date)),
            y: d3.scale.linear()
                .range([size.height, 0])
                .domain(this._computeDomain(balance))
        };
    }

    /**
     * @TODO doc
     * @private
     */
    _resize() {
        const container = this.node;
        const { padding } = this.state;
        const size = {
            width: container.clientWidth - padding.left - padding.right,
            height: container.clientHeight - padding.top - padding.bottom,
        };

        this.setState({
            size,
            scales: this._computeScales(this.props.balance, size),
        });
    }

    /**
     * Updates the indicator to match the current mouse position.
     *
     * @param {MouseEvent} event The mouse event payload.
     * @private
     */
    _onMouseMove(event) {
        const { balance } = this.props;

        const date = this._getEventDate(event);
        const hovered = first(balance, d => Math.abs(d.date - date) < 12 * 3600 * 1000);

        // TODO: Performance -> Is rerendering the complete component too slow?
        this.setState({ hovered });
    }

    /**
     * Creates a new event at the position of the mouse click.
     *
     * @param {MouseEvent} event The mouse event payload.
     * @private
     */
    _onClick(event) {
        const date = this._getEventDate(event);
        EventActions.create(date);
    }

    /**
     * Computes the date at the position of the given mouse event. The
     * position is converted using 'scales.x' in the current scope.
     *
     * @param {MouseEvent} event The mouse event payload.
     * @returns {Date} The date at the current mouse position.
     * @private
     */
    _getEventDate(event) {
        const { scales, padding } = this.state;

        d3.event = event;
        const [x] = d3.mouse(event.currentTarget);
        return scales.x.invert(x - padding.left);
    }

    /**
     * @TODO doc
     *
     * @returns {object} The balance object containing date and amount.
     * @private
     */
    _calculateOffset() {
        const { balance, selectedEvent } = this.props;
        const { scales, size } = this.state;

        if (selectedEvent == null) {
            return 0;
        }

        const b = first(balance, d => Math.abs(d.date - selectedEvent.date) < 12 * 3600 * 1000);
        return -scales.y(b.pct50) + size.height * .15;
    }

}

/**
 * Iterates the given collection and returns the first element matching
 * the given filter function. The filter function must return truthy for
 * any matching element or falsy otherwise.
 *
 * TODO: Move to utils
 *
 * @param {Array}    collection The collection to iterate.
 * @param {Function} filter     A function to find matching elements.
 * @returns {*} The first matching element or null, if none.
 */
function first(collection, filter) {
    return collection.filter(filter)[0];
}