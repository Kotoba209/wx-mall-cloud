> 前言： 关于云开发， 我只是花了一个上午的时间 简单的看了基础的数据库使用， 想要完全的去学一遍， 不花点时间是很难说可以掌握的。所以关于云开发，这里并不会讲太多， 想了解可以去啃文档 [微信云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

**本项目虽然大部分接口使用的是云开发这块的，  但仍然也有api工厂的使用， 所以是两者的结合。**

项目需要的数据接口并不是很多：
1、首页轮播图
2、商品分类列表
3、商品列表
4、商品详情、
5、地址列表
6、地址编辑
7、创建订单

本次项目更改主要是把1~4的数据放在了云开发的数据库中存取。 地址列表， 由于数据量的庞大， 所以就不考虑要导入到云开发的数据库了， 想要做这步的 这里有数据 [cityDataArr.json](https://6c65-leeson-a5fee7-1257914072.tcb.qcloud.la/666/cityDataArr.json?sign=30a3c877aeb945f6b6e0419237fb126b&t=1541577824)， 至于创建订单， 视频中的老师说的是个人开发者没法实现，  只能企业才可以， 具体的我也没去细看，  所以这一步也就先使用的api工厂的

 **1. 搭建项目框架**
 
 新建一个云开发项目框架， 并开通云开发模块， 新框架外层目录结构：
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328224350515.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0tvdG9iYTIwOV8=,size_16,color_FFFFFF,t_70)
把项目中我们用不到的文件都删了， （pages下面的文件基本都用不到， 所以可以都删了）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328233359905.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0tvdG9iYTIwOV8=,size_16,color_FFFFFF,t_70)
**相应的app.json 文件夹里也要删掉对应的页面路径**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200329000157104.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0tvdG9iYTIwOV8=,size_16,color_FFFFFF,t_70)
一些页面上的全局配置， 可以从原项目中拷贝过来使用

 接下来需要安装一些依赖
 - 安装node.js 

从官网上下载 [https://nodejs.org/en/](https://nodejs.org/en/)，安装之后，在cmd命令行中输入 node -v 出现版本号，说明安装成功
 - 初始化配置
  在miniprogram右键在终端中打开，在终端输入npm init -y 然后回车
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328224522407.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0tvdG9iYTIwOV8=,size_16,color_FFFFFF,t_70)
 初始化完成
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328225029420.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0tvdG9iYTIwOV8=,size_16,color_FFFFFF,t_70)
 可以在项目目录中看到package.json文件
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328225226519.png)
 
 - 安装 apifm-wxapi

 npm是安装node之后有的， 但是下载挺慢的， 不介意可以继续使用， 也可以换成淘宝镜像或者 yarn
 
 在刚才的终端继续输入 `npm install apifm-wxapi
`安装完成之后， package.json会多出来这个东西
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328230757100.png)
 具体使用就看代码里面的了。


**2.数据导入**

数据导入 首页轮播图、商品分类列表、商品列表都挺容易处理的， 打开你原先使用过的api工厂的接口地址， 比如我的轮播图[https://api.it120.cc/kotoba/banner/list](https://api.it120.cc/kotoba/banner/list)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328231142754.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0tvdG9iYTIwOV8=,size_16,color_FFFFFF,t_70)
**我这里显示成这样的结构， 是因为我在谷歌浏览器上装了插件， 没装插件可以使用火狐浏览器打开， 也会自动格式化成这种**

新建一个.json文件, 随便叫什么都可以， obj.json、arr.json...，然后把data一下的每个对象复制到刚才创建的.json文件中， 并去掉每个中括号之后的逗号，以vscode编辑器为例

选中 然后ctrl + f：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328231603470.png)
接着ctrl + d 选中当前页面的所有 '    },  '
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328231838675.png)
替换全部， **分类列表和商品列表同理**

替换前：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328232028289.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0tvdG9iYTIwOV8=,size_16,color_FFFFFF,t_70)
替换后：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328232054109.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0tvdG9iYTIwOV8=,size_16,color_FFFFFF,t_70)
然后到云开发数据库中建立相应的集合， 如轮播图就叫banners，然后在集合中点击导入，并选中你的json文件就可以了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328232232235.png)

**商品详情则处理如下**：

由于商品详情需要携带商品id来请求数据， 所以需要查看你自己的商品id，然后在浏览器url中输入 自己对应的商品详情接口 + 商品id， 格式如下：

[https://api.it120.cc/kotoba/shop/goods/detail?id=266976](https://api.it120.cc/kotoba/shop/goods/detail?id=266976)

这里存储到云开发数据库的时候， **建议把商品id放到最外层**， 这样比较容易处理，比如我的数据结构为：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328233011621.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0tvdG9iYTIwOV8=,size_16,color_FFFFFF,t_70)
商品数据只需要上面这些变量就够了， 其他的可以不需要添加。

我的数据库集合：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328234333709.png)
**3. 代码迁移**
把需要用到的页面、组件或者图片图标的都复制到当前目录下面，  注意路径要保持和之前的一样，  这样就可以不用再另外处理了， 需要迁移的文件：
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020032823410888.png)
这是迁移之后的项目结构， 具体可以在项目中查看

**4. 接口替换**

需要替换接口的页面有3个， 首页、分类页面、商品详情页面，以首页为例：首先先初始化并引入数据库

```javascript
//Page Object
const WXAPI = require('apifm-wxapi');
const app = getApp(); // 获取全局


// 初始化 cloud
wx.cloud.init();
//1、引用数据库
const db = wx.cloud.database({
  //这个是环境ID,不是环境名称
  env: 'serve-kto209'
})
```
然后把获取轮播图的方法修改为如下：

```javascript
getSwiperList() {
    var that = this;

    db.collection('banners').get({
      //如果查询成功的话
      success(res) {
        that.setData({
          swiperList: res.data,
        })
      },
    })
  }
```
其他的都类似，可以自行查看代码，就不多做赘述了。

**需要注意的点**

 1. 商品详情页里面， 根据id查询对应的商品信息语句， 由于我只在商品详情中添加了一条数据， 所以是写死的， 需要自行修改
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200328235600116.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0tvdG9iYTIwOV8=,size_16,color_FFFFFF,t_70)

 2. 在需要替换接口的地方， 会看到有这样的定义`const that = this;`
然后需要`that.setData({`， 这是因为， 在请求数据的过程中 `this`的指向发生了改变， 所以需要提前 用个变量来接收this。




> 2020.03.28更新。


# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
