define(function(require) {

	var parseDate = function(str) {
		if(typeof str == 'string'){  
			var results = str.match(/^\ *(\d{4})-(\d{1,2})-(\d{1,2})\ *$/);
			if(results && results.length>3) {
				return new Date(Number(results[1]),Number(results[2]) -1,Number(results[3]));  
			}
			results = str.match(/^\ *(\d{4})-(\d{1,2})-(\d{1,2})\ +(\d{1,2}):(\d{1,2}):(\d{1,2})\ *$/);  
			if(results && results.length>6) {
				return new Date(Number(results[1]),Number(results[2]) -1,Number(results[3]),Number(results[4]),Number(results[5]),Number(results[6]));
			} 
			results = str.match(/^\ *(\d{4})-(\d{1,2})-(\d{1,2})\ +(\d{1,2}):(\d{1,2}):(\d{1,2})\/.(\d{1,9})\ *$/);  
			if(results && results.length>7) {
				return new Date(Number(results[1]),Number(results[2]) -1,Number(results[3]),Number(results[4]),Number(results[5]),Number(results[6]),Number(results[7]));   
			}
		}
		return null;  
	};
	/**
	 * 格式化日期
	 * @param  {Date|Number} date 时间对象或时间戳
	 * @param  {String} fmt  字符串格式
	 */
	var formatDate = function(date, fmt) { 
		if(!(date instanceof Date)) {
			date = new Date(date);
		}

		var o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"h+": date.getHours(), //小时 
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds(), //秒 
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
			"S": date.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
		return fmt;
	}

	return {
		parseDate: parseDate,
		formatDate: formatDate
	};
});