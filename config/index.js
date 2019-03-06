// 配置文件
module.exports ={
  AUTOADDFRIEND:false,//自动加好友功能  默认关闭
  AUTOADDROOM:false,//自动拉群功能 默认关闭
  ONE:'http://wufazhuce.com/',////ONE的web版网站
  MOJI_HOST:'https://tianqi.moji.com/weather/china/', //中国墨迹天气url
  CITY:'chongqing',//收信者所在城市
  LOCATION:'chongqing',//收信者所在区 （可以访问墨迹天气网站后，查询区的英文拼写）
  SAYLIST:[
    {
      MEMORIAL_DAY:'2018/01/18', //你和收信者的纪念日
      NAME:'Joy(余真真)',//备注姓名
      NICKNAME:'JOY������', //昵称
      SENDDATE:'00 00 9 * * *',//定时发送时间 每天8点15分30秒发送，规则见 /schedule/index.js
      BIRTHDAY:"2019/03/19"
    },
    {
      MEMORIAL_DAY:'1995/10/07', //你和收信者的纪念日
      NAME:'妈妈',//备注姓名
      NICKNAME:'为了理想', //昵称
      SENDDATE:'00 30 8 * * *',//定时发送时间 每天8点15分30秒发送，规则见 /schedule/index.js,
      MSG:"今天要去锻炼(来自自动消息,请勿回复)"
    },
    {
      ROOMNAME:'/^谭氏大家族/i',//群名
      ISGROUP:true,
      SENDDATE:'00 15 8 * * *',//定时发送时间 每天8点15分30秒发送，规则见 /schedule/index.js
    },
    {
      ROOMNAME:'/^徐氏一家亲/i',//群名
      ISGROUP:true,
      SENDDATE:'00 15 8 * * *',//定时发送时间 每天8点15分30秒发送，规则见 /schedule/index.js
    }
  ],
  ROOMNAME:'/^你的群名/i', //群名(请只修改中文，不要删除符号，这是正则)
  ADDFRIENDWORD:'/你要触发的关键词/i',//自动加好友触发的关键词(请只修改中文，不要删除符号，这是正则)
  ADDROOMWORD:'/加群/',//自动发送群图片触发关键词(请只修改中文，不要删除符号，这是正则)
  ROOMCODEURL:'http://image.bloggeng.com/qun.png',//群二维码url链接(与本地群二维码路径选填一个)
  ROOMLOCALPATH:'./static/qun.png',//本地群二维码图片路径（与群url选填一个）
  BIRTHDAYPARH:"./static/birthDay.jpg"//生日
}
