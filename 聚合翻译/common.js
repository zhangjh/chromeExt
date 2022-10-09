
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