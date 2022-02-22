# Install Raspbian on Raspberry Pi

# Install Dependencies for the Ruuvi Datalogger

nodejs and npm:

    sudo apt-get install nodejs npm

Install older version of node as bluetooth does not work with more recent one:

    sudo npm install -g n
    sudo n i 8.17.0

Transfer contents of this repository to the Raspberry and install:

    cd openhab-ruuvitag/datalogger
    /usr/local/bin/npm install
    /usr/local/bin/npm install noble bluetooth-hci-socket

Try to start the datalogger to see, if it can do its work:

    sudo /usr/local/bin/npm start

Install systemd service:

    sudo mkdir -p /opt/ruuvi/datalogger
    sudo cp -R datalogger/* /opt/ruuvi/datalogger
    sudo cp systemd/ruuvi-datalogger.service /etc/systemd/system/ruuvi-datalogger.service
    sudo systemctl daemon-reload
    sudo systemctl start ruuvi-datalogger
    sudo systemctl enable ruuvi-datalogger
    # Check the logs are ok
    sudo journalctl -u ruuvi-datalogger

## Links

http://www.mrwhal3.com/RuuviTag
https://github.com/mrwhale/RuuviTag-Openhab-Bridge

wemos d1 espruino:
https://tech.scargill.net/esp8266-dio-mysteries-solved/

https://nathan.chantrell.net/
