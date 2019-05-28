export default function() {
  chrome.tabs.create({
    active: true,
  }, () => {
    console.log('open new tab');
  });
};
