# web-home-site-vue

> Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```
## 目录结构
```shell
├── api                        // 所有请求
├── assets                     // 主题 字体等静态资源
├── components                 // 全局公用组件
├── directive                  // 全局指令
├── filters                    // 全局filter
├── layouts                    // 布局框架页
├── middleware                 // 中间块
├── store                      // 全局store管理
├── styles                     // 全局样式
├── utils                      // 全局公用方法
├── pages                      // pages
│   │── modules                // 业务模块根目录
│   │	├── components         // 公共业务模块组件目录
│   │	├── module             // 具体模块目录
│   │	│   ├── components         // 公共业务模块组件目录
│   │	│   └── index.vue          // 页面组件
│   │	└── index.vue          // 页面组件modules                // 业务模块根目录
├── main.js                    // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── app.html                   // html模板
├── ecosystem.json             // eco配置 
├── nuxt.config.js             // nuxt配置
└── package.json               // package.json
```

## VUE组件编写规范

```bash
  <template>
    <div :class="classes"> 
      {{name}}: 
      <input
        type="text"
        :value="value"
        :disabled="disabled"
        @blur="handleBlur"
        />
    </div>
  </template>
  <script>
    import {}
    export default {
      components: {...}
      mixins: [...],
      props: {
        value: {
          type: String,
          default: 'value'
        },
        disabled: {
          type: Boolean,
          default: false
        }
      },
      computed: {
        classes () {
          let result = ['input-wrapper']
          this.disabled && result.push('disabled')
          return result
        }
      },
      mounted () {
        console.log('component has mounted')
      },
      data () {
        return {
          name: '名称'
        }
      },
      methods: {
        handleBlur (e) {
          let value = this.toUpperCase(e.target.value)
          this.$emit('change', value).$emit('input', value)
        },
        toUpperCase (value) {
          return value.toUpperCase()
        }
      }
    }
  </script>
  <style lang="scss">
    .input-wrapper{
      background:#fff;
      input {
        background:transparent;
      }
      &-border{
        border:1px solid #ddd
      }
      &:before{
        content:'';
      }
    }
  </style>
  1.组件文件名应该以大写开头，除index外
  2.组件的书写顺序:components > mixins > props > computed > [created | mounted | destroyed] > data > methods
  3.methods (事件处理函数要以handle+[业务名]+事件名取,如：handleBlur｜handleNameBlur)
  4. 当组件名与原生HTML标签语义同名时加X前缀,如XBody
  5.template模板内组件都要全小写，如果没有slot要以<component />形式去写
    bad:
        <x-input type="text"></x-input>
    good:
        <x-input type="text"/>
  6.当组件赋值的props和事件过多时应该要换行排版去写
    bad:
    <input type="text" :value="value" :disabled="disabled" @focus="handleFocus" @blur="handleBlur"
      />
    good:
    <input
      type="text"
      :value="value"
      :disabled="disabled"
      @focus="handleFocus"
      @blur="handleBlur"
      />
  7.sass编写应该按以下书写格式，写出更好的可读性和可维护性代码
    bad:
    .input-wrapper input{background:#fff}
    .input-wrapper:before{content:'';}
    .input-wrapper-border{border:1px solid #ddd}
    good:
    .input-wrapper{
      background:#fff;
      input {
        background:transparent;
      }
      &:before{
        content:'';
      }
      &-border{
        border:1px solid #ddd
      }
    }
  8.业务组件style标签要加scoped属性,除非这个组件公用性非常强，UI组件一般不建议使用scoped
    bad:
    <style lang="scss">
      .topic-list{
        background:red;
      }
    </style>
    good:
    <style lang="scss" scope>
      .topic-list{
         .el-input{
          background:red;
         }
       }
    </style>
  9.组件内style块不允许直接使用公共样式的选择器和ui组件库的相关选择器
    bad:
    <style lang="scss">
      .el-input{
        background:red;
      }
    </style>
    good:
    <style lang="scss">
      .my-input{
         .el-input{
          background:red;
         }
       }
    </style>
  10.要尽量减少触发渲染
    bad: 
    export default {
      data () {
        let list = [{name:'name1'},{name:'name1'},{name:'name1'}]
        return {
          length: 0,
          list
        }
      },
      methods: {
        handleChange () {
          this.length = this.list.length // 触发渲染
          this.list.forEach(item => {
            item.name = 'name' + Math.random() // 触发渲染
          })
        }
      }
    }
    good: 
    export default {
      data () {
        let list = [{name:'name1'},{name:'name1'},{name:'name1'}]
        return {
          length: 0,
          list
        }
      },
      methods: {
        handleChange () {
          let list = Object.assign([], this.list)
          list.forEach(item => {
            item.name = 'name' + Math.random()
          })
          // 触发渲染
          this.length = list.length 
          this.list = list
        }
      }
    }
  
  其他：想要了解项目现有的组件到项目根目录下的"组件文档.docx"打开，里面有组件的图文说明
```
For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
