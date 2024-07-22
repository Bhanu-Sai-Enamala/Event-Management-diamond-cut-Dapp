
import React, { Component } from 'react';
import { Card, Button, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Event from '../../ethereum/event';
import web3 from '../../ethereum/web3';
import { Router, Link } from '../../routes';

class EventShow extends Component {
    static async getInitialProps(props) {
        const event = Event(props.query.address);
        const summary = await event.methods.getEventDetails().call();

        return {
            name: summary[0],
            ticketPrice: summary[1].toString(),
            ticketSupply: summary[2].toString(),
            ticketsSold: summary[3].toString(),
            contractAddress: props.query.address,
            successMessage: props.query.successMessage || '',
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            successMessage: this.props.successMessage,
            loading: false,
            ticketId: '',
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.successMessage !== this.props.successMessage) {
            this.setState({ successMessage: this.props.successMessage });
        }
    }

    handleBuyTicket = async () => {
        this.setState({ loading: true, errorMessage: '', successMessage: '', ticketId: '' });
        const { contractAddress } = this.props;
        const event = Event(contractAddress);

        try {
            const accounts = await web3.eth.getAccounts();
            const result = await event.methods.buyTicket().send({
                from: accounts[0],
                value: this.props.ticketPrice
            });

            const ticketId = result.events.TicketPurchased.returnValues.ticketId;

            Router.replaceRoute(`/events/${this.props.contractAddress}?successMessage=Ticket purchased successfully! Your Ticket ID is ${ticketId}.`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false });
    };

    renderCards() {
        const {
            name,
            ticketPrice,
            ticketSupply,
            ticketsSold
        } = this.props;

        const items = [
            {
                header: name,
                description: 'Click below to buy tickets'
            },
            {
                header: ticketPrice,
                meta: 'in wei',
                description: 'Price of one ticket'
            },
            {
                header: ticketSupply - ticketsSold,
                description: 'Total number of tickets available for the event'
            },
            {
                header: ticketsSold,
                description: 'Number of tickets sold'
            }
        ];
        return <Card.Group items={items} />;
    }

    render() {
        const { errorMessage, successMessage, loading } = this.state;

        return (
            <Layout>
                <h3>Event Show</h3>
                {this.renderCards()}
                {errorMessage && (
                    <Message error header="Oops!" content={errorMessage} style={{ marginTop: '10px' }} />
                )}
                {successMessage && (
                    <Message success header="Success!" content={successMessage} style={{ marginTop: '10px' }} />
                )}
                <Link legacyBehavior route={`/events/${this.props.contractAddress}/owners`}>
                    <a>
                        <Button primary>View Owners</Button>
                    </a>
                </Link>
                <Button 
                    loading={loading} 
                    onClick={this.handleBuyTicket} 
                    primary style={{ marginTop: '10px' }}>
                        Buy
                </Button>
                <Link legacyBehavior route={`/events/${this.props.contractAddress}/useTicket`}>
                    <a>
                        <Button primary>Use a Ticket</Button>
                    </a>
                </Link>
                <Link legacyBehavior route={`/events/${this.props.contractAddress}/refundTicket`}>
                    <a>
                        <Button primary>Request a refund</Button>
                    </a>
                </Link>
                <Link legacyBehavior route={`/events/${this.props.contractAddress}/transferTicket`}>
                    <a>
                        <Button primary>Transfer Ticket</Button>
                    </a>
                </Link>
            </Layout>
        );
    }
}

export default EventShow;
