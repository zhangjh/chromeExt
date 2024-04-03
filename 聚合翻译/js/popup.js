(function () {
    window.initLangs();

    const translateEngine = localStorage.getItem("translate_engine");
    if(translateEngine) {
        $("#search-bar select").val(translateEngine);
    }

    let translateBtn = $("#translate-btn");
    translateBtn.on("click", function() {
        doAction();
    });

    document.addEventListener("keydown", function (e) {
        doAction();
    });

//    let translatePageBtn = $("#translate-page");
//    console.log($("body").html());

    let newTranslateBtn = $("#new-translation");
    newTranslateBtn.on("click", function() {
        $(".translate-content").hide();
        $("#search-bar").show();
    });
})();

function translate(type, text, from, to) {
    let url = "https://translate.zhangjh.cn/";
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
    window.commonTranslate(type, url, function(ret) {
        $("#search-bar").hide();
        $(".translate-content").show();
        const originLang = isCharacter ? "中文" : "英文";
        const targetLang = isCharacter ? "英文" : "中文";
        // 有道的特殊处理一下
        let html = `
                <div class="origin-lang">源语种: ${originLang}</div>
                <div class="origin-text">${text}</div>
                <div class="target-lang">目标语种: ${targetLang}</div>
             `;
        if(!ret.data) {
            return;
        }
        if(type === "4") {
            if(ret.data.explains) {
                if(ret.data.phonetic) {
                    html += `<div class="target-text">音标: <span class="red">[${ret.data.phonetic}]</span></div>`;
                }
                for(let item of ret.data.explains) {
                    html += `<div class="target-text">${item}</div>`;
                }
            } else if(ret.data.translation) {
                for(let item of ret.data.translation) {
                    html += `<div class="target-text">${item}</div>`;
                }
            }
        } else {
            html += `<div class="target-text">${ret.data}</div>`;
        }
        $("#translation").html(html);
    }, function (err) {
        alert(err);
    });
}

function doAction() {
    let text = $("#text-input").val().trim();
    console.log(text);
    let type = $("select").val();
    if(text && type) {
        const from = window.isCharacter(text) ? "zh" : "en";
        const to = from === "zh" ? "en" : "zh";
        // 请求翻译接口
        translate(type, text, from, to);
    }
}