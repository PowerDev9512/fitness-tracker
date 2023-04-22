import { Mixpanel, MixpanelProperties } from "mixpanel-react-native";

import { queryClient } from "../api/apiProvider";
import { User } from "../types/domain";

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
    const user = queryClient.getQueryData<User>(["user"]);

    if (user && !this.loggedIn) {
      this.loggedIn = true;
      this.mixpanel.identify(user.id.toString());
      this.mixpanel.alias("DatabaseId", user.id.toString());
      this.mixpanel.track("Logged in");
    }

    // track event with properties
    this.mixpanel.track(event, properties);
  }
}

const mixpanelTracker = new MixpanelTracker();
export default mixpanelTracker;
