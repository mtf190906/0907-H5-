//请求nodejs提供的path 模块
////path有一个方法：resolve(参数1,参数2)
///参数1：__dirname表示当前目录的路径
///参数2：需要追加的目录名,不需要写/，resolve方法会帮我们自动追加
var path = require ('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
//接口字符串
var str = new Buffer('aHR0cDovL3Rlc3QuaGFwcHltbWFsbC5jb20v','base64');

var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
var path = require('path');

var getHtmlConfig = function(name,title) {
	return {
			//对哪个html文件进行打包
			template: './src/view/'+ name +'.html',
			//打包后的路径
			filename: 'view/'+ name +'.html',
			title:title,
			//自动注入 保证路径正确
			inject: true,
			hash: true,
			chunks:['common',name]
		}
}

var config = {
	entry :{
	'common' : ['./src/page/common/index.js'],
	'index' : './src/page/index/index.js',
	'list' : './src/page/list/index.js',
	'user-login' : './src/page/user-login/index.js',
	'user-result' : './src/page/user-result/index.js',
	'user-center' : './src/page/user-center/index.js',
	'user-center-update' : './src/page/user-center-update/index.js',
	'user-pass-update' : './src/page/user-pass-update/index.js',
	'user-register' : './src/page/user-register/index.js',
	'user-pass-reset' : './src/page/user-pass-reset/index.js'
	},
	output :{
		path: path.resolve(__dirname,'dist'),
		publicPath: '/dist',
		filename:  'js/[name].js'
	},
	externals:{
		'jquery' : 'window.JQuery'
	},
	// optimization:{
	// 	//抽取公共模块的对象
	// 	splitChunks:{
	// 		//缓存组
	// 		cacheGroups:{
	// 			//commons表示公共的模块
	// 			commons:{
	// 				name:'base',
	// 				chunks:'initial',
	// 				minChunks:2,
	// 				minSize:0
	// 			}
	// 		}
			
	// 	}

	// },
	module:{
		rules:[
				{
					test:/\.css$/,
				//	loader:"style-loader!css-loader"
					loader: ExtractTextPlugin.extract({
      						fallback: "style-loader",
      						use: "css-loader"
    					})
				},
				{
					test:/\.(gif|png|jpg|woff|svg|eot|ttf).??.*$/,
					loader: 'url-loader?limit=100&name=resource/[name].[ext]'
				},
				{
					test:/\.string$/,
					loader:'html-loader'
				}
		]
	},
	plugins:[
		new ExtractTextPlugin("css/[name].css"),
		new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
		new HtmlWebpackPlugin(getHtmlConfig('list','商品列表')),
		new HtmlWebpackPlugin(getHtmlConfig('user-login','用户登录')),
		new HtmlWebpackPlugin(getHtmlConfig('user-result','操作结果')),
		new HtmlWebpackPlugin(getHtmlConfig('user-register','用户注册')),
		new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset','找回密码')),
		new HtmlWebpackPlugin(getHtmlConfig('user-center','个人中心')),
		new HtmlWebpackPlugin(getHtmlConfig('user-pass-update','重置密码')),
		new HtmlWebpackPlugin(getHtmlConfig('user-center-update','修改个人信息'))
	],
	resolve:{
		alias:{
			node_modules: path.resolve(__dirname,'node_modules'),
			service: path.resolve(__dirname,'src/service'),
			util: path.resolve(__dirname,'src/util'),
			"@": path.resolve(__dirname,'src/page'),
			image: path.resolve(__dirname,'image')	
		}
	},
	devServer:{
		port:8088,
		inline:true,
		//配置代理实现跨域
		//当访问localhost：8088/**//.do的时候就跳转到网络接口
		proxy:{
			"**/*.do":{
				target: str.toString(),
				changeOrigin: true
			}
		}
	}
}

//如果是开发环境 那么添加一个数组元素
if ('dev'=== WEBPACK_ENV) {
	config.entry.common.push('webpack-dev-server/client?http://localhost:8088')
}
module.exports = config;      