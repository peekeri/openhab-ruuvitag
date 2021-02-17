class PublishingState {
  constructor(tags) {
    this.states = Object.keys(tags).reduce((acc, curr) => {
      acc[curr] = {
        data: {},
        lastPublish: 0
      };
      return acc;
    }, {});
  }

  contains(address) {
    return this.states[address] !== undefined;
  }

  hasIntervalPassed(address, publishInterval) {
    if (!this.states[address]) {
      return;
    }

    const now = Math.floor(new Date().getTime() / 1000);
    return this.states[address].lastPublish >= now + publishInterval;
  }

  updateState(address, data) {
    if (!this.states[address]) {
      return;
    }

    const now = Math.floor(new Date().getTime() / 1000);
    this.states[address] = {
      data: data,
      lastPublish: now
    };
  }
}

export default PublishingState;
