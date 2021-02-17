const fs = require('fs');
const noble = require('noble');
const ruuvi = require('./ruuvi');
const con = require('./console-publisher');
const mqtt = require('./mqtt-publisher');
const state = require('./state');

const configuration = JSON.parse(fs.readFileSync('configuration.json'));
const publishers = [
  new con.ConsolePublisher(),
  new mqtt.MqttPublisher(configuration.ruuviTags, configuration.mqtt)];
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
    const manufacturerData = peripheral.advertisement.manufacturerData;
    const decodedData = ruuvi.decodeManufacturerData(manufacturerData);

    if (publishingState.hasIntervalPassed(addr, configuration.publishInterval)) {
      publishers.forEach(publisher => publisher.publish(addr, decodedData));
      publishingState.updateState(addr, decodedData);
    }
  }
});
