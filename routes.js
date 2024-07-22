const routes = require('next-routes')();

routes
    .add('/events/new', '/events/new')
    .add('/events/:address', '/events/show')
    .add('/events/:address/owners', '/events/owners/index')
    .add('/events/:address/useTicket', '/events/owners/useTicket')
    .add('/events/:address/refundTicket', 'events/owners/refundTicket')
    .add('/events/:address/transferTicket', 'events/owners/transferTicket');

module.exports = routes;