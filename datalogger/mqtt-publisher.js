class MqttPublisher {
  constructor(tags, configuration) {
    this.tags = tags;

    const options = {
      key: configuration.key,
      cert: configuration.certificate,
      ca: [ configuration.ca ],
      checkServerIdentity: () => { return null; }
    };
    this.connected = false;
    this.client = mqtt.connect(
      configuration.endpoint,
      options);
    this.client.on('connect', () => {
      console.log(`MQTT client connected to ${configuration.endpoint}`);
      this.connected = true;
    });
  }

  publish(address, data) {
    if (!this.connected) {
      console.log('MQTT client is not connected');
      return;
    }

    const iotData = {
      location: 'HomeIoT',
      temperature: data['temp'],
      humidity: data['humidity'],
      pressure: data['pressure'],
      battery: data['battery_volts'],
      tagName: this.tags[address].name
    };
    console.log('MQTT: Publishing to: home/ruuvi/' + address + ' value: ' + JSON.stringify(iotData));
    this.client.publish('home/ruuvi/' + address, JSON.stringify(iotData));
  }
}

module.exports = {
  MqttPublisher
};
