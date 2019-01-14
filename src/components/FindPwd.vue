<template>
    <div class="FindPwd">
      <header class="header-bar">
        <p>找回密码</p>
        <a href="javascript:history.go(-1);"  class="icon-arrow-left" data-back="true"></a>
      </header>

      <form style="padding: 10px;">
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

        <input v-model="password" type="password" id="password" placeholder="设置密码（6位以上字母数字）" class="telnum" maxlength="20" name="password" />

        <input type="button" @click="findPaw()" class="btnlog" id="btn-sub" value="确认">

      </form>
    </div>
</template>

<script type="text/javascript">
  import Vue from 'vue'
  import $ from 'jquery';
  import slider from '@/assets/js/slider';
  var that = null;
  export default {
    name:"FindPwd",
    data () {
      return {
        phone: "",
        code: "",
        password: "",
      }
    },
    mounted:function () {
      that = this;
      slider.slider();
    },
    methods:{
      findPaw:function () {
        findPaw();
      },
      sendMsg:function () {
        checkTelNum();
      }
    }
  }

  //检查手机号
  function Check_Phone() {
    if (that.phone.length < 1) {
      that.$layer.msg("请输入你要找回密码的手机号码");
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

  //检查密码
  function Check_Pwd() {
    if (that.password.length < 1) {
      that.$layer.msg("请输入密码");
      return false;
    } else if (!(/^[0-9a-zA-Z]+$/).test(that.password)) {
      that.$layer.msg("密码只能为数字或字母");
      return false;
    } else if (that.password.length < 6) {
      that.$layer.msg("密码长度需大于6");
      return false;
    }
    else {
      return true;
    }
  }

  function Check_slider() {
    if ($('#dragText').html() == "验证通过") {
      return true;
    }
    else if ($('#dragText').html() == "拖动滑块验证") {
      that.$layer.msg("请拖动滑块完成验证!");
      return false;
    }
  }
  function Check_Code() {
    if (!(/\d{6}/).test(that.code)) {
      that.$layer.msg("请填写正确的六位手机验证码");
      return false;
    }
    else {
      return true;
    }
  }

  var interval = null
  var counter = 0;
  function checkTelNum() {
    if (!Check_Phone()) return;
    if (!Check_slider()) return;

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

  function findPaw() {
    if (!Check_Phone()) return;
    if (!Check_Code()) return;
    if (!Check_Pwd()) return;

    $.ajax({
      type: "post",
      url: "/FindPwd/Find",
      data: {
        txtPhone: that.phone,
        txtNewPassword: that.password,
        txtCode: that.code
      },
      success: function (data) {

        switch (data.Status) {
          case 7:
            that.$layer.msg("该手机号未注册！");
            break;
          case 12:
            that.$layer.msg("密码修改失败！");
            break;
          case 8:
            that.$layer.msg("手机号有误请重新输入！");
            break;
          case 9:
            that.$layer.msg("密码修改成功！");
            setTimeout(function () {
              window.location.href = "http://m.lwpoor.cn/loginNew";
            }, 1000);
            break;
          case 6:
            that.$layer.msg("请输入正确的验证码");
            break;
        }
      }
    });

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

  #CMenu p {
    color: #666;
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
