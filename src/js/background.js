
chrome.alarms.clear('tabbyWordAlarm');
const tabbyWordAlarm = {
  'periodInMinutes': 60,
};


chrome.alarms.create('tabbyWordAlarm', tabbyWordAlarm);
chrome.alarms.onAlarm.addListener(handleAlarm);

/**
 * Handle chrome alarm: show notification
 * @param {int} _alarm The alarm info.
 */
function handleAlarm(_alarm) {
  chrome.notifications.onButtonClicked.removeListener(handleClickAlarm);
  const options = {
    type: 'basic',
    title: 'Tabby Word',
    message: 'Learn a new English word now.',
    iconUrl: 'favicon-120.png',
    requireInteraction: true,
    buttons: [{
      title: 'Open',
      iconUrl: 'favicon-120.png',
    }],
  };
  chrome.notifications.onButtonClicked.addListener(handleClickAlarm);

  chrome.notifications.create('catty', options, () => {

  });
}

/**
 * Callback of notification: open new chrome tab.
 * @param {int} _notificationId notificationId
 * @param {int} _buttonIndex buttonId
 */
function handleClickAlarm(_notificationId, _buttonIndex) {
  chrome.tabs.create({
    active: true,
  }, () => {
    console.log('open new tab');
  });


  chrome.notifications.onButtonClicked.removeListener(handleClickAlarm);
}
