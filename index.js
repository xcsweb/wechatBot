/**
 * WechatBot
 *  - https://github.com/gengchen528/wechatBot
 */
const {Wechaty,Friendship} = require('wechaty')
const schedule = require('./schedule/index')
const config = require('./config/index')
const untils = require('./untils/index')
const superagent = require('./superagent/index')
const {FileBox} = require('file-box') //文件读取模块
const http=require("http");
var qs = require('querystring');
// sayGroup()
//  二维码生成
function onScan (qrcode, status) {
  require('qrcode-terminal').generate(qrcode)  // 在console端显示二维码
  const qrcodeImageUrl = [
	'https://api.qrserver.com/v1/create-qr-code/?data=',
	encodeURIComponent(qrcode),
  ].join('')
  console.log(qrcodeImageUrl)
}

// 登录
async function onLogin (user) {
  console.log(`贴心小助理${user}登录了`)
  // 登陆后创建定时任务
  // schedule.setSchedule(config.SENDDATE,()=>{
	// console.log('你的贴心小助理开始工作啦！')
  //   main()
	// })
	sayFn()
}

//登出
function onLogout(user) {
  console.log(`${user} 登出`)
}
// 监听对话 根据关键词自动加群
async function onMessage (msg) {
  const contact = msg.from() // 发消息人
  const content = msg.text() //消息内容
  const room = msg.room() //是否是群消息
  const roomCodeUrl = FileBox.fromUrl(config.ROOMCODEURL) //来自url的文件
  const roomCodeLocal = FileBox.fromFile(config.ROOMLOCALPATH) //添加本地文件
  if (msg.self()) {
	return
  }
  if(room){ // 如果是群消息
	const topic = await room.topic()
    console.log(`群名: ${topic} 发消息人: ${contact.name()} 内容: ${content}`)
  }else { // 如果非群消息
	console.log(`发消息人: ${contact.name()} 消息内容: ${content}`)
	if(config.AUTOADDROOM){ //判断是否开启自动加群功能
	  let addRoomReg = eval(config.ADDROOMWORD)
	  let roomReg = eval(config.ROOMNAME)
	  if(addRoomReg.test(content)&&!room){
		let keyRoom = await this.Room.find({topic: roomReg})
		if(keyRoom){
		  try{
			await contact.say(roomCodeLocal||roomCodeUrl)
			await keyRoom.say('微信每日说：欢迎新朋友', contact)
		  }catch (e) {
			console.error(e)
		  }
		}
	  }else {
		await contact.say('你好，不要轻易调戏我，我只会发群二维码，不会聊天的！')
		await contact.say('请回复暗号：加群  获取群二维码图片')
	  }
	}
  }
}
// 自动加好友功能
async function onFriendShip(friendship) {
  let logMsg
  try {
	logMsg = '添加好友' + friendship.contact().name()
	console.log(logMsg)

	switch (friendship.type()) {
		/**
		 *
		 * 1. New Friend Request
		 *
		 * when request is set, we can get verify message from `request.hello`,
		 * and accept this request by `request.accept()`
		 */
	  case Friendship.Type.Receive:
	    let addFriendReg = eval(config.ADDFRIENDWORD)
		if (addFriendReg.test(friendship.hello())&&config.AUTOADDFRIEND) { //判断是否开启自动加好友功能
		  logMsg = '自动添加好友，因为验证信息中带关键字‘每日说’'
		  await friendship.accept()
		} else {
		  logMsg = '没有通过验证 ' + friendship.hello()
		}
		break
		/**
		 *
		 * 2. Friend Ship Confirmed
		 *
		 */
	  case Friendship.Type.Confirm:
		logMsg = 'friend ship confirmed with ' + friendship.contact().name()
		break
	}
  } catch (e) {
	logMsg = e.message
  }
  console.log(logMsg)
}
// 自动发消息功能
async function main() {
  let logMsg
  let  contact = await bot.Contact.find({name:config.NICKNAME}) || await bot.Contact.find({alias:config.NAME}) // 获取你要发送的联系人
  let one = await superagent.getOne() //获取每日一句
  let weather = await superagent.getWeather() //获取天气信息
  let today = await untils.formatDate(new Date())//获取今天的日期
  let memorialDay = untils.getDay(config.MEMORIAL_DAY)//获取纪念日天数
  let str = today + '<br>' + '第' + memorialDay + '天提醒你'
	  + '<br><br>今日天气早知道<br>' + weather.weatherTips +'<br>' +weather.todayWeather+ '<br>每日一句:<br>'+one+'<br><br>';
  try{
    logMsg = str
	await contact.say(str) // 发送消息
  }catch (e) {
	logMsg = e.message
  }
  console.log(logMsg)
}

