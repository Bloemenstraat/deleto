import * as usage from './usage.js';
import * as behaviour from './behaviour.js';

class Toggle extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <label class="switch">
                <input type="checkbox">
                <span class="slider round"></span>
            </label>`;
    }
}

class Tag extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<div class="tag"><label>${this.textContent}</label><span class="cross"></span></div>`;
    }
}

customElements.define('toggle-component', Toggle);
customElements.define('tag-component', Tag);

async function loadSettings() {
    let default_settings = {
        history: false, 
        tab: false,
        cache: false,
        cookies: false,
        deletepass: false,
        download: false,
        autofill: false,
        settings: false,
        appdata: false,
        activatecount: false,
        freeze: false,
        notif: false,
        panel: false,
        usepass: false
    };

    chrome.storage.sync.get(default_settings, (settings) => {

        //Bind toggles to events
        const toggles = document.getElementsByTagName('toggle-component');

        for (let i = 0; i < toggles.length; i++) {
            const input = toggles[i].querySelector('input');
            const inputLabel = toggles[i].closest('label').className
            input.checked = settings[inputLabel];

            input.addEventListener('change', function () {
                settings[inputLabel] = this.checked;
                chrome.storage.sync.set(settings);
                behaviour.updateBehaviour(settings);
            });
        }    
        
        behaviour.updateBehaviour(settings);
    });

    let [hours, minutes] = await Promise.all([chrome.storage.sync.get({hours: 0}), chrome.storage.sync.get({minutes: 0})])

    document.querySelector('#minutes').value = minutes.minutes;
    document.querySelector('#hours').value = hours.hours;

}

function loadKeywords() {
    chrome.storage.sync.get({keywords: []}, (data) => {
        
        for (let i = 0; i < data.keywords.length; i++) {
            const tag = document.createElement('tag-component');
            tag.appendChild(document.createTextNode(data.keywords[i]));    
            document.querySelector('.tags').appendChild(tag); 

            const suppr = tag.querySelector('span.cross');
            suppr.onclick = function() {
                this.closest('div').remove();
                updateKeywords();
            };
        }        
    });    
}

function updateKeywords() {
    let htmlTags = document.getElementsByClassName('tag');
    let tags = [];

    for (let i = 0; i < htmlTags.length; i++) {
        tags.push(htmlTags[i].querySelector('label').textContent);
    }

    chrome.storage.sync.set({keywords: tags});    
}

function addKeyword() {
    const keyword = document.querySelector('#keyword').value;
    if (keyword.length == 0)
        return

    const tag = document.createElement('tag-component');
    tag.appendChild(document.createTextNode(keyword));    
    document.querySelector('.tags').appendChild(tag); 

    const suppr = tag.querySelector('span.cross');
    suppr.onclick = function() {
        this.closest('tag-component').remove();
        updateKeywords();
    };
    
    document.querySelector('#keyword').value = '';
    updateKeywords();
}

function deleteKeywords () {
    let htmlTags = document.getElementsByTagName('tag-component');
    console.log(htmlTags.length)

    for (let i = htmlTags.length-1; i >= 0; i--) {
        htmlTags[i].remove();
    }

    chrome.storage.sync.set({keywords: []}); 
}

function savePassword() {
    const password = document.querySelector('#password').value;
    const passwordConf = document.querySelector('#password-conf').value;

    if (password == '') 
        return;

    if (password !== passwordConf) {
        alert('Password not matching.');
        return;
    }

    chrome.storage.sync.set({password: password}, () => {
        alert('Password saved.')
    });

}

//Load old parameters
loadKeywords(); loadSettings();

//Event listeners
document.querySelector('#keyword').addEventListener('keypress', (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        document.querySelector('.addbar .btn').click();
    }
        
});
document.querySelector('.addbar .btn').addEventListener('click', addKeyword);
document.querySelector('.btn-save').addEventListener('click', savePassword);
document.querySelector('.clear').addEventListener('click', deleteKeywords);

document.querySelector('#minutes').addEventListener('change', (e) => {
    let time = parseInt(e.target.value)
    if (isNaN(time))
        time = 0;
    else if (time >= 60) {
        let hours = Math.floor(time / 60);
        time -= hours*60;
        //e.target.value = time;
        document.querySelector('#hours').dispatchEvent(new CustomEvent('change', {detail: hours}));
    }
    //else {}
        //e.target.value = time;

    e.target.value = time.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    chrome.storage.sync.set({minutes: e.target.value})
});

document.querySelector('#hours').addEventListener('change', (e) => {
    let time = parseInt(e.target.value)
    if (isNaN(time))
        time = 0;
    else if (time > 99)
        time = 99;
    //else 
    //    e.target.value = time;
    if (e.detail) {
        time += e.detail; 
        //e.target.value = time;
    }
    
    e.target.value = time.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    chrome.storage.sync.set({hours: e.target.value})
});

document.querySelector('#paypal').addEventListener('click', function() {
    document.querySelector('#donation').value = 'ahmed.goubi@gmail.com';
    document.querySelector('.donation-address img').src = "./media/paypal_input.svg";

});
document.querySelector('#bitcoin').addEventListener('click', function() {
    document.querySelector('#donation').value = '1CcRG6S5oQCNmapN5EiyhYc71XVayRy27P';  
    document.querySelector('.donation-address img').src = "./media/bitcoin_input.svg";  
});
document.querySelector('#ethereum').addEventListener('click', function() {
    document.querySelector('#donation').value = '0x09719b30516efdc1e9ab24c9eaa49060d57dad08';  
    document.querySelector('.donation-address img').src = "./media/ethereum_input.svg";   
});

let radios = document.querySelector('.appearance-opt').getElementsByTagName('input');

let backgroundMode = 'white', textColor = 'black', logo = './media/logo.svg';
let donationBackground = 'black', donationText = 'white';

for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('click', () => {
        switch(radios[i].value) {
            case 'dark':
                backgroundMode = 'black', textColor = 'white', logo = './media/logo_white.svg';
                donationBackground = 'white', donationText = 'black';
                break;
            case 'blue':
                backgroundMode = '#001D40', textColor = 'white', logo = './media/logo_white.svg';
                donationBackground = 'white', donationText = 'black';
                break;
            default:
                backgroundMode = 'white', textColor = 'black', logo = './media/logo.svg'; 
                donationBackground = 'black', donationText = 'white';               
        }

        document.querySelector(':root').style.setProperty('--background-mode', backgroundMode);
        document.querySelector(':root').style.setProperty('--text-color', textColor);
        document.querySelector('.logo').src = logo;
        document.querySelector('#donation').style.setProperty('background-color', donationBackground);
        document.querySelector('#donation').style.setProperty('color', donationText);
    });
}