class MqttPublisher {
  constructor(tags, configuration) {
    this.tags = tags;

    const options = {
      key: configuration.key,
      cert: configuration.certificate,
      ca: [ configuration.ca ],
      checkServerIdentity: () => { return null; }
    };
    this.client = mqtt.connect(
      configuration.endpoint,
      options);
    this.connected = false;
    client.on('connect', function () {
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
    this.client.publish('home/ruuvi/' + addr, JSON.stringify(iotData));
  }
}

export default MqttPublisher;
