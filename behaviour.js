import {deleteTags} from './usage.js';

let freezeTime;
let intervalID;

function freezeListener () {
    chrome.history.search({'text': '', 'startTime': freezeTime, 'maxResults': 0}, (sites) => {
        let num = sites.length;
        
        if (num == 0){}
        else {
            for (let i = 0; i < num; i++)
                chrome.history.deleteUrl({'url': sites[i].url});  
        }
    });
}

export function freezeHistory() {
    console.log('Freezed')
    freezeTime = Date.now();

    chrome.tabs.onUpdated.addListener(freezeListener);
}

export function unfreezeHistory() {
    console.log('unfreeze')
    chrome.tabs.onUpdated.removeListener(freezeListener);
}

export async function setCountdown() {

    let [hours, minutes] = await Promise.all([chrome.storage.sync.get({hours: 0}), chrome.storage.sync.get({minutes: 0})])

    let time = (hours.hours*60 + minutes.minutes) * 60 * 1000;

    console.log(time)

    if (time == 0)
        return;

    intervalID = setInterval(() => {
        console.log('zgueg')
    }, time);

}

export function stopCountdown() {
    clearInterval(intervalID);
}

export function updateBehaviour(settings) {
    if (settings.freeze)
        freezeHistory();
    else if (!settings.freeze)
        unfreezeHistory();

    if (settings.activatecount)
        setCountdown();
    else if (!settings.activatecount)
        stopCountdown();
}