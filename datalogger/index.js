const fs = require('fs');
const noble = require('noble');
const ruuvi = require('./ruuvi');
const ConsolePublisher = require('./console-publisher');
const MqttPublisher = require('./mqtt-publisher');
const PublishingState = require('./state');

const configuration = JSON.parse(fs.readFileSync('configuration.json'));
const publishers = [
  new ConsolePublisher(),
  new MqttPublisher(configuration.ruuviTags, configuration.mqtt)
];
const publishingState = new PublishingState(configuration.ruuviTags);

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  const addr = peripheral.address;

  if (publishingState.contains(addr)) {
    const serviceData = peripheral.advertisement.serviceData;
    const decodedData = ruuvi.decodeServiceData(serviceData);

    if (publishingState.hasIntervalPassed(addr, configuration.publishInterval)) {
      publishers.forEach(publisher => publisher.publish(addr, decodedData));
      publishingState.updateState(addr, decodedData);
    }
  }
});
