import Dialog from 'element-ui/lib/dialog'
import Dropdown from 'element-ui/lib/dropdown'
import DropdownMenu from 'element-ui/lib/dropdown-menu'
import DropdownItem from 'element-ui/lib/dropdown-item'
import Menu from 'element-ui/lib/menu'
import Submenu from 'element-ui/lib/submenu'
import MenuItem from 'element-ui/lib/menu-item'
import MenuItemGroup from 'element-ui/lib/menu-item-group'
import Input from 'element-ui/lib/input'
import InputNumber from 'element-ui/lib/input-number'
import Radio from 'element-ui/lib/radio'
import RadioGroup from 'element-ui/lib/radio-group'
import RadioButton from 'element-ui/lib/radio-button'
import Checkbox from 'element-ui/lib/checkbox'
import CheckboxButton from 'element-ui/lib/checkbox-button'
import CheckboxGroup from 'element-ui/lib/checkbox-group'
import Switch from 'element-ui/lib/switch'
import Select from 'element-ui/lib/select'
import Option from 'element-ui/lib/option'
import OptionGroup from 'element-ui/lib/option-group'
import Button from 'element-ui/lib/button'
import ButtonGroup from 'element-ui/lib/button-group'
// import Popover from 'element-ui/lib/popover'
import Tooltip from 'element-ui/lib/tooltip'
import MessageBox from 'element-ui/lib/message-box'
import Breadcrumb from 'element-ui/lib/breadcrumb'
import BreadcrumbItem from 'element-ui/lib/breadcrumb-item'
import Form from 'element-ui/lib/form'
import FormItem from 'element-ui/lib/form-item'
import Tabs from 'element-ui/lib/tabs'
import TabPane from 'element-ui/lib/tab-pane'
import Alert from 'element-ui/lib/alert'
// import Notification from 'element-ui/lib/notification'
import Loading from 'element-ui/lib/loading'
import Icon from 'element-ui/lib/icon'
import Row from 'element-ui/lib/row'
import Col from 'element-ui/lib/col'
import Spinner from 'element-ui/lib/spinner'
import Message from 'element-ui/lib/message'
import Badge from 'element-ui/lib/badge'
import Scrollbar from 'element-ui/lib/scrollbar'
import Collapse from 'element-ui/lib/collapse'
import CollapseItem from 'element-ui/lib/collapse-item'
// import Cascader from 'element-ui/lib/cascader'
import Carousel from 'element-ui/lib/carousel'
import CarouselItem from 'element-ui/lib/carousel-item'
import locale from 'element-ui/lib/locale'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import Progress from 'element-ui/lib/progress'
import Upload from 'element-ui/lib/upload'

Breadcrumb.props.separator.default = '>'
MessageBox._confirm = MessageBox.confirm
MessageBox.confirm = (content, title, props) => {
  props = Object.assign({
    customClass: 'dialog'
  }, props)
  return MessageBox._confirm(content, title, props)
}
Carousel.beforeMount = function () { // 修正轮播图片在表单BUTTON提交的行为
  this.$nextTick(function () {
    Array.prototype.slice.call(this.$el.querySelectorAll('button')).forEach(function (item) {
      item.type = 'button'
    })
  })
}

/*
*扩展Col组件百分比布局
*/
Col.props.spanPercent = {
  type: Number
}
if (!Col.updated && !Col.mounted) {
  Col.updated = Col.mounted = function () {
    if (this.spanPercent) {
      let width = `${this.spanPercent}%`
      if (this.$el.style.width !== width) {
        this.$el.style.width = width
      }
    }
  }
}

/*
*重写InputNumber默认行为
*/
InputNumber.props.validateEvent = true
InputNumber.props.controls = false // 默认不是控制按钮
InputNumber.props.debounce.default = 380
InputNumber.props.max.default = 100000
InputNumber.props.bit = {type: Number}
InputNumber.created = () => {}
InputNumber.beforeMount = function () {
  this.$nextTick(() => {
    var self = this
    this.$el.addEventListener('keydown', function (e) {
      e.keyCode === 13 && self.handleBlur(e)
    }, false)
    this.$el.addEventListener('focusin', function (e) {
      e.target.select() // 得到焦点选中值
    }, false)
    this.$refs.input.setCurrentValue = function (value) { // 重写 setCurrentValue控制validateEvent
      if (value === this.currentValue) return
      this.$nextTick(function () {
        this.resizeTextarea()
      })
      this.currentValue = value
      if (self.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [value])
      }
    }
  })
}
InputNumber.methods.debounceHandleInput = function () {}
InputNumber.methods.handleBlur = function (e) {
  var value = Number(e.target.value)
  if (!isNaN(value)) {
    let bValue = this.bit || 1
    let newValue = Math.round(1 / bValue * value) / (1 / bValue)
    this.setCurrentValue(newValue)
  } else {
    this.$refs.input.setCurrentValue(this.currentValue)
  }
}

/*
* Input组件含输入文字数扩展
*/
Input.props.numberWord = {
  type: Boolean,
  default: false
}
if (!Input.updated && !Input.beforeMount) {
  Input.beforeMount = function () {
    if (this.numberWord) {
      this.$nextTick(function () {
        if (this.maxlength) {
          let node = document.createElement('div')
          node.className = 'el-input-word-counter'
          node.innerHTML = this.value.length + '/' + this.maxlength
          this.$el.appendChild(node)
          if (this.$el.classList) {
            this.$el.classList.add('el-input__number-word')
          } else if (this.$el.className.indexOf('el-input__number-word') === -1) {
            this.$el.className += ' el-input__number-word'
          }
        }
      })
    }
  }
  Input.updated = function () {
    if (this.numberWord) {
      let node = this.$el.querySelector('.el-input-word-counter')
      if (node) {
        node.innerHTML = this.value.length + '/' + this.maxlength
      }
    }
  }
}

let components = [
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  // DatePicker,
  // TimeSelect,
  // TimePicker,
  // Popover,
  Tooltip,
  MessageBox,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Alert,
  // Notification,
  Loading,
  Icon,
  Row,
  Col,
  Spinner,
  Message,
  Badge,
  Scrollbar,
  Collapse,
  CollapseItem,
  // Cascader,
  Carousel,
  CarouselItem,
  CollapseTransition,
  Progress
]

const install = function (Vue, opts = {}) {
  locale.use(opts.locale)
  locale.i18n(opts.i18n)
  components.map(component => {
    component.name && Vue.component(component.name, component)
  })
  Vue.use(Loading.directive)
  Vue.prototype.$loading = Loading.service
  Vue.prototype.$msgbox = MessageBox
  Vue.prototype.$alert = MessageBox.alert
  Vue.prototype.$confirm = MessageBox.confirm
  Vue.prototype.$prompt = MessageBox.prompt
  // Vue.prototype.$notify = Notification
  Vue.prototype.$message = Message
}

export {
  install,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  // MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  // DatePicker,
  // TimeSelect,
  // TimePicker,
  // Popover,
  Tooltip,
  MessageBox,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Alert,
  // Notification,
  Loading,
  Icon,
  Row,
  Col,
  Spinner,
  Message,
  Badge,
  Scrollbar,
  Collapse,
  CollapseItem,
  // Cascader,
  Carousel,
  CarouselItem,
  CollapseTransition,
  Progress,
  Upload
}
