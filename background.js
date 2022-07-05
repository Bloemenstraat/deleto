import {deleteTags} from './usage.js';

chrome.action.onClicked.addListener((tab) => {

    chrome.storage.sync.get({history: false, tab: false, usepass: false}, (settings)=> {
        chrome.storage.sync.get('keywords', (data) => {

            if (settings.history == true)
              chrome.history.deleteAll();
            else if(settings.history == false) {
              deleteTags(data.keywords, settings.tab);
            }

        });
    });       
});
