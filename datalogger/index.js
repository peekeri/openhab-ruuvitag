var noble = require('noble');
var mqtt = require('mqtt');

const addresses = [
  'f6:ab:f7:5b:ee:05',
  'da:90:88:94:4e:5b'
];

function decodeTemperature(value) {
  const sign = (value[0] >> 7) == 1 ? -1 : 1;
  const v = (value[0] & 0x7F) + (value[1] / 100.0);
  return sign * v;
}

function decodePressure(value) {
  return (((value[0] << 8) | value[1]) + 50000) / 100.0;
}

function decodeHumidity(value) {
  return ((value[0] << 8) | value[1]) / 400.0;
}

function decodeBattery(value) {
  return ((value[0] << 8) | value[1]) / 1000.0;
}

const decoders = {
  '1809': { 'name': 'temp',           'func': decodeTemperature },
  '2a6d': { 'name': 'pressure',       'func': decodePressure  },
  '2a6f': { 'name': 'humidity',       'func': decodeHumidity  },
  'fffe': { 'name': 'battery_volts',  'func': decodeBattery  }
};

function decodeServiceData(data) {
  return data.reduce((acc, curr) => {
    const decoder = decoders[curr.uuid];
    if (decoder === undefined) {
      return acc;
    }
    acc[decoder['name']] = decoder['func'](curr.data);
    return acc;
  }, {});
}

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

let connected = false;
const client  = mqtt.connect('mqtt://localhost', { username: 'admin', password: 'admin' })
client.on('connect', function () {
  connected = true;
});

const states = {};

noble.on('discover', function(peripheral) {
  const addr = peripheral.address;
  const id = addr.split(':').join('');

  if (addresses.includes(addr)) {
    const serviceData = peripheral.advertisement.serviceData;
    const decodedData = decodeServiceData(serviceData);

    if (!Object.keys(states).includes(addr)) {
      states[addr] = {
      };
    }

    if (connected) {
      Object.keys(decodedData).forEach(key => {
        if (states[addr][key] != decodedData[key]) {
          console.log('Publishing to: ' + id +'/' + key + ' value: ' + decodedData[key].toString());
          client.publish(id +'/' + key, decodedData[key].toString());
          states[addr][key] = decodedData[key];
        }
      });
    }
  }
});
