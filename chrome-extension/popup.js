function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;

    callback(url);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  
  const openGmarksBtn = document.getElementById('open-graphmarks');
  const openGmarksExtBtn = document.getElementById('open-graphmarks-external');
  const addToGmarksBtn = document.getElementById('add-to-graphmarks');

  openGmarksExtBtn.addEventListener('click', function() {
    chrome.tabs.create({active: true, url: 'http://ebb-tide.co/graphmarks/'});
  });

  openGmarksBtn.addEventListener('click', function() {
    chrome.tabs.create({active: true, url: 'chrome://bookmarks'});
  });

  addToGmarksBtn.addEventListener('click', function() {
    getCurrentTabUrl(function(res) {alert(res)});
    chrome.bookmarks
  });

});
