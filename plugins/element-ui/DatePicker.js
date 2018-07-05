/**
 * 是否有使用记录 1
 * 是否注册全局组件 0
 */
import DatePicker from 'element-ui/lib/date-picker'

DatePicker.props.editable = false
DatePicker.props.format = {
  type: String,
  default: 'yyyy-MM-dd'
}

DatePicker.mounted = DatePicker.updated = function () { // 对format ww 月周扩展
  let value = this.currentValue
  if (value && this.type === 'week' && this.format.indexOf('ww') > -1) {
    this.$nextTick(function () {
      var getMonthWeek = function (a, b, c) {
        var date = new Date(a, parseInt(b), c)
        var w = date.getDay()
        var d = date.getDate()
        return Math.ceil((d + 6 - w) / 7)
      }
      let currentValue = this.$el.querySelector('input').value
      this.$el.querySelector('input').value = currentValue.replace('ww', getMonthWeek(value.getFullYear(), value.getMonth(), value.getDate()))
    })
  }
}

export default DatePicker
