import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import { getDeployedEventsInstance } from '../ethereum/factory';
import Layout from '../components/layout';
import { Link } from '../routes';

class EventIndex extends Component {
    
    static async getInitialProps() {
        const events = await getDeployedEventsInstance.methods.getDeployedEvents().call();

        return { events };
    }

    renderEvents() {
        const items = this.props.events.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/events/${address}`} legacyBehavior>
                        <a>View Event</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Open Events</h3>
                    <Link route="/events/new" legacyBehavior>
                        <a>
                            <Button 
                                floated="right"
                                content='Create Event'
                                icon='add circle'
                                primary
                            />
                        </a>
                    </Link> 
                    {this.renderEvents()} 
                </div>
            </Layout>
        );
    }
}

export default EventIndex;
