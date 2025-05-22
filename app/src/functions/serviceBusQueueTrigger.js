const { app } = require('@azure/functions');

app.serviceBusQueue('serviceBusQueueTrigger', {
    connection: 'myconnection',
    queueName: 'myinputqueue',
    isSessionsEnabled: true,
    handler: (message, context) => {
        context.log('Service bus queue function processed message:', message, 'for session:', context.sessionId);
    }
});