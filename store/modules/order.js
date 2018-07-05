// import orderApi from 'api/order'

// let state = {
//   order_addr: null,
//   order_info: null
// }

// const getters = {
//   order_addr: state => state.order_addr,
//   order_addr: state => state.order_addr
// }

// const actions = {
//   order_addr ({ commit, state }, params) {
//     orderApi.orderAddr(params)
//       .then((json) => {
//         // console.log('json', json)
//         commit('GOODS_DETAIL', {
//           params: params,
//           data: json.data
//         })
//       })
//       .catch((err) => {
//         console.log('err', err)
//       })
//   },
//   order_addr ({ commit, state }, params) {
//     orderApi.orderAddr(params)
//       .then((json) => {
//         // console.log('json', json)
//         commit('GOODS_DETAIL', {
//           params: params,
//           data: json.data
//         })
//       })
//       .catch((err) => {
//         console.log('err', err)
//       })
//   }
// }

// const mutations = {
//   ORDER_ADDR (state, { data }) {
//     // console.log('ORDER_ADDR', data)
//     state.order_addr = data.data ? data.data.list : null
//   }
// }

// export default {
//   state,
//   getters,
//   actions,
//   mutations
// }
