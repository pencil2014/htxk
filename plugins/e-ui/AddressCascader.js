/**
 * 是否有使用记录 1
 * 是否注册全局组件 0
 * 是否已改为E-UI组件引用 1
 */
import AddressCascader from 'e-ui/lib/AddressCascader'
import Cascader from '@element-ui/Cascader'

AddressCascader.components['Cascader'] = Cascader
// AddressCascader.props = Object.assign(AddressCascader.props, Cascader.props)

export default AddressCascader
