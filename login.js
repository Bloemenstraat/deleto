chrome.storage.sync.get({history: false, tab: false, usepass: false}, (settings) => {
    if (settings.usepass == false)
        window.location.href = './options.html';
    
    else {
        document.querySelector('.login').style.opacity = 1;

        document.querySelector('.default-btn').addEventListener('click', async () => {
            await chrome.storage.sync.set({history: false, tab: false, usepass: false});
            await chrome.storage.sync.set({keywords: []});
            await chrome.storage.sync.set({password: 'admin'});
            window.location.href = './options.html';
        });

        document.querySelector('.btn').addEventListener('click', async () => {
            const data = await chrome.storage.sync.get({password: 'admin'});
            let enteredPassword = document.querySelector('.login input').value;

            if (data.password !== enteredPassword) {
                alert('Wrong password');
                return;
            }

            window.location.href = './options.html';
        });
    }
});