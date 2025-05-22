
// Simulator to send messages to Azure Service Bus with configurable sessions using Managed Identity
// Usage: node sendMessages.js <fullyQualifiedNamespace> <queueName> <numSessions> <messagesPerSession>
// Example: node sendMessages.js mynamespace.servicebus.windows.net myqueue 10 100

const { ServiceBusClient } = require('@azure/service-bus');
const { DefaultAzureCredential } = require('@azure/identity');


async function main() {
    const [,, fullyQualifiedNamespace, queueName, numSessions, messagesPerSession] = process.argv;
    if (!fullyQualifiedNamespace || !queueName || !numSessions || !messagesPerSession) {
        console.error('Usage: node sendMessages.js <fullyQualifiedNamespace> <queueName> <numSessions> <messagesPerSession>');
        console.error('Example: node sendMessages.js mynamespace.servicebus.windows.net myqueue 10 100');
        process.exit(1);
    }

    // Use DefaultAzureCredential for Managed Identity authentication
    const credential = new DefaultAzureCredential();
    const sbClient = new ServiceBusClient(fullyQualifiedNamespace, credential);
    const sender = sbClient.createSender(queueName);

    try {
        for (let s = 0; s < Number(numSessions); s++) {
            const sessionId = `session-${s+1}`;
            for (let m = 0; m < Number(messagesPerSession); m++) {
                const message = {
                    body: `Message ${m+1} for ${sessionId}`,
                    sessionId
                };
                await sender.sendMessages(message);
                console.log(`Sent: ${message.body}`);
            }
        }
        console.log('All messages sent.');
    } finally {
        await sender.close();
        await sbClient.close();
    }
}

main().catch((err) => {
    console.error('Error sending messages:', err);
    process.exit(1);
});