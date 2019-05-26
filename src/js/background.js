import '../img/icon-128.png'
import '../img/icon-34.png'

chrome.alarms.clear("morning-alarm");
chrome.alarms.clear("evening-alarm");
var morningAlarmInfo = {
    'when': new Date().setUTCHours(6, 0, 0, 0)
};

var eveningAlarmInfo = {
    'when': new Date().setUTCHours(18, 0, 0, 0)
};

chrome.alarms.create("test-alarm", {
    'periodInMinutes': 0.1
});

chrome.alarms.create("morning-alarm", morningAlarmInfo);
chrome.alarms.create("evening-alarm", eveningAlarmInfo);
chrome.alarms.onAlarm.addListener(handleAlarm);

function handleAlarm(alarm) {
    chrome.notifications.onButtonClicked.removeListener(handleClickAlarm);
    let options = {
        type: "basic",
        title: "Catty",
        message: "meomeo",
        iconUrl: "/icon-128.png",
        requireInteraction: true,
        buttons: [{
            title: 'Open'
        }]
    }
    chrome.notifications.onButtonClicked.addListener(handleClickAlarm);

    chrome.notifications.create("catty", options, () => {

    })

}

function handleClickAlarm(notificationId, buttonIndex) {
    chrome.tabs.create({
        active: true
    }, () => {
        console.log("open new tab")
    })


    chrome.notifications.onButtonClicked.removeListener(handleClickAlarm);

}