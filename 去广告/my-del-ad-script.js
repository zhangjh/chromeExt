var global = {
	ad_ids :  [
	    	//脚本之家
	    	"cproIframe2001holder",
	    	"cproIframe2004holder",
	    	"baidu300",
	    	"cproIframe2002holder",
	    	"art_1",
	    	"art_2",
	    	"art_3",
	    	"tonglan1",
	    	"con_all",
	    	"logo_m",
	    	"con_da2",
	    	"logo_r",
	    	"r1",
	    	"r2",
	    	"r3",
	    	//微博
	    	"v6_pl_content_biztips",
	    	"v6_pl_rightmod_rank",
	    	"v6_trustPagelet_recom_member",
	    	"v6_pl_rightmod_recominfo",
	    	"v6_pl_rightmod_attfeed",
	    	"v6_pl_rightmod_noticeboard",
	    	"v6_pl_content_setskin",
	    	"v6_pl_rightmod_myinfo",
            "v6_pl_content_biztips",
	    	//baidu
	    	"5001",
	    	"5002"
    	],
    	ad_classes : [
	    	"art_bot_ad",
	    	"tonglanad",
	    	"sm",
	    	"w300",
	    	"relatedarticle"
    	],
    	id_match: [
    		"BAIDU_UNION"
    	],
    	class_match:[
    	],
    	exclude: [
    		"alibaba",
    		"taobao",
    		"github",
    		"baidu"
    	]
}

function clearFun(global){
	console.info("clear start");
	
	var ad_ids = global.ad_ids;
	var ad_classes = global.ad_classes;
	
	for(var i=0,len=ad_ids.length;i<len;i++){
		$("#" + ad_ids[i]).remove();
	}

	for(var i=0,len=ad_classes.length;i<len;i++){
		$("." + ad_classes[i]).remove();
	}

	for(var k in global.id_match){
		$("[id*='" + global.id_match[k] +"']").remove();
	}

	//微博推荐信息流移除
	$("*[feedtype='ad']").remove();

	//简单的广告智能预测 (元素包含ad)
	// $("iframe").hide();
	var eles = $("*[id*='ad'],*[class*='id']");

	eles.each(function(i,ele){
		var idClass = $(ele).attr("id") || $(ele).attr("class");
		if(/[^a-zA-Z]ad/i.test(idClass) || /cproIframe/.test(idClass)){
			$(ele).hide();
		}
	});

	$("*[id*='BAIDU_SSP']").hide();
	$("*[class*='adsbygoogle']").hide();

	if($("b:contains('赞助商')").length){
		$("b:contains('赞助商')").parent().hide();
	}
	if($("a:contains('推广链接')").length){
		$("a:contains('推广链接')").parent().hide();
		// if($("a:contains('推广链接')").parent().parent().attr("id").match(/content/)){
		//     $("a:contains('推广链接')").parent().hide()
		// }else{
		//     $("a:contains('推广链接')").parent().parent().hide();
		// }
	}
        console.log("clear end");
}

function genExp(arr){
	return new RegExp(arr.join("|"));
}

(function clearAd (argument) {
	window.onload = function (){
		var curUrl = window.location.href;
    		var regExp = genExp(global.exclude);
    		
    		if(!regExp.test(curUrl)){
    			clearFun(global);
    		}
	};
})();
