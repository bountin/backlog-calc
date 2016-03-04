import React, { Component } from 'react';
import { injectIntl, defineMessages, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import classNames from 'classnames';
import moment from 'moment';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Container from './container';
import Results from './results';
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
    }

    handleSave(project) {
        const { projects } = this.state;
        const index = projects.findIndex(p => (project.id === p.id));

        if (index < 0) {
            projects.push(project);
        } else {
            projects[index] = project;
        }
    }

    /**
     * Prints the current screen.
     *
     * @private
     */
    handlePrint() {
        window.print();
    }

    recalculateProject(project) {
        const { backlogSize, velocity, startDate, endDate } = project;
        const duration = endDate.diff(startDate, 'days');
        return {
            isSuccessful: isSuccessful(backlogSize, velocity, duration),
            probability: successProbability(backlogSize, velocity, duration),
            completionDate: startDate.clone().add(successDuration(backlogSize, velocity), 'days'),
            backlogSize: successBacklogSize(velocity, duration),
            startDate,
            endDate,
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
            id: ++Calculator.lastProjectId,
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
                    xs={12} sm={9} md={10} lg={8}
                    smOffset={3} mdOffset={2}
                    className={Styles.intro}
                >
                    <FormattedHTMLMessage {...messages.introMessage} />
                </Col>

                <CalculatorForm
                    project={activeProject}
                    onSave={this.handleSave}
                />

                {(results.length) && <Button
                    bsStyle="default"
                    className={classNames('pull-right', Styles.printHide, Styles.action)}
                    onClick={this.handlePrint}
                >
                    <FormattedMessage {...messages.printLabel} />
                </Button>}

                <div className={Styles.nobreak}>
                    {results.length && <Results {...results[0]} />}
                </div>
            </Row>

        </Container>;
    }
}

export default injectIntl(Calculator);
