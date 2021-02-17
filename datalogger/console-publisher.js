class ConsolePublisher {
  publish(address, data) {
    console.log(`Current data from ${address}: ` + JSON.stringify(data));
  }
}

module.exports = {
  ConsolePublisher
};
