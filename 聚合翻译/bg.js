
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: 'translate',
        title: '聚合翻译',
        type: 'normal',
        contexts: ['selection'],
    });

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        console.log(info);

        chrome.tabs.create({
            url: 'https://www.baidu.com'
        });
    });
});