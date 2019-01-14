<template>
    <div class="loginIndex">
      <header class="header-bar">
        <p>登录</p>
        <a href="javascript:history.go(-1);"  class="icon-arrow-left" data-back="true"></a>
      </header>

      <div class="content">
        <form>
          <div class="login-mc" style="margin-top:0;">
            <div class="clearfix" style="margin: -6px 0 5px;">
              <router-link :to="{ name:'PhoneLogin'}">
                <a href="" style="display: block;float: right;line-height: 38px;color: #f60;cursor: pointer;">使用手机验证登录</a>
              </router-link>

            </div>
            <div id="loginContainer">
              <div>
                <div class="email_autocomplete">
                  <input v-model="username" type="text" class="common-input-user" value="" name="UserName" id="txtUserNameLogin" placeholder="请输入用户名/手机号码" autocomplete="off" nodetype="email" config="{width:245,height:35}" />
                </div>
              </div>
              <div>
                <input v-model="password" type="password" placeholder="请输入登录密码" id="PassWord" name="Password" onchange="Check_Password()" nodetype="next" class="common-input-user" />
              </div>
              <br />

            </div>
            <div style="clear:both"></div>
            <input type="hidden" name="openid" value="" />
            <input type="button" name="Submit" value="登录" class="sub_btn" tabindex="5" @click="Check_User_Login()"/>

            <div class="login_an">
              <router-link :to="{ name:'FindPwd'}">
                <a><span class="zhmm">找回密码</span></a>
              </router-link>

              <router-link :to="{ name:'Register'}">
                <a class="kszc">快速注册</a>
              </router-link>

            </div>
            <div class="else_box" style="display:none;">
              <p class="row_line"></p>
              <p class="else_way">其他方式登录</p>
              <div class="else_icon">

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
</template>

<script>
  import Vue from 'vue'
  import layer from 'vue-layer'
  Vue.prototype.$layer = layer(Vue);

  var that = null;
  export default {
    name:'loginIndex',
    data () {
      return {
        username: "",
        password: ""
      }
    },
    methods:{
      Check_User_Login:function () {
        that = this;
        Login();
      }
    }
  }

  import $ from 'jquery';

  function Check_UserName() {
    if (that.username.length < 1) {
      that.$layer.msg('请输入手机号码！');
      return false;
    }
    var value = that.username.replace(/(^\s*)|(\s*$)/g, "");
    if (/^13\d{9}$/g.test(value) || (/^15[0-9]\d{8}$/g.test(value)) || (/^17[0-9]\d{8}$/g.test(value)) || (/^18[0-9]\d{8}$/g.test(value)) || (/^147\d{8}$/g.test(value)) || (/^145\d{8}$/g.test(value))) {
      return true;
    }
    else {
      that.$layer.msg('请输入正确的手机号码！');
      return false;
    }
  }

  function Check_Password() {
    if (that.password.length < 6) {
      that.$layer.msg('密码为必填项，密码不能小于6位！');
      document.getElementById("PassWord").focus();
      return false;
    }
    return true;
  }

  //提交再次验证
  function Login() {
    if (!Check_UserName()) return;
    if (!Check_Password()) return;

    $.ajax({
      type: "post",
      url: "http://m.lwpoor.cn/Login/LoginByUsual",
      data: {
        loginName: that.username.trim(),
        passWord: that.password
      },
      success: function (data) {
        switch (data.Status) {
          case 0:
            that.$layer.msg("登录成功");
            var refurl = getUrlKey("#hdnRefurl");
            if (refurl == null || refurl.replace(/(^\s*)|(\s*$)/g, "") == "") {
              window.location.href = "http://m.lwpoor.cn/UserIndex";
            }
            else {
              window.location.href = refurl;
            }
            break;
          case 1:
            that.$layer.msg("账号或密码错误");
            break;
          case 2:
            that.$layer.msg("账号或密码错误");
            break;
          case 3:
            that.$layer.msg("当前用户登陆异常请联系客服！");
            break;
        }
      },
      error: function () { that.$layer.msg('系统异常'); }
    });
  }

  function getUrlKey(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
  }

</script>

<style>
  @import url("../assets/css/common1107.css");
  @import url("../assets/css/wap1107.css");
  @import url("../assets/css/MCommon.css");
  @import url("../assets/css/Login.css");

  .content {
    overflow: visible;
  }
  body {
    background: #fff !important;
  }

  .content {
    border-bottom: none !important;
  }

  .common-input-user {
    font-size: 14px;
    height: 42px;
    line-height: 42px;
  }

  .login_an {
    padding: 20px 0px;
    margin-bottom: 0px !important;
  }

  .else_way {
    color: #333;
    font-size: 15px;
    line-height: 34px;
    text-align: center;
    background: #fff;
    width: 115px;
    margin: 0 auto;
    position: relative;
    z-index: 999;
    margin-bottom: 10px;
  }

  .row_line {
    position: absolute;
    top: 20px;
    height: 1px;
    width: 80%;
    margin-left: 10%;
    background-color: #ddd;
    z-index: 0;
  }

  .else_box {
    margin: 30px auto;
    padding: 0 0 15px;
    position: relative;
  }

  .else_icon {
    margin: 5px auto;
    width: 150px;
    overflow: visible;
  }

  .else_icon a {
    position: relative;
    width: 44px;
    margin-right: 60px;
    float: left;
  }

  .else_icon a .login_tip {
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

  .else_icon a  {
    left: -25px;
  }

  .else_icon a   {
    position: relative;
  }


  .else_icon a:last-child {
    margin-right: 0px;
  }

  .else_icon .text {
    display: inline-block;
    text-align: center;
    padding: 0px;
    width: 100%;
  }

  .zhmm {
    float: right;
    position: relative;
    display: block;
    height: 20px;
    line-height: 20px;
  }

  .zhmm:after {
    display: inline-block;
    width: 14px;
    height: 14px;
    content: '';
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: -18px;
    background: url('//m.hua.com/images/login_mm.png') no-repeat;
    background-size: 14px 14px;
  }

  .kszc {
    float: left;
    position: relative;
    left: 16px;
    display: block;
    height: 20px;
    line-height: 20px;
  }

  .kszc:after {
    display: inline-block;
    width: 15px;
    height: 15px;
    content: '';
    position: absolute;
    top: 2px;
    bottom: 3px;
    bottom: 3px;
    left: -18px;
    background: url('//m.hua.com/images/login_zc.png') no-repeat;
    background-size: 14px 16px;
  }
</style>
