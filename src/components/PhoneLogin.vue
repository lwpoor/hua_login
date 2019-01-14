<template>
    <div class="PhoneLogin">
      <header class="header-bar">
        <p>登录</p>
        <a href="javascript:history.go(-1);" class="icon-arrow-left" data-back="true"></a>
      </header>

      <div class="content" style="padding: 10px;">
        <div style="overflow:hidden;">
          <router-link :to="{ name:'LoginIndex'}">
            <a href="/login" class="tab">会员账号登录</a>
          </router-link>
        </div>
        <form>
          <input type="hidden" value="/userindex" name="returnUrl" />

          <input v-model="phone" type="tel" id="phone" class="telnum" name="phone" placeholder="请输入手机号码" value="" >

          <div id="dragContainer" style="width: 99%;height:40px;margin: 10px 0 5px 0;">
            <div id="dragBg" style="width: 0px;"></div>
            <div id="dragText" style="line-height:40px;">拖动滑块验证</div>
            <div id="dragHandler" class="dragHandlerBg" style="left: 0px;"></div>
          </div>

          <input v-model="code" type="tel" class="phonecode" id="txt-code" name="code" maxlength="6" placeholder="输入短信验证码">
          <a href="javascript:;" class="btnSend" id="btn-get" @click="sendMsg()">
            <span class="btntxt" id="getcode">获取验证码</span>
            <span style="display:none;" id="prompt_info"><span id="regetcode"></span>秒后重新发送</span>
          </a>

          <input type="button" @click="Login()" class="btnlog" id="btn-sub" value="登录">

        </form>

        <div class="login_an">
          <router-link :to="{ name:'Register'}">
            <a class="kszc">快速注册</a>
          </router-link>
        </div>
      </div>

    </div>
</template>

<script type="text/javascript">
  import Vue from 'vue'
  import layer from 'vue-layer'
  Vue.prototype.$layer = layer(Vue);

  var that = null;
  export default {
    name:'PhoneLogin',
    data () {
      return {
        phone: "",
        code: ""
      }
    },
    methods:{
      Login:function () {
        LoginIn();
      },
      sendMsg:function () {
        checkTelNum();
      }
    },
    beforeMount() {
      console.group('beforeMount 挂载前状态===============》');
      that = this;
    },mounted: function () {
      console.group('mounted 挂载结束状态===============》');
      this.$slider.slider();
    }
  }

  import $ from 'jquery';
  import slider from '@/assets/js/slider';
  Vue.prototype.$slider = slider;
  $(function () {
    setTimeout(function () {

    },1000)
  });

  //检查手机号
  function Check_Phone() {
    if (that.phone.length < 1) {
      that.$layer.msg("请输入你要注册的手机号码");
      return false;
    } else if (!isPhone(that.phone)) {
      that.$layer.msg("请输入有效的手机号码");
      return false;
    }
    else {
      return true;
    }
  }
  //手机号码验证
  function isPhone(value) {
    value = value.replace(/(^\s*)|(\s*$)/g, "");
    if (/^13\d{9}$/g.test(value) || (/^15[0-9]\d{8}$/g.test(value)) || (/^17[0-9]\d{8}$/g.test(value)) || (/^18[0-9]\d{8}$/g.test(value)) || (/^147\d{8}$/g.test(value)) || (/^145\d{8}$/g.test(value)))
    { return true; }
    else
    { return false; }
  }

  function LoginIn() {
    if (!Check_Phone()) return;
    if (!checkCode()) return;
    $.ajax({
      url: '/login/LoginByPhone',
      type: 'post',
      data: {
        mobilePhone: that.phone,
        activeCode: that.code,
      },
      datatype: 'json',
      async: false,//使用同步的方式,true为非同步方式
      success: function (data) {
        //var state = data.Status;
        if (data == "1") {
          that.$layer.msg("登录成功");
          location.href = "http://m.lwpoor.cn/UserIndex";
          return false;
        }
      },
      fail: function () {
        that.$layer.msg("系统异常");
      }
    });
  }

  function Check_Code() {
    if ($('#dragText').html() == "验证通过") {
        return true;
    }
    else if ($('#dragText').html() == "拖动滑块验证") {
      that.$layer.msg("请拖动滑块完成验证!");
      return false;
    }
  }

  var interval = null
  var counter = 0;
  function checkTelNum() {
    if (!Check_Code()) return;

    var regMobile = /(13|14|15|17|18)[0-9]{9}/;
    if (that.phone == "") {
      that.$layer.msg("请输入手机号码");
      return false;
    }
    if (!regMobile.test(that.phone)) {
      that.$layer.msg('请输入有效的手机号码');
      return false;
    }
    var data = { mobilephone: that.phone };
    $.ajax({
      type: "Post",
      url: "/SendMSM/getRandCode",
      data: data,
      dataType: "text",
      success: function (res) {
        var data = res;
        if (data == 'Y') {
          that.$layer.msg("验证码已发送,请查收");
          counter = 0;
          $("#getcode").hide();
          $("#btn-get").addClass("graybg");
          $("#prompt_info").show();
          $("#regetcode").html("90");
          interval = window.setInterval(intervalFunc, 1000);

        } else if (data == 'M') {
          if (data.Code == -100) {
            $("#smsCntDiv").css("display", "block");
          }
          that.$layer.msg("获取过于频繁，请稍后获取");
          return false;
        }
        else {
          if (data.Code == -100) {
            $("#smsCntDiv").css("display", "block");
          }
          that.$layer.msg("获取验证码失败");
          return false;
        }
      },
      error: function (e) {
        if (data.Code == -100) {
          $("#smsCntDiv").css("display", "block");
        }
        that.$layer.msg("获取验证码失败");
        return false;
      }
    });

  };

  function checkCode() {
    if (that.code == "") {
      that.$layer.msg("短信验证码不能为空");
      return false;
    }
    return true;
  }

  function intervalFunc() {
    if (counter > 90) {
      counter = 0;
      $("#getcode").show();
      $("#btn-get").removeClass("graybg");
      $("#prompt_info").hide();
      window.clearInterval(interval);
    } else {
      $("#regetcode").html((90 - counter).toString());
    }
    counter = counter + 1;
  }
