import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Container from './container';

import Styles from './styles/footer.less';
import logoImage from './assets/25th-floor.svg';

const messages = defineMessages({

    disclaimerMessage: {
        id: 'footer.disclaimerMessage',
        defaultMessage: '{disclaimer}: We are not saving any data you insert on the website.',
    },

    disclaimer: {
        id: 'footer.disclaimer',
        defaultMessage: 'Disclaimer',
    },

    contactMessage: {
        id: 'footer.contactMessage',
        defaultMessage: 'If you wish to contact us, please feel free to {contactLink} – We are ' +
        'happy to answer your questions.',
    },

    contact: {
        id: 'footer.contact',
        defaultMessage: 'get in touch with us',
    },

    floorMessage: {
        id: 'footer.floorMessage',
        defaultMessage: 'This Backlog Calculator was developed in cooperation with {floorLink}.',
    },

});

const MAILTO_URL = 'mailto:office@borisgloger.com?subject=Backlog%20Calculator';
const HOMEPAGE_URL = 'http://25th-floor.com';

/**
 * Application footer featuring a disclaimer, contact link and the 25th-floor logo.
 *
 * This component is pure.
 */
export default
class Footer extends Component {

    /**
     * @inheritDoc
     */
    render() {
        return <footer className={Styles.footer}>
            <Container>
                <Row>
                    <Col
                        xs={12} sm={9} md={10} lg={8}
                        smOffset={3} mdOffset={2}
                    >
                        <p>
                            <FormattedMessage {...messages.disclaimerMessage} values={{
                                disclaimer: <strong>
                                    <FormattedMessage {...messages.disclaimer} />
                                </strong>,
                            }}
                            />
                        </p>

                        <p className={Styles.printHide}>
                            <FormattedMessage {...messages.contactMessage} values={{
                                contactLink: <a href={MAILTO_URL}>
                                    <FormattedMessage {...messages.contact} />
                                </a>,
                            }}
                            />
                        </p>
                    </Col>
                </Row>

                <Row className={Styles.floor}>
                    <Col xs={4} sm={3} md={2}>
                        <img
                            className={Styles.logo}
                            src={logoImage}
                            width="84"
                            height="42"
                        />
                    </Col>

                    <Col xs={8} sm={9} md={10} lg={8}>

                        <FormattedMessage {...messages.floorMessage} values={{
                            floorLink: <a href={HOMEPAGE_URL} target="_blank">25th-floor</a>,
                        }}
                        />

                    </Col>
                </Row>
            </Container>
        </footer>;
    }

}
