import { Mixpanel, MixpanelProperties } from "mixpanel-react-native";

class MixpanelTracker {
  mixpanel: Mixpanel;
  loggedIn: boolean = false;

  constructor() {
    const trackAutomaticEvents = true;

    const instance = new Mixpanel(
      "0b529ae08ffe28f1dfe037abcacd584c",
      trackAutomaticEvents
    );

    instance.init();

    this.mixpanel = instance;
  }

  track(event: string, properties: MixpanelProperties | undefined = {}) {
    this.mixpanel.track(event, properties);
  }
}

const mixpanelTracker = new MixpanelTracker();
export default mixpanelTracker;
