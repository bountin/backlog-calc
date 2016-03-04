import React, { Component } from 'react';
import { injectIntl, defineMessages, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import classNames from 'classnames';
import moment from 'moment';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Container from './container';
import ResultsChart from './results-chart';
import CalculatorForm from './calculator-form';

import Styles from './styles/calculator.less';

import {
    isSuccessful,
    successDuration,
    successProbability,
    successBacklogSize,
} from '../utils/calculations';

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

    printLabel: {
        id: 'calculator.printLabel',
        defaultMessage: 'Print',
    },

    addProjectLabel: {
        id: 'calculator.addProjectLabel',
        defaultMessage: 'Add Project',
    },

});

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

    static lastProjectId = 0;

    state = {
        projects: [],

        activeProject: this.createProject(),

        /**
         * Results of the last computation, if validation succeeds, otherwise
         * null.
         */
        results: [],
    };

    constructor(props) {
        super(props);
        this.handleSave = ::this.handleSave;
        this.handlePrint = ::this.handlePrint;
        this.handleAddProject = ::this.handleAddProject;
    }

    handleSave(project) {
        const { projects } = this.state;
        let activeProject = project;

        if (project.id === 0) {
            activeProject = {
                ...project,
                id: ++Calculator.lastProjectId,
            };

            projects.push(activeProject);
        } else {
            const index = projects.findIndex(p => (project.id === p.id));
            projects[index] = project;
        }

        this.setState({ activeProject });
        this.recalculate();
    }

    /**
     * Prints the current screen.
     *
     * @private
     */
    handlePrint() {
        window.print();
    }

    handleAddProject() {
        this.setState({
            activeProject: this.createProject(),
        });
    }

    recalculateProject(project) {
        const { backlogSize, velocity, startDate, endDate, id, projectName } = project;
        const duration = endDate.diff(startDate, 'days');
        return {
            isSuccessful: isSuccessful(backlogSize, velocity, duration),
            probability: successProbability(backlogSize, velocity, duration),
            completionDate: startDate.clone().add(successDuration(backlogSize, velocity), 'days'),
            backlogSize: successBacklogSize(velocity, duration),
            startDate,
            endDate,
            projectName,
            id,
        };
    }

    /**
     * Recalculates the results based on current inputs.
     *
     * @private
     */
    recalculate() {
        const { projects } = this.state;
        const results = projects.map(::this.recalculateProject);
        this.setState({ results });
    }

    createProject() {
        return {
            id: 0,
            startDate: moment().startOf('day'),
            endDate: moment().startOf('day').add(1, 'month'),
        };
    }

    /**
     * @inheritDoc
     */
    render() {
        const {
            activeProject,
            results,
        } = this.state;

        return <Container>
            <Row>
                <Col
                    xs={12}
                    className={Styles.intro}
                >
                    <FormattedHTMLMessage {...messages.introMessage} />
                </Col>

                <Col xs={12}>
                    {results.length && <ResultsChart results={results} />}

                    <ul className={Styles.legend}>
                        <li className={Styles.ok}><i className="fa fa-square"></i>&nbsp;grün: 100%</li>
                        <li className={Styles.warning}><i className="fa fa-square"></i>&nbsp;gelb: 80 - 100%</li>
                        <li className={Styles.error}><i className="fa fa-square"></i>&nbsp;rot: &lt;80%</li>
                    </ul>

                    <Button
                        bsStyle="primary"
                        className={Styles.action}
                        onClick={this.handleAddProject}
                        disabled={activeProject.id === 0}
                    >
                        <i className="fa fa-plus-circle"></i>&nbsp;<FormattedMessage {...messages.addProjectLabel} />
                    </Button>

                    <CalculatorForm
                        project={activeProject}
                        onSave={this.handleSave}
                    />

                </Col>

                {(results.length) && <Button
                    bsStyle="default"
                    className={classNames('pull-right', Styles.printHide, Styles.action)}
                    onClick={this.handlePrint}
                >
                    <FormattedMessage {...messages.printLabel} />
                </Button>}

            </Row>

        </Container>;
    }
}

export default injectIntl(Calculator);
