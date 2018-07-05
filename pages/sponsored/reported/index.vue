<template>
  <div class="mod-wrap reported-wrap">
    <div class="banner-box">
      <img src="/images/sponsor/resources/reported_banner.png" alt="寻求报道" />
    </div>
    <div class="mod-main reported-box">
      <el-row>
        <el-col :span="16" class="form-box">
          <el-form ref="form" label-width="82px" :model="form">
            <h3>寻求报告</h3>
            <el-form-item label="公司名称：" 
              prop="companyName"
              :rules="{ required: true, message: '名称不能为空'}">
              <el-col :span="24">
                <el-input v-model="form.companyName" :maxlength="40" placeholder="请输入公司名称" number-word/>
              </el-col>
            </el-form-item>
            <el-form-item label="公司地址："  
              prop="companyAddress"
              :rules="{ required: true, message: '地址不能为空'}">
              <el-col :span="24">
                <el-input v-model="form.companyAddress" :maxlength="80" placeholder="请输入地址" number-word />
              </el-col>
            </el-form-item>
            <el-form-item label="所属类型：">
              <el-col :span="24">
                <el-select v-model="form.typeValue" placeholder="请选择">
                  <el-option label="我要项目要招商" value="1"></el-option>
                  <el-option label="我要为品牌做推广" value="2"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="报道需求：" 
              prop="reportDemand"
              :rules="{ required: true, message: '不能为空'}">
              <el-col :span="24">
                <el-input v-model="form.reportDemand" :maxlength="40" number-word />
              </el-col>
            </el-form-item>
            <el-form-item label="项目亮点："  
              prop="projectHign"
              :rules="{ required: true, message: '不能为空'}">
              <el-col :span="24">
                <el-input v-model="form.projectHign" :maxlength="100" type="textarea" number-word />
              </el-col>
            </el-form-item>
            <el-form-item label="其他报道："  
              prop="othersDemand"
              :rules="{ required: true, message: '不能为空'}">
              <el-col :span="24">
                <el-input v-model="form.othersDemand" 
                  :maxlength="100" 
                  type="textarea" 
                  placeholder="每行一个链接" number-word />
              </el-col>
            </el-form-item>
            <el-form-item label="报道角度："  
              prop="reportAngle"
              :rules="{ required: true, message: '数据不能为空'}">
              <el-col :span="24">
                <el-input v-model="form.reportAngle" placeholder="希望我们报告的角度" :maxlength="40" number-word />
              </el-col>
            </el-form-item>
            <el-form-item label="联系方式："  
              prop="linkPhone"
              :rules="[{ required: true, message: '联系电话不能为空'}, validator.rule.isPhone]">
              <el-col :span="24">
                <el-input v-model="form.linkPhone" placeholder="请输入联系电话"></el-input>
              </el-col>
            </el-form-item>
            <p class="reported-tips">* 请尽量详细填写以上信息，以便于我们更好的了解您的需求。</p>
            <div class="button-box">
              <el-button type="warning" :loading="loading" native-type="submit">提交审核</el-button>
            </div>
          </el-form>
        </el-col>
        <el-col :span="8" class="process-box">
          <h3>申请流程</h3>
          <el-steps direction="vertical" :active="5" class="steps-primary" :space="60">
            <el-step title="填写报道申请交提交"></el-step>
            <el-step title="等待平台体育审核，1个工作日内回复"></el-step>
            <el-step title="审核通过，收到邮件"></el-step>
            <el-step title="我们直接联系您进行采访"></el-step>
            <el-step title="报道完成，文章发布"></el-step>
          </el-steps>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
  import { form } from 'utils/mixins' // 引入form mixin
  import {ElSteps, ElStep} from '@element-ui/Steps'
  import validator from 'utils/validator'
  import api from 'api/sponsored/resources'
  export default {
    layout: 'sponsor',
    components: {
      ElSteps,
      ElStep
    },
    mixins: [form],
    data () {
      return {
        validator,
        loading: false,
        form: {
          companyName: '',
          companyAddress: '',
          typeValue: '1',
          reportDemand: '',
          projectHign: '',
          othersDemand: '',
          reportAngle: '',
          linkPhone: ''
        }
      }
    },
    methods: {
      submit () {
        api.reported(this.form, {context: this, successMsg: '提交成功'}).then((json) => {
          this.$alert('提交申请成功', '提示', {
            type: 'success',
            confirmButtonText: '确定'
          })
          this.$refs['form'].resetFields()
        })
      }
    }
  }
</script>
<style lang="scss">
  
  .mod-wrap{
    background: #ebf0f5;
    position:relative;
  }
  .mod-main{
    width:1200px;
    height: 100%;
    margin:0 auto;
    overflow: hidden;
    position:relative;
  }
  .reported-wrap{
    margin-bottom: -40px;
    .banner-box{
      overflow: hidden;
    }
    .reported-box{
      margin-top: -220px;
      .form-box{
        width:700px;
        /*min-height: 990px;*/
        margin-left: 60px;
        margin-bottom: 180px;
        padding:40px 50px;
        box-sizing: border-box;
        background: #fff;
        box-shadow: -20px 20px 0px rgba(216,216,216, 0.5);
        .el-select{
          width:100%;
        }
        h3{
          font-size: 18px;
          color:$color-black;
          margin-bottom: 25px;
        }
        .reported-tips{
          font-size:12px;
          color:$color-error;
          margin-left: 82px;
        }
        .el-form-item__label{
          &:before{
            content: '';
            margin-right: 0;
          }
        }
      }
    }
    .process-box{
      margin-top: 285px;
      padding-left: 60px;
      h3{
        font-size: 18px;
        color:$color-black;
        margin-bottom: 35px;
      }
    }
  }

</style>
