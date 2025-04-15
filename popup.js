document.addEventListener('DOMContentLoaded', function() {
  // Tab switching functionality
  const tabs = document.querySelectorAll('.tabs > .tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabParent = this.parentElement;
      const isSubTab = tabParent.classList.contains('sub-tabs');
      
      // Deactivate all tabs in this group
      tabParent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      
      // Activate this tab
      this.classList.add('active');
      
      // Handle main tabs vs sub-tabs differently
      if (isSubTab) {
        // For sub-tabs, just show the corresponding tab content
        const tabId = this.getAttribute('data-tab');
        const tabContents = tabParent.parentElement.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
      } else {
        // For main tabs, show the corresponding tab content
        const tabId = this.getAttribute('data-tab');
        const tabContents = document.querySelectorAll('.container > .tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
      }
    });
  });

  // Initialize all storage displays
  refreshAllStorageDisplays();

  // =========== CHROME.STORAGE.LOCAL ===========
  document.getElementById('local-save').addEventListener('click', function() {
    const key = document.getElementById('local-key').value;
    const value = document.getElementById('local-value').value;
    
    if (key && value) {
      const data = {};
      data[key] = value;
      
      chrome.storage.local.set(data, function() {
        refreshChromeStorage('local');
        console.log('Data saved to chrome.storage.local');
      });
    }
  });
  
  document.getElementById('local-get').addEventListener('click', function() {
    const key = document.getElementById('local-key').value;
    
    if (key) {
      chrome.storage.local.get(key, function(result) {
        document.getElementById('local-data').textContent = JSON.stringify(result, null, 2);
      });
    } else {
      refreshChromeStorage('local');
    }
  });
  
  document.getElementById('local-delete').addEventListener('click', function() {
    const key = document.getElementById('local-key').value;
    
    if (key) {
      chrome.storage.local.remove(key, function() {
        refreshChromeStorage('local');
        console.log('Key removed from chrome.storage.local');
      });
    }
  });
  
  document.getElementById('local-clear').addEventListener('click', function() {
    chrome.storage.local.clear(function() {
      refreshChromeStorage('local');
      console.log('All data cleared from chrome.storage.local');
    });
  });

  // =========== CHROME.STORAGE.SYNC ===========
  document.getElementById('sync-save').addEventListener('click', function() {
    const key = document.getElementById('sync-key').value;
    const value = document.getElementById('sync-value').value;
    
    if (key && value) {
      const data = {};
      data[key] = value;
      
      chrome.storage.sync.set(data, function() {
        refreshChromeStorage('sync');
        console.log('Data saved to chrome.storage.sync');
      });
    }
  });
  
  document.getElementById('sync-get').addEventListener('click', function() {
    const key = document.getElementById('sync-key').value;
    
    if (key) {
      chrome.storage.sync.get(key, function(result) {
        document.getElementById('sync-data').textContent = JSON.stringify(result, null, 2);
      });
    } else {
      refreshChromeStorage('sync');
    }
  });
  
  document.getElementById('sync-delete').addEventListener('click', function() {
    const key = document.getElementById('sync-key').value;
    
    if (key) {
      chrome.storage.sync.remove(key, function() {
        refreshChromeStorage('sync');
        console.log('Key removed from chrome.storage.sync');
      });
    }
  });
  
  document.getElementById('sync-clear').addEventListener('click', function() {
    chrome.storage.sync.clear(function() {
      refreshChromeStorage('sync');
      console.log('All data cleared from chrome.storage.sync');
    });
  });

  // =========== CHROME.STORAGE.SESSION ===========
  document.getElementById('session-save').addEventListener('click', function() {
    const key = document.getElementById('session-key').value;
    const value = document.getElementById('session-value').value;
    
    if (key && value) {
      const data = {};
      data[key] = value;
      
      chrome.storage.session.set(data, function() {
        refreshChromeStorage('session');
        console.log('Data saved to chrome.storage.session');
      });
    }
  });
  
  document.getElementById('session-get').addEventListener('click', function() {
    const key = document.getElementById('session-key').value;
    
    if (key) {
      chrome.storage.session.get(key, function(result) {
        document.getElementById('session-data').textContent = JSON.stringify(result, null, 2);
      });
    } else {
      refreshChromeStorage('session');
    }
  });
  
  document.getElementById('session-delete').addEventListener('click', function() {
    const key = document.getElementById('session-key').value;
    
    if (key) {
      chrome.storage.session.remove(key, function() {
        refreshChromeStorage('session');
        console.log('Key removed from chrome.storage.session');
      });
    }
  });
  
  document.getElementById('session-clear').addEventListener('click', function() {
    chrome.storage.session.clear(function() {
      refreshChromeStorage('session');
      console.log('All data cleared from chrome.storage.session');
    });
  });

  // =========== LOCALSTORAGE ===========
  document.getElementById('ls-save').addEventListener('click', function() {
    const key = document.getElementById('ls-key').value;
    const value = document.getElementById('ls-value').value;
    
    if (key && value) {
      localStorage.setItem(key, value);
      refreshLocalStorage();
      console.log('Data saved to localStorage');
    }
  });
  
  document.getElementById('ls-get').addEventListener('click', function() {
    const key = document.getElementById('ls-key').value;
    
    if (key) {
      const value = localStorage.getItem(key);
      const result = {};
      result[key] = value;
      document.getElementById('ls-data').textContent = JSON.stringify(result, null, 2);
    } else {
      refreshLocalStorage();
    }
  });
  
  document.getElementById('ls-delete').addEventListener('click', function() {
    const key = document.getElementById('ls-key').value;
    
    if (key) {
      localStorage.removeItem(key);
      refreshLocalStorage();
      console.log('Key removed from localStorage');
    }
  });
  
  document.getElementById('ls-clear').addEventListener('click', function() {
    localStorage.clear();
    refreshLocalStorage();
    console.log('All data cleared from localStorage');
  });

  // =========== INDEXEDDB ===========
  // Initialize IndexedDB
  let db;
  const request = indexedDB.open('DemoDatabase', 1);
  
  request.onerror = function(event) {
    console.error('IndexedDB error:', event.target.error);
  };
  
  request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('demoStore')) {
      db.createObjectStore('demoStore', { keyPath: 'id' });
    }
  };
  
  request.onsuccess = function(event) {
    db = event.target.result;
    refreshIndexedDB();
  };

  document.getElementById('idb-save').addEventListener('click', function() {
    const key = document.getElementById('idb-key').value;
    let value = document.getElementById('idb-value').value;
    
    try {
      // Try to parse as JSON, if fails, store as string
      value = JSON.parse(value);
    } catch(e) {
      // If not valid JSON, keep as string
    }
    
    if (key) {
      const transaction = db.transaction(['demoStore'], 'readwrite');
      const store = transaction.objectStore('demoStore');
      
      // Create an object with the specified ID and value
      const data = {
        id: parseInt(key) || key,
        value: value,
        timestamp: new Date().toISOString()
      };
      
      store.put(data);
      
      transaction.oncomplete = function() {
        refreshIndexedDB();
        console.log('Data saved to IndexedDB');
      };
    }
  });
  
  document.getElementById('idb-get').addEventListener('click', function() {
    const key = document.getElementById('idb-key').value;
    
    if (key) {
      const transaction = db.transaction(['demoStore'], 'readonly');
      const store = transaction.objectStore('demoStore');
      const request = store.get(parseInt(key) || key);
      
      request.onsuccess = function(event) {
        if (request.result) {
          document.getElementById('idb-data').textContent = JSON.stringify(request.result, null, 2);
        } else {
          document.getElementById('idb-data').textContent = `No data found for key: ${key}`;
        }
      };
    } else {
      refreshIndexedDB();
    }
  });
  
  document.getElementById('idb-delete').addEventListener('click', function() {
    const key = document.getElementById('idb-key').value;
    
    if (key) {
      const transaction = db.transaction(['demoStore'], 'readwrite');
      const store = transaction.objectStore('demoStore');
      store.delete(parseInt(key) || key);
      
      transaction.oncomplete = function() {
        refreshIndexedDB();
        console.log('Key removed from IndexedDB');
      };
    }
  });
  
  document.getElementById('idb-clear').addEventListener('click', function() {
    const transaction = db.transaction(['demoStore'], 'readwrite');
    const store = transaction.objectStore('demoStore');
    store.clear();
    
    transaction.oncomplete = function() {
      refreshIndexedDB();
      console.log('All data cleared from IndexedDB');
    };
  });

  // =========== HELPER FUNCTIONS ===========
  function refreshChromeStorage(type) {
    chrome.storage[type].get(null, function(items) {
      document.getElementById(`${type}-data`).textContent = JSON.stringify(items, null, 2);
    });
  }
  
  function refreshLocalStorage() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    document.getElementById('ls-data').textContent = JSON.stringify(data, null, 2);
  }
  
  function refreshIndexedDB() {
    const transaction = db.transaction(['demoStore'], 'readonly');
    const store = transaction.objectStore('demoStore');
    const request = store.getAll();
    
    request.onsuccess = function() {
      document.getElementById('idb-data').textContent = JSON.stringify(request.result, null, 2);
    };
  }
  
  function refreshAllStorageDisplays() {
    // Refresh all storage displays
    refreshChromeStorage('local');
    refreshChromeStorage('sync');
    refreshChromeStorage('session');
    refreshLocalStorage();
    // IndexedDB will be refreshed once it's initialized
  }
});
