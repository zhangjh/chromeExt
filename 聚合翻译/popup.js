(function () {
    initLangs();

    let translateBtn = $("#translate-btn");
    console.log(translateBtn);
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
            url: "http://translate.favlink.cn:8888/baidu/lang",
            success: function(ret) {
                console.log(JSON.stringify(ret.data));
                localStorage.setItem("langs.baidu", JSON.stringify(ret.data));
            }
        });
        // google
        $.ajax({
            url: "http://translate.favlink.cn:8888/google/lang",
            success: function(ret) {
                console.log(JSON.stringify(ret.data));
                localStorage.setItem("langs.google", JSON.stringify(ret.data));
            }
        });
        // bing
        $.ajax({
            url: "http://translate.favlink.cn:8888/bing/lang",
            success: function(ret) {
                console.log(JSON.stringify(ret.data));
                localStorage.setItem("langs.bing", JSON.stringify(ret.data));
            }
        });
        // youdao
        $.ajax({
            url: "http://translate.favlink.cn:8888/youdao/lang",
            success: function(ret) {
                console.log(JSON.stringify(ret.data));
                localStorage.setItem("langs.youdao", JSON.stringify(ret.data));
            }
        });
    }
}

function translate(type, text, from, to) {
    let url = "http://translate.favlink.cn:8888/";
    const typeName = typeMapping(type);
    url += typeName;
    url += "?text=" + encodeURIComponent(text);
    if(!from) {
        if(isCharacter(text)) {
            from = "zh";
        } else {
            from = "en";
        }
    }
    url += "&from=" + from;

    if(!to) {
        if(isCharacter(text)) {
            to = "en";
        } else {
            to = "zh";
        }
    }
    url += "&to=" + to;
    $.ajax({
        url: url,
        success: function(ret) {
             console.log(ret);
             $("#search-bar").hide();
             $(".translate-content").show();
             const originLang = langsCode2Desc(typeName, from);
             const targetLang = langsCode2Desc(typeName, to);
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

function isCharacter(str) {
    const reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    return reg.test(str);
}

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }
    return false;
}

function typeMapping(type) {
    switch (type) {
        case "1":
            return "baidu";
        case "2":
            return "google";
        case "3":
            return "bing";
        case "4":
            return "youdao";
    }
}

function langsCode2Desc(type, code) {
    const typeLangs = localStorage.getItem("langs." + type);
    if(typeLangs) {
        const typeLangsJSON = JSON.parse(typeLangs);
        for(const key in typeLangsJSON) {
            if(key.startsWith(code)) {
                return typeLangsJSON[key];
            }
        }
    }
}

function langsDesc2Code(type, desc) {
    const typeLangs = localStorage.getItem("langs." + type);
    if(typeLangs) {
        const typeLangsJSON = JSON.parse(typeLangs);
        for(const key in typeLangsJSON) {
            if(typeLangsJSON[key].startsWith(desc)) {
                return key;
            }
        }
    }
}