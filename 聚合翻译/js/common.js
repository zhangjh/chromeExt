
window.isCharacter = function isCharacter(str) {
    const reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    return reg.test(str);
}

window.langsCode2Desc = function langsCode2Desc(type, code) {
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

window.langsDesc2Code = function langsDesc2Code(type, desc) {
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

window.typeMapping = function typeMapping(type) {
    switch (type) {
        case "1":
            return "baidu";
        case "2":
            return "google";
        case "3":
            return "bing";
        case "4":
            return "youdao";
        // case "5":
        //     return "chatGpt";
        case "5":
            return "gemini";
    }
}

window.isJSON = function isJSON(str) {
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

window.initLangs = function() {
    if(!window.localStorage.langs) {
        // 获取语种列表存入本地缓存
        // baidu
        $.ajax({
            url: "https://translate.zhangjh.cn/baidu/lang",
            async: true,
            success: function(ret) {
                localStorage.setItem("langs.baidu", JSON.stringify(ret.data));
            }
        });
        // google
        $.ajax({
            url: "https://translate.zhangjh.cn/google/lang",
            async: true,
            success: function(ret) {
                localStorage.setItem("langs.google", JSON.stringify(ret.data));
            }
        });
        // bing
        $.ajax({
            url: "https://translate.zhangjh.cn/bing/lang",
            async: true,
            success: function(ret) {
                localStorage.setItem("langs.bing", JSON.stringify(ret.data));
            }
        });
        // youdao
        $.ajax({
            url: "https://translate.zhangjh.cn/youdao/lang",
            async: true,
            success: function(ret) {
                localStorage.setItem("langs.youdao", JSON.stringify(ret.data));
            }
        });
    }
}

// url, cb
window.commonTranslate = function (type, url, cb, fail) {
    // 百度、有道读取各自应用信息
    if(type === "1" || type === "4") {
        const appIdKey = window.typeMapping(type) + "_appId";
        const appSecretKey = window.typeMapping(type) + "_appSecret"
        chrome.storage.local.get([appIdKey, appSecretKey], function (ret) {
            const appId = ret[appIdKey];
            const appSecret = ret[appSecretKey];
            if(appId && appSecret) {
                url += "&appId=" + appId + "&appSecret=" + appSecret;
                window.get(url, cb, fail);
                return;
            }
            fail("请先在选项页配置应用程序信息！");
        });
        return;
    }
    // else if(type === "5") {
    //     // chatGpt使用另外的接口
    //     url.replace(url.substring(0, url.indexOf("?")), "https://translate.zhangjh.cn/chatGpt");
    //     url += "&transMode=true";
    // }
    else if(type === "5") {
        url.replace(url.substring(0, url.indexOf("?")), "https://translate.zhangjh.cn/gemini")
        url = new URL(url);
        const params = new URLSearchParams(url.search);
        window.post(url.origin + url.pathname,
            {
                text: params.get("text"),
                from: params.get("from"),
                to: params.get("to")} , cb, fail);
        return;
    }
    window.get(url, cb, fail);
}

window.get = function (url, succCb, failCb) {
    $.ajax({
        url: url,
        success: function (ret) {
            succCb(ret);
        },
        fail: function (err) {
            failCb(err);
        }
    });
}

window.post = function (url, body, succCb, failCb) {
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(body),
        contentType: "application/json",
        success: function (ret) {
            succCb(ret);
        },
        fail: function (err) {
            failCb(err);
        }
    })
}