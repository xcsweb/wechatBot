function getDay(date) {
  var date2 = new Date();
  var date1 = new Date(date);
  var iDays = parseInt(Math.abs(date2.getTime()- date1.getTime()) /1000/60/60/24);
  return iDays;
}
function formatDate(date) {
  var tempDate = new Date(date);
  var year = tempDate.getFullYear();
  var month = tempDate.getMonth() + 1;
  var day = tempDate.getDate();
  var hour = tempDate.getHours();
  var min = tempDate.getMinutes();
  var second = tempDate.getSeconds();
  if (hour < 10) {
	hour = "0" + hour;
  }
  if (min < 10) {
	min = "0" + min;
  }
  if (second < 10) {
	second = "0" + second;
  }
  return year + "年" + month + "月" + day + "日 " + hour + ":" + min + ":" + second;
}
function dateFormat(fmt, date) { //author: meizz
  var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S+": date.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((("" + o[k]).length == 1) ? ("00" + o[k]).substr(("" + o[k]).length) : ("00" + o[k]).substr(2, RegExp.$1.length)));
      }
  }
  return fmt;
}
module.exports = {
  getDay,formatDate,dateFormat
}
