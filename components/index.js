import XHeader from './XHeader'
import XBody from './XBody'
import XFooter from './XFooter'
import XNav from './XNav'
import Ssr from './Ssr'

const components = {
  XHeader,
  XBody,
  XFooter,
  XNav,
  Ssr
}

const install = function (Vue, opts = {}) {
  for (let name in components) {
    Vue.component(name, components[name])
  }
}

export {
  install,
  XHeader,
  XBody,
  XFooter,
  XNav,
  Ssr
}
