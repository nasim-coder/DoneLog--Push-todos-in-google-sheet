document.addEventListener('DOMContentLoaded', function() {
    // Listen for button click
    document.getElementById('openTodos').addEventListener('click', function() {
      chrome.tabs.create({ url: chrome.runtime.getURL('todos.html') });
    });
  });