// 自动发群消息功能
async function sayGroup() {
  var options = {
		hostname: 'v.juhe.cn',
		port: 80,
		path: '/toutiao/index',
		method: 'POST',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
		}
	 };
	 
	var request = http.request(options, function (res) {  
    console.log('STATUS: ' + res.statusCode);  
    console.log('HEADERS: ' + JSON.stringify(res.headers));  
    res.setEncoding('utf8');  
		let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });	 
		res.on('end',async () => {
			try {
				const parsedData = JSON.parse(rawData);
				// console.log(parsedData.result.data);
				let newsList=parsedData.result.data.map((item)=>{
					return{
						title:item.title,
						url:item.url
					}
				})
				let newsStr="";
				let  contact = await bot.Contact.find({name:config.NICKNAME}) || await bot.Contact.find({alias:config.NAME}) // 获取你要发送的联系人
				for(let i=0;i<newsList.length;i++){
					newsStr+="标题"+newsList[i].title+"<br/>"+"内容"+newsList[i].url+"<br/>"
				}
				await contact.say(newsStr)
			} catch (e) {
				console.error(e.message);
			}
		});
	});  
  request.on('error', function (e) {  
			console.log('problem with request: ' + e.message);  
	});  
	 request.write(qs.stringify({
		 key:"b181234c8dd488866e6cc05b308b12b3",
		 type:""
	 }));
	 request.end();
}
// 自动发消息功能
async function sayMain({NICKNAME="",NAME="",MEMORIAL_DAY="",MSG=""}={}) {
  let logMsg
  let  contact = await bot.Contact.find({name:NICKNAME}) || await bot.Contact.find({alias:NAME}) // 获取你要发送的联系人
  let one = await superagent.getOne() //获取每日一句
  let weather = await superagent.getWeather() //获取天气信息
  let today = await untils.formatDate(new Date())//获取今天的日期
  let memorialDay = untils.getDay(MEMORIAL_DAY)//获取纪念日天数
  let str = today + '<br>' + '第' + memorialDay + '天提醒你'
	  + '<br><br>今日天气早知道<br>' + weather.weatherTips +'<br>' +weather.todayWeather+ '<br>每日一句:<br>'+MSG===''?one:MSG+'<br><br>';
  try{
    logMsg = str
	await contact.say(str) // 发送消息
  }catch (e) {
	logMsg = e.message
  }
  console.log(logMsg)
}
//自动发消息
async function sayFn(){
	config.SAYLIST.forEach((item,index)=>{
		schedule.setSchedule(config.SAYLIST[index].SENDDATE,()=>{
			console.log(`你的贴心小助理对${config.SAYLIST[index].NICKNAME}开始工作啦！`)
				if(config.SAYLIST[index].ISGROUP===undefined||config.SAYLIST[index].ISGROUP===false){
					sayMain({
						NICKNAME:config.SAYLIST[index].NICKNAME,
						NAME:config.SAYLIST[index].NAME,
						MEMORIAL_DAY:config.SAYLIST[index].MEMORIAL_DAY,
						MSG:config.SAYLIST[index].MSG
					})
				}else{
					sayGroup()
				}
			})
	})
}
const bot = new Wechaty({name:'WechatEveryDay'})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)
bot.on('friendship', onFriendShip)

bot.start()
	.then(() => console.log('开始登陆微信'))
	.catch(e => console.error(e))
