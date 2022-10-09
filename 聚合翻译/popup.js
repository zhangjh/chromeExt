(function () {
    initLangs();

    let translateBtn = $("#translate-btn");
    translateBtn.on("click", function() {
        let text = $("#text-input").val().trim();
        console.log(text);
        let type = $("select").val();
        if(text && type) {
            // 请求翻译接口
            translate(type, text, undefined, undefined);
        }
    });

//    let translatePageBtn = $("#translate-page");
//    console.log($("body").html());

    let newTranslateBtn = $("#new-translation");
    newTranslateBtn.on("click", function() {
        $(".translate-content").hide();
        $("#search-bar").show();
    });
})();

function initLangs() {
    if(!window.localStorage.langs) {
        // 获取语种列表存入本地缓存
        // baidu
        $.ajax({
            url: "http://translate.favlink.cn/baidu/lang",
            success: function(ret) {
                console.log(JSON.stringify(ret.data));
                localStorage.setItem("langs.baidu", JSON.stringify(ret.data));
            }
        });
        // google
        $.ajax({
            url: "http://translate.favlink.cn/google/lang",
            success: function(ret) {
                console.log(JSON.stringify(ret.data));
                localStorage.setItem("langs.google", JSON.stringify(ret.data));
            }
        });
        // bing
        $.ajax({
            url: "http://translate.favlink.cn/bing/lang",
            success: function(ret) {
                console.log(JSON.stringify(ret.data));
                localStorage.setItem("langs.bing", JSON.stringify(ret.data));
            }
        });
        // youdao
        $.ajax({
            url: "http://translate.favlink.cn/youdao/lang",
            success: function(ret) {
                console.log(JSON.stringify(ret.data));
                localStorage.setItem("langs.youdao", JSON.stringify(ret.data));
            }
        });
    }
}

function translate(type, text, from, to) {
    let url = "https://translate.favlink.cn/";
    const typeName = window.typeMapping(type);
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
    $.ajax({
        url: url,
        success: function(ret) {
             $("#search-bar").hide();
             $(".translate-content").show();
             const originLang = window.langsCode2Desc(typeName, from);
             const targetLang = window.langsCode2Desc(typeName, to);
             // 有道的特殊处理一下
             let html = `
                <div class="origin-lang">源语种: ${originLang}</div>
                <div class="origin-text">${text}</div>
                <div class="target-lang">目标语种: ${targetLang}</div>
             `;
             if(ret.data.errorCode && type === "4") {
                 html += `
                    <div class="target-text">${ret.data.translation}</div>
                 `;
             } else {
                 html += `<div class="target-text">${ret.data}</div>`;
             }
             $("#translation").html(html);
        }
    });
}