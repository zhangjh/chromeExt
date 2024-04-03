
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: 'translateMenu',
        title: '聚合翻译: %s',
        type: 'normal',
        contexts: ['selection'],
    });

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        //如果 id === ↑创建的菜单的id
        if (info.menuItemId === 'translateMenu') {
            //创建一个 标签页 url是：百度的翻译API 翻译内容是用户选中的内容
            chrome.tabs.create({
                url: `http://fanyi.baidu.com/#lang-auto/lang-auto/${info.selectionText}`
            })
        }
    })
});