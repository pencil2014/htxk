const pattern = {
  email: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
  phone: /^1[3|4|5|7|8][0-9]{9}$/,
  mobile: /^1[3|4|5|7|8][0-9]{9}$/,
  // password: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,20}$/,
  password: /^(?!.*[\u4E00-\u9FA5\s])(?![A-Z]+$)(?![a-z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{6,20}$/,
  nickname: /^[A-Za-z0-9_、.\u4e00-\u9fa5]{4,20}$/,
  intadd: /^\+?(0|[1-9][0-9]*)$/,
  ip: /^[A-Za-z0-9]+$/,
  username: /^[\u4E00-\u9FA5A-Za-z]+$/,
  idNo: /^[A-Za-z0-9]+$/,
  // 身份证如下
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  creditCard: /^[0-9]{12,19}$/,
  priceNum: /^\d+(?=\.{0,1}\d+$|$)/
}

export default {
  pattern,
  rule: {
    email: {
      pattern: pattern.email,
      message: '邮箱格式不正确'
    },
    phone: {
      pattern: pattern.phone,
      message: '电话号码格式不正确'
    },
    mobile: {
      pattern: pattern.mobile,
      message: '手机号码格式不正确'
    },
    password: {
      pattern: pattern.password,
      message: '密码格式不正确'
    },
    nickname: {
      pattern: pattern.nickname,
      message: '昵称格式不正确'
    },
    ip: {
      pattern: pattern.ip,
      message: '输入的证件号不合法'
    },
    idCard: {
      pattern: pattern.idCard,
      message: '请输入正确的证件号码'
    },
    creditCard: {
      pattern: pattern.creditCard,
      message: '请输入12-19位数字'
    },
    priceNum: {
      pattern: pattern.priceNum,
      message: '请输入正确的数字'
    },
    username: {
      pattern: pattern.username,
      message: '姓名格式不正确'
    },
    isPhone: {
      validator (rule, value, callback) {
        if (value) {
          if (pattern.phone.test(value)) {
            callback()
          }
          callback(new Error('请输入正确的手机号!'))
        }
      }
    },
    isEmail: {
      validator (rule, value, callback) {
        if (value) {
          if (pattern.email.test(value)) {
            callback()
          }
          callback(new Error('请输入正确的邮箱!'))
        }
      }
    },
    isPassword: {
      validator (rule, value, callback) {
        if (value) {
          if (pattern.password.test(value)) {
            callback()
          }
          callback(new Error('请输入格式正确的密码!'))
        }
      }
    },
    isIp: {
      validator (rule, value, callback) {
        if (this.form.idType) {
          if (value) {
            if (pattern.ip.test(value)) {
              if (value.length < 30) {
                callback()
              }
            }
            callback(new Error('请输入真实的证件号'))
          }
        } else {
          callback(new Error('请输入真实的证件号'))
        }
      }
    },
    addressLength: {
      validator (rule, value, callback) {
        if (value) {
          if (value.length > 10 && value.length < 150) {
            callback()
          }
          callback(new Error('请输入您的详细地址'))
        } else {
          callback()
        }
      }
    },
    account: { // phoneAndEmail
      validator (rule, value, callback) {
        if (value) {
          if (pattern.email.test(value) || pattern.phone.test(value)) {
            callback()
          }
          callback(new Error(this.message))
        }
      },
      message: '请输入正确的邮箱或者手机号!'
    },
    nickName: {
      validator (rule, value, callback) {
        if (value) {
          if (pattern.nickname.test(value)) {
            callback()
          } else {
            callback(new Error('请输入符合规范的昵称!'))
          }
        }
      }
    },
    userName: {
      validator (rule, value, callback) {
        if (value) {
          if (pattern.username.test(value)) {
            callback()
          }
          callback(new Error('该姓名含非法字符，请使用中英文!'))
        } else {
          callback()
        }
      }
    },
    isIntadd: {
      validator (rule, value, callback) {
        if (value) {
          if (pattern.intadd.test(value)) {
            callback()
          }
          callback(new Error('请输入正整数!'))
        }
      }
    },
    emptyArray: { // 数组索引全为空校验
      validator (rule, value, callback) {
        if (value && value instanceof Array && value.some(item => { return !!item })) {
          callback()
        }
        callback(new Error(this.message))
      },
      message: '不能为空'
    },
    NumberArray: {
      validator (rule, value, callback) {
        // console.log(value)
        if (value && value instanceof Array && value.every(item => {
          return item.channelsGroup.some(channel => {
            return channel.lotteryNumbers > 0 && pattern.intadd.test(channel.lotteryNumbers)
          })
        })) {
          callback()
        }
        callback(new Error(this.message))
      },
      message: '不能为空'
    },
    saleArray: {
      validator (rule, value, callback) {
        // 改为只要有数量满足要求即可
        if (value && value instanceof Array && value.some(item => {
          return item.num > 0 && pattern.intadd.test(item.num)
        })) {
          callback()
        }
        callback(new Error(this.message))
      },
      message: '请输入数量,数量为正整数'
    },
    channelArray: {
      validator (rule, channelList = [], callback) {
        // console.log(channelList, 'channelArrayName')
        let numFlag = channelList.every(item => {
          return item.channelsGroup.some(channel => {
            return channel.lotteryNumbers > 0 && pattern.intadd.test(channel.lotteryNumbers)
          })
        })
        let channelNameList = channelList.map(k => k.channelName)
        let channelFlag = channelNameList.find((cItem, cIndex) => {
          let temArr = channelNameList.slice(cIndex + 1, channelNameList.length)
          return temArr.includes(cItem)
        }) ? !1 : !0
        if (numFlag && channelFlag) {
          callback()
        } else if (!numFlag) {
          callback(new Error(this.messageNum))
        } else if (!channelFlag) {
          callback(new Error(this.messageChannel))
        }
      },
      messageNum: '请输入渠道名额,名额为正整数',
      messageChannel: '渠道名不能相同'
    },
    ticketTime: {
      validator (rule, value = {}, callback) {
        setTimeout(() => {
          if (value.startBuyTime && value.endBuyTime) {
            let startBuyTime = value.startBuyTime
            let endBuyTime = value.endBuyTime
            let showTime = Date.parse(value.name) // 场次时间
            let curTime = Date.parse(new Date()) // 当前时间
            // 购买结束时间 要小于场次时间
            if (endBuyTime > showTime) {
              callback(new Error('购买时间需要早于对应场次时间'))
            }
            if (startBuyTime < curTime) {
              callback(new Error('购买时间不能早于当前时间'))
            }
            callback()
          }
          callback(new Error('请选择购买起止时间'))
        }, 400)
      }
    },
    notNullArray: {
      validator (rule, value, callback) {
        if (value && value instanceof Array && value.every(item => { return !!item })) {
          callback()
        }
        callback(new Error(this.message))
      },
      message: '不能为空'
    },
    orgArray: {
      validator (rule, value, callback) {
        if (value && value instanceof Array && value.some(item => {
          return item.length >= 2 && item.length <= 30
        })) {
          callback()
        }
        callback(new Error(this.message))
      },
      message: '不能为空'
    },
    coOrgArray: {
      validator (rule, value, callback) {
        if (value && value instanceof Array && value.some(item => {
          return item.length === 0 || (item.length >= 2 && item.length <= 30)
        })) {
          callback()
        }
        callback(new Error(this.message))
      },
      message: '不能为空'
    },
    checkTrim: {
      validator (rule, value, callback) {
        if (value) {
          if (value.trim().length >= 8) {
            callback()
          }
          callback(new Error(this.message))
        }
      },
      message: '不能为空'
    },
    amountNumber: {
      validator (rule, value, callback) {
        if (value) {
          // console.log(Number.isInteger(Number(value)))
          if (value >= 4 && value <= 8 && Number.isInteger(Number(value))) {
            callback()
          }
          callback(new Error(this.message))
        }
      }
    },
    isTwoPower: {
      validator (rule, value, callback) {
        if (value) {
          let isTwoPower = Math.log(value) / Math.log(2)
          // console.log(Number.isInteger(isTwoPower))
          if (Number.isInteger(isTwoPower) && isTwoPower > 0) {
            callback()
          }
          callback(new Error(this.message))
        }
      }
    },
    peopreRange: {
      validator (rule, value, callback) {
        if (value) {
          if (parseInt(value) >= 0 && parseInt(value) <= 100000) {
            callback()
          }
          callback(new Error(this.message))
        }
      }
    },
    venuesAddress: { // 上课地点
      validator (rule, value, callback) {
        if (value && value instanceof Array && value.some(item => {
          return item.address.length > 0
        })) {
          callback()
        }
        callback(new Error(this.message))
      },
      message: '不能为空'
    },
    cannotBeEmpty: { // 数组每一个都不能为空
      validator (rule, value, callback) {
        if (value && value instanceof Array && value.every(item => { return item.length > 0 })) {
          callback()
        }
        callback(new Error(this.message))
      },
      message: '不能为空'
    },
    idNo: {
      pattern: pattern.idNo,
      message: '输入的证件号不符合规则'
    }
  }
}
