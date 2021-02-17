class ConsolePublisher {
  publish(addres, data) {
    console.log('Publishing value: ' + JSON.stringify(data));
  }
}

export default ConsolePublisher;
