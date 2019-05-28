import '../css/index.css';
const node = document.getElementById('google-searchbox');
node.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    // Do work
    chrome.tabs.create({
      url: `https://www.google.com/search?q=${node.value}`,
    });
  }
});