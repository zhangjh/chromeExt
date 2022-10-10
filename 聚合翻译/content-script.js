
(function () {

    $("body").on("mouseup", function(e) {
        let selection = window.getSelection().toString().trim();
        if(selection && selection.length < 250) {
            if($("#float-icon").length === 0) {
                let x = e.pageX - 13;
                let y = e.pageY + 15;
                appendHtml(x, y);
            }
        } else {
            if($(e.target).is($("#float-icon"))) {
                return;
            }
            removeTip();
            removeTransContent();
        }
    });
})();

let globalConfig = {};

function appendHtml(x, y) {
    let transIconHtml = `
        <div class="trans-content-wrap">
            <div id="float-icon" style="top: ${y}px; left: ${x}px; position: absolute;">
                <div style="background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IArs4c6QAAAUxJREFUOE+VlMFRwzAURPebBiBDC77TAU4F1AGcqCC4Ak6EOqggTgfc3UIGKsCfWcXSfDtftvBFk5HztH93Ldnse0XBUwm2p8e6W3pV/gMj6FexuxK0HtiFUcWgOFgVVtntR9940ARToOOJg+KuEnxxheIagh2h3pib9/6Ve9/PdVinyhStCu4FaKBog7IFGLcJ9GHnuV4AvM1HzQVws+8PojgSeOGZGTfrmfWSsDCA4ngBC4oGNHbEnGcRykCYrquMnlGhWT8ZylodV3vm1SQHFUpcOpHy3WIz7THp+H+Zx+uB57BcSMKesFuE/DzV2xIY66PAAxO06pIyAktgVHXuMpq5nwHGh30pgdnqVBW6UKPRuwRjENyIn4Yd13pGGD/yZLoZNcG4aW8D/o7XTITZEdNhJtUJzDaaKunjeJNMPq1sz9ZaHapTeBv/ASjX0vBkK5XAAAAAAElFTkSuQmCC
    ); width: 19px; height: 19px; " />
                <div style="margin-left: 20px">
                    <select id="lang-select">
                        <option value="-1">选择引擎</option>
                        <option value="1">百度</option>
                        <option value="2">谷歌</option>
                        <option value="3">Bing</option>
                        <option value="4">有道</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    let transIconHtmlDiv = document.createElement("div");
    transIconHtmlDiv.innerHTML = transIconHtml;
    document.querySelector("body").appendChild(transIconHtmlDiv);

    // $("#lang-select").on("change", function(e) {
    //     selectedTransCb(e.target.value, x, y);
    // });
    $("#lang-select").on("change", function(e) {
        const type = e.target.value;
        if(type === "-1") {
            return;
        }
        selectedTransCb(e.target.value, x, y);
    });
    // 默认使用谷歌翻译，避免仅鼠标选中时并不需要翻译也自动翻译了，不自动调用
    // translate("2", window.getSelection().toString().trim(), null, null, function () {
    //     selectedTransCb("2", x, y)
    // });
}

// 选中划线翻译的回调函数
function selectedTransCb(type, x, y) {
    const selectionText = window.getSelection().toString().trim();
    translate(type, selectionText, null, null, function(ret) {
        if(ret.success) {
            showTransContent(ret.data, x + 100, y);
        }
    });
}

function translate(type, text, from, to, cb) {
    let url = "https://translate.favlink.cn/";
    const typeName = typeMapping(type);
    url += typeName;
    url += "?text=" + encodeURIComponent(text);
    let isCharacter = window.isCharacter(text);
    if(!from) {
        if(isCharacter) {
            from = "zh";
        } else {
            from = "en";
        }
    }
    url += "&from=" + from;

    if(!to) {
        if(isCharacter) {
            to = "en";
        } else {
            to = "zh";
        }
    }
    url += "&to=" + to;
    globalConfig = {
        type: type,
        text: text,
        originLang: isCharacter ? "中文" : "英文",
        targetLang: isCharacter ? "英文" : "中文"
    };
    $.ajax({
        url: url,
        success: function(ret) {
            cb(ret);
        }
    });
}

function removeTip() {
    const ele = $("#float-icon").parent();
    if(ele.length) {
        ele.remove();
    }
}

function removeTransContent() {
    const ele = $(".trans-content-wrap").parent();
    if(ele.length) {
        ele.remove();
    }
}

function showTransContent(ret, x, y) {
    let html = `
        <div class="origin-lang">源语种: ${globalConfig.originLang}</div>
        <div class="origin-text">${globalConfig.text}</div>
        <div class="target-lang">目标语种: ${globalConfig.targetLang}</div>
     `;
    if(!ret) {
        return;
    }
    if(ret.explains && globalConfig.type === "4") {
        if(ret.phonetic) {
            html += `<div class="target-text">音标: <span class="red">[${ret.phonetic}]</span></div>`;
        }
        for(let item of ret.explains) {
            html += `<div class="target-text">${item}</div>`;
        }
    } else {
        html += `<div class="target-text">${ret}</div>`;
    }
    let transContentHtml = `
        <div class="trans-content-wrap" style="top: ${y}px; left: ${x}px; position: absolute;
            background: white; z-index: 100;border: 0.5px solid lightgray";>
            <div class="translate-content"></div>
            <div id="translation">${html}</div>
        </div>
    `;

    let transContentHtmlDiv = document.createElement("div");
    transContentHtmlDiv.innerHTML = transContentHtml;
    document.querySelector("body").appendChild(transContentHtmlDiv);
}