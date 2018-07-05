export default {
  beforeMount () { // 初始化注册表单submit事件
    this.bindEvent()
  },
  updated () {
    this.bindEvent()
  },
  methods: {
    bindEvent () {
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.$el.onsubmit = (e) => {
            e.preventDefault()
            this.handleSubmit && this.handleSubmit()
          }
          this.$refs.form.$el.onreset = (e) => {
            e.preventDefault()
            this.resetForm && this.resetForm()
          }
        }
      })
    },
    getFormProps (props) { // 获取el-form表单props
      return Object.assign({
        model: this.form,
        labelWidth: '142px',
        novalidate: 'novalidate'
      }, props)
    },
    validate (cb) { // 表单校验
      if (this.$refs.form && this.$refs.form.validate) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (cb) {
              cb()
            } else {
              this.submit && this.submit()
            }
          } else {
            this.validateFail()
            return false
          }
        })
      }
    },
    validateFail () { // 出现错误滚动到首个错误输入框并聚焦
      this.$nextTick(() => {
        let node = this.$el.querySelector('.is-error')
        if (node) {
          node.scrollIntoView && node.scrollIntoView(true)
          let inputs = node.querySelectorAll('input,textarea')
          inputs && inputs.length === 1 && inputs[0].focus()
        }
      })
    },
    submit () { // 提交数据
      console.log('form', this.form)
    },
    handleSubmit () { // 提交表单事件
      this.validate()
    },
    resetForm () { // 重置表单
      this.$refs.form && this.$refs.form.resetFields()
    }
  }
}
