import React, { Component } from 'react' ;
import {Form,Button,Input,Message} from 'semantic-ui-react';
import Layout from '../../components/layout';
import { createEventInstance } from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class EventNew extends Component {
    state = {
        eventName: '',
        ticketPrice: '',
        ticketSupply: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) =>  {
        event.preventDefault();
        this.setState({loading:true,errorMessage:''});
        try {
            const accounts = await web3.eth.getAccounts();
            await createEventInstance.methods
            .createEvent(this.state.eventName,this.state.ticketPrice,this.state.ticketSupply)
            .send({
                    from:accounts[0]
                 });
            Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({loading:false});
    };

    render() {
        return (
            <Layout>
                <h3>Create an Event</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Event Name</label>
                        <Input
                            value={this.state.eventName}
                            onChange={event => this.setState({ eventName: event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Ticket Price</label>
                        <Input 
                            label="wei" 
                            labelPosition="right"
                            value={this.state.ticketPrice}
                            onChange={event => this.setState({ ticketPrice: event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Ticket Supply</label>
                        <Input
                            value={this.state.ticketSupply}
                            onChange={event => this.setState({ ticketSupply: event.target.value})}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Create!</Button>
                </Form>
            </Layout>
        );
    }
}

export default EventNew

