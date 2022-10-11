let config = {};

(function () {
    let translateEngine = localStorage.getItem("translate_engine");
    if(!translateEngine) {
        translateEngine = $("#engine-options select").val();
    }
    if(translateEngine) {
        setLangs(translateEngine);
        fillValue(translateEngine);
    }
    config.type = translateEngine;

    $("#engine-options").on("change", function (e) {
        config = {};
        $(".engine-set-panel").hide();
        const type = e.target.value;
        config.type = type;
        setLangs(type);
        let url = "";
        // 引擎不为google或者bing时需要配置
        if(type !== "2" && type !== "3") {
            switch (type) {
                case "1":
                    url = "https://fanyi-api.baidu.com/product/11";
                    break;
                case "4":
                    url = "https://ai.youdao.com/product-fanyi-text.s";
            }
            $("#panel-tips a").attr("href", url);
            $("#engine-set").show();
        } else {
            $("#engine-set").hide();
        }
    });

    $("#engine-set").on("click", function () {
        $("#panel-title").text(window.typeMapping(config.type) + "配置");
        fillValue(config.type);
        $(".engine-set-panel").show();
    });

    $("#panel-cancel-btn").on("click", function () {
        $(".engine-set-panel").hide();
    });

    $("#panel-save-btn").on("click", function () {
        config.appId = $("#panel-appId input").val();
        config.appSecret = $("#panel-appSecret input").val();
        $(".engine-set-panel").hide();
    });

    $("#save-btn").on("click", function () {
        saveConfig();
    });
})();

function fillValue(type) {
    // 回填翻译引擎
    const translateEngine = localStorage.getItem("translate_engine");
    if(translateEngine) {
        $("#engine-options select").val(translateEngine);
    }
    const appIdKey = window.typeMapping(type) + "_appId";
    const appSecretKey = window.typeMapping(type) + "_appSecret"
    chrome.storage.local.get([appIdKey, appSecretKey], function (ret) {
        const appId = ret[appIdKey];
        const appSecret = ret[appSecretKey];
        if(appId && appSecret) {
            $("#panel-appId input").val(appId);
            $("#panel-appSecret input").val(appSecret);
        }
    });
}

function setLangs(type) {
    const langs = window.localStorage.langs
    if(!langs) {
        window.initLangs();
    }
    const typeLangsStr = localStorage.getItem("langs." + window.typeMapping(type));
    const typeLangs = JSON.parse(typeLangsStr);
    let optionsHtml = "";
    for (let code in typeLangs) {
        const lang = typeLangs[code];
        if(lang.includes("中文") && !lang.includes("繁体")) {
            optionsHtml += `<option value="${code}" selected>${lang}</option>`;
        } else {
            optionsHtml += `<option value="${code}">${lang}</option>`;
        }
    }
    $("#lang-options select").html(optionsHtml);
}

function saveConfig() {
    console.log(config);
    // 设置翻译引擎
    localStorage.setItem("translate_engine", config.type);
    // 设置主要语言
    const mainLang = $("#lang-options select").val();
    localStorage.setItem(window.typeMapping(config.type) + "_mainLang", mainLang);
    // 设置应用程序信息
    if(config.type === "1" || config.type === "4") {
        if(config.appId && config.appSecret) {
            // 设置应用程序信息
            // localStorage.setItem(window.typeMapping(config.type) + "_appId", config.appId);
            // localStorage.setItem(window.typeMapping(config.type) + "_appSecret", config.appSecret);
            const appInfo = {};
            appInfo[window.typeMapping(config.type) + "_appId"] = config.appId;
            appInfo[window.typeMapping(config.type) + "_appSecret"] = config.appSecret;
            chrome.storage.local.set(appInfo, function() {
                console.log(appInfo);
            });
        } else {
            $("#msg-tips").html(window.typeMapping(config.type) + "翻译需要配置！");
            return;
        }
    }
    $("#msg-tips").html("保存成功！");
}