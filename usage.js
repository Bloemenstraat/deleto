export function deleteCache() {
    chrome.browserData.removeCache({});
    chrome.browserData.removeCacheStorage({});
}

export function deleteCookies() {
    chrome.browserData.removeCookies({});    
}

export function deletePasswords() {
    chrome.browserData.removePasswords({});     
}

export function deleteDownloads() {
    chrome.browserData.removeDownloads({});    
}

export function deleteAppdata() {
    chrome.browserData.removeAppcache({});
}

export function autofill() {
}

export function deleteSiteSettings() {
}

export function deleteTags(keywords, deleteTabs) {
    
    if (!keywords)
        return

    for (let i = 0; i < keywords.length; i++) {    
        chrome.history.search({'text': '', 'startTime': 0, 'maxResults': 0}, (sites) => {
            let num = sites.length;
            console.log(`Number of history items: ${num}`)
            if (num == 0){}
            else {
                for (let j = 0; j < num; j++)
                    chrome.history.deleteUrl({'url': sites[i].url});
            }
        });
    }

    if (!deleteTabs)
        return

    chrome.tabs.query({}, (tabs) => {

        for (let i = 0; i < tabs.length; i++) {
            for (let j = 0; j < keywords.length; j++) {
                if (tabs[i].title.toLowerCase().includes(keywords[j].toLowerCase())) {
                    chrome.tabs.remove(tabs[i].id);
                }
            }
        }
    });
}