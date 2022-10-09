let transIconHtml = `
    <div id="float-icon" style="">
        <div class="float-icon" style="background-image: url('./icon_19.png');" />
    </div>
`;

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: 'translate',
        title: '聚合翻译',
        type: 'normal',
        contexts: ['selection'],
    });

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        console.log(info);
        const selectionText = info.selectionText;
        // 合适的长度弹出弹窗
        if(selectionText.length < 250) {
            console.log($("title").text());
        }
        console.log(selectionText);

        $("body").append(transIconHtml);

        alert(111);
        chrome.tabs.create({
            url: 'https://www.baidu.com'
        });
    });
});
//
// chrome.contextMenus.create({
//     title: '聚合翻译：%s',
//     type: 'normal',
//     id: 'combinedTranslate',
//     contexts: ['all'],
//     onclick: function(info, tab) {
//         // chrome.tabs.create({
//         //     url: 'https://translate.google.cn/#en/zh-CN/' + encodeURI(info.selectionText)
//         // });
//         console.log(info);
//         alert(11);
//     }
// }, function() {
//     console.log(chrome.extension.lastError);
// })