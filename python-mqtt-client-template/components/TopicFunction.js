export function TopicFunction({ operations }) {
  const topicsDetails = getTopics(operations);
  let functions = '';

  topicsDetails.forEach((t) => {
    functions += `def send${t.name}(self, id):
        topic = "${t.topic}"
        self.client.publish(topic, id)\n`
  });

  return functions;
}

function getTopics(operations) {
  let topicsDetails = [];

  operations.forEach((op) => {
    const channels = op.channels().all();
    if (!channels.length) return;

    const channel = channels[0];
    const operationId = op.operationId() || op.id();
    
    topicsDetails.push({
      name: operationId.charAt(0).toUpperCase() + operationId.slice(1),
      topic: channel.address()
    });
  });
  
  return topicsDetails;
}
