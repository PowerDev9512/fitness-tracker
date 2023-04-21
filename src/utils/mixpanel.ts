import { Buffer } from "buffer";
import { Mixpanel, MixpanelProperties } from "mixpanel-react-native";

import { queryClient } from "../api/apiProvider";
import { User } from "../types/domain";

class MixpanelTracker {
  mixpanel: Mixpanel;
  loggedIn: boolean = false;

  constructor() {
    const EncodedMixPanelToken = "MDJCNjlhZTA4ZmZlMjhmMWRmZTAzN2FiY2FjZDU4NGM=";
    const MixpanelToken = Buffer.from(
      EncodedMixPanelToken,
      "base64"
    ).toString();

    const trackAutomaticEvents = true;

    this.mixpanel = new Mixpanel(MixpanelToken, trackAutomaticEvents);
    this.mixpanel.init();
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
