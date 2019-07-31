# Install OpenHAB on Raspberry Pi

- Flash from official raspi image.
- Go to http://openhabianpi:8080 and choose standard setup

Install Mosquitto:
- sudo apt-get install mosquitto

Install InfluxDB:
- sudo apt-get install influxdb influxdb-client

Install Grafana:
- Download from https://grafana.com/grafana/download?platform=arm
- Install

Install InfluxDB persistence service to OpenHAB:
- Go to Paper UI -> Add-Ons -> Persistence and select InfluxDB.

Install MQTT Binding to OpenHAB:
- Go to Paper UI -> Add-Ons -> Bindings and select MQTT.

# Configuration

## InfluxDB persistence service

/etc/openhab2/services/influxdb.cfg:

```
url=http://127.0.0.1:8086
user=openhab
password=openhab
db=openhab
```

/etc/openhab2/persistence/influxdb.persist:
```
Strategies {
  default = everyChange
}

Items {
    * : strategy = everyChange
}
```

Create `openhab` user and database in InfluxDB.
```
create user admin with password 'admin'  WITH ALL PRIVILEGES;

create user openhab with password 'openhab';
create database openhab;
grant all on openhab to openhab;
```

Enable authentication in InfluxDB by editing /etc/influxdb/influxdb.cfg and restarting InfluxDB service `sudo systemctl restart influxdb`.

## Configure MQTT

/etc/openhab2/services/mqtt.cfg:
```
local.url=tcp://localhost:1883
local.user=admin
local.pwd=admin
local.clientId=openhab
local.retain=true
local.async=false
```

## Create OpenHab items for Ruuvi Tags

/etc/openhab2/items/ruuvi.items:
```
Number ruuvi1_temp          "Ruuvi1 Temperature [%.2f C]" (climate) {mqtt="<[local:f6abf75bee05/temp:state:default]"}
Number ruuvi1_humidity      "Ruuvi1 Humidity [%.2f %]" (climate) {mqtt="<[local:f6abf75bee05/humidity:state:default]"}
Number ruuvi1_pressure      "Ruuvi1 Pressure [%.2f hPa]" (climate) {mqtt="<[local:f6abf75bee05/pressure:state:default]"}
Number ruuvi1_battery_volts "Ruuvi1 Battery [%.2f V]" (climate) {mqtt="<[local:f6abf75bee05/battery_volts:state:default]"}

Number ruuvi2_temp          "Ruuvi2 Temperature [%.2f C]" (climate) {mqtt="<[local:f6abf75bee05/temp:state:default]"}
Number ruuvi2_humidity      "Ruuvi2 Humidity [%.2f %]" (climate) {mqtt="<[local:f6abf75bee05/humidity:state:default]"}
Number ruuvi2_pressure      "Ruuvi2 Pressure [%.2f hPa]" (climate) {mqtt="<[local:f6abf75bee05/pressure:state:default]"}
Number ruuvi2_battery_volts "Ruuvi2 Battery [%.2f V]" (climate) {mqtt="<[local:f6abf75bee05/battery_volts:state:default]"}

Number ruuvi3_temp          "Ruuvi3 Temperature [%.2f C]" (climate) {mqtt="<[local:f6abf75bee05/temp:state:default]"}
Number ruuvi3_humidity      "Ruuvi3 Humidity [%.2f %]" (climate) {mqtt="<[local:f6abf75bee05/humidity:state:default]"}
Number ruuvi3_pressure      "Ruuvi3 Pressure [%.2f hPa]" (climate) {mqtt="<[local:f6abf75bee05/pressure:state:default]"}
Number ruuvi3_battery_volts "Ruuvi3 Battery [%.2f V]" (climate) {mqtt="<[local:f6abf75bee05/battery_volts:state:default]"}
```

## Restart OpenHab

```
sudo systemctl restart openhab2.service
```

## Run nodejs service to publish ruuvi measurements to MQTT



## Install espruino on Ruuvi Tags




## Links

http://www.mrwhal3.com/RuuviTag
https://github.com/mrwhale/RuuviTag-Openhab-Bridge

wemos d1 espruino:
https://tech.scargill.net/esp8266-dio-mysteries-solved/

https://nathan.chantrell.net/

