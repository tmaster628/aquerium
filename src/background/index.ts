import { getQueryMapObj, updateGist, getQueryTasks, getQueryURLEndpoint } from "../util";
import { IUserInfo } from "../state";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    token: "",
    username: "",
    gistID: "",
    invalidPAT: false
  });
  chrome.alarms.create("refresh", { periodInMinutes: 5 });
});

chrome.alarms.onAlarm.addListener(async alarm => {
  chrome.storage.sync.get(["token", "username", "gistID"], async result => {
    if (result.token !== "" && result.username != "" && result.gistID != "") {
      const user: IUserInfo = {
        token: result.token,
        username: result.username,
        gistID: result.gistID,
        invalidPAT: false
      };
      const response = await getQueryMapObj(user);
      const map = response.queryMap;
      let badge = 0;
      if (map) {
        const newMap = JSON.parse(JSON.stringify(map));
        for (const key in map) {
          const responseItems = await getQueryTasks(getQueryURLEndpoint(user, map[key]));
          if (
            responseItems.tasks &&
            JSON.stringify(responseItems.tasks) !== JSON.stringify(map[key].tasks)
          ) {
            newMap[key].tasks = responseItems.tasks;
          }
          badge += responseItems.tasks.length - +newMap[key].reasonableCount;
        }

        chrome.browserAction.setBadgeText({ text: badge.toString() });
        if (JSON.stringify(map) !== JSON.stringify(newMap)) {
          await updateGist(user, newMap);
        }
      }
    }
  });
});