</script>

<style>

  @import url("../assets/css/slider.css");
  @import url("../assets/css/MCommon.css");

  body {
    background: #fff !important;
  }

  a, input {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  .login_an {
    padding: 20px 0px;
    margin-bottom: 0px !important;
  }

  .clearfix:before, .clearfix:after {
    content: " ";
    display: table;
  }

  .clearfix:after {
    clear: both;
  }

  .clearfix {
    *zoom: 1;
  }

  #CMenu p {
    color: #666;
  }

  .content {
    padding: 0 8px;
    border-bottom: none !important;
  }

  .tab {
    display: block;
    float: right;
    line-height: 38px;
    color: #f60;
  }

  .telnum, .phonecode {
    width: 100%;
    border: 1px solid #e2e2e2;
    font-size: 14px;
    background-color: #F9F9F9;
    height: 40px;
    line-height: 40px;
    text-indent: 8px;
    -webkit-appearance: none;
    outline: none;
    margin: 10px 0 5px 0;
  }

  .telTip, .codesTip {
    color: #f60;
  }

  .phonecode {
    width: 40%;
  }

  .btnSend {
    height: 40px;
    background: #FFAD0D;
    line-height: 40px;
    display: inline-block;
    width: 58%;
    text-align: center;
    float: right;
    border-radius: 3px;
    color: #fff;
    margin-top: 10px;
  }

  .btnlog {
    display: block;
    background: -webkit-gradient(linear,left top,left bottom,from(#F60),to(#F60));
    background: -moz-linear-gradient(top,#F60,#F60);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#F60',endColorstr='#F60');
    background-color: #F60;
    border: none;
    width: 100%;
    margin: 10px auto 0;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    text-align: center;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
  }

  .mfzc {
    float: right;
    margin: 20px 0;
    position: relative;
  }

  .mfzc:after {
    display: inline-block;
    width: 15px;
    height: 15px;
    content: '';
    position: absolute;
    top: 2px;
    left: -18px;
    background: url('//img.lwpoor.cn/hua/icon/login_zc.png') no-repeat;
    background-size: 14px 16px;
  }

  .otherlog p {
    line-height: 35px;
  }

  .otherlog a {
    width: 33%;
    display: inline-block;
  }

  .else_icon a {
    position: relative;
    width: 44px;
    margin-right: 60px;
    float: left;
  }

  .else_icon a {
    position: absolute;
    top: -17px;
    left: -40px;
    font-size: 10px;
    white-space: nowrap;
    z-index: 1000;
    border: 1px solid #f60;
    border-radius: 3px;
    background: #fff;
    padding: 1px;
    color: #f60;
  }

  .else_icon a {
    left: -25px;
  }

  .else_icon a {
    position: relative;
  }

  .else_icon a:last-child {
    margin-right: 0px;
  }

</style>
