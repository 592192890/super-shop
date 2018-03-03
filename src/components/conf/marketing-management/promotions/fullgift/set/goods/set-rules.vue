<template>
  <div>
    <el-dialog title="设置商品满赠" :close-on-click-modal="false" class="mod-pop-dialog" custom-class="mod-pop" top="10%" :visible.sync="isShow">
      <div :class="isView?'block-mask':''">
        <div class="mod-block">
          <div class="mod-search">
            <el-row :gutter="24">
              <el-col :span="24">
                <div class="mod-tags">
                  <b>{{row.name}}</b>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="mod-tags">
                  <label class="label">销售价：</label>
                  <span>{{row.salePrice}}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="mod-tags">
                  <label class="label">成本价：</label>
                  <span>{{row.cost}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 15px;">
              <el-col :span="20">
                <el-button size="small" @click="addFloor()">添加层级</el-button><span class="tips">最多添加5个层级</span>
              </el-col>
            </el-row>
          </div>
          <el-form ref="form" :model="form">
            <el-row :span="24" class="mod-floor-box"
                    v-for="(item, index) in form.group" :key="item.id"
                    v-if="!(index > 0 && isOverlying)">
              <el-row :span="24">
                <el-col :span="1" class="label l">满</el-col>
                <el-col :span="4" style="width: 50px;">
                  <el-form-item :prop="'group.'+ index +'.value'"
                                :rules="rules.value" class="rules-form-item">
                    <el-input v-model="item.value" placeholder="件数" size="small"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="unit">件送赠品</el-col>
                <el-col :span="6">
                  <el-button size="small" @click="addGift(index)">添加赠品</el-button>
                </el-col>
                <el-col :span="3" class="label" v-if="index == 0">
                  <el-checkbox v-model="isOverlying">是否叠加</el-checkbox>
                </el-col>
              </el-row>
              <el-form-item :prop="'group.'+ index +'.gifts'"
                            :rules="rules.gifts" class="rules-form-item">
              </el-form-item>
              <el-row :span="24" v-for="(gift, gindex) in item.gifts" :key="gift.goodsName" class="gift-rows">
                <el-col :span="15" class="label l">
                  <label class="proname">赠品{{gindex + 1}}: {{gift.goodsName}}</label>
                </el-col>
                <el-col :span="3" class="label">
                  数量:
                </el-col>
                <el-col :span="3">
                  <el-form-item :prop="'group.'+ index +'.gifts.' + gindex + '.num'"
                                :rules="rules.num" class="rules-form-item">
                    <el-input placeholder="数量" v-model="gift.num" size="small"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" class="label">
                  <label @click="deleteGift(gift, index)" class="cursor">删除</label>
                </el-col>
              </el-row>
              <span class="remove-row" v-if="index > 0" @click="deleteFloor(index)"><i class="iconfontmod">&#xe60d;</i></span>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="mod-pop-btn">
        <el-button @click="isShow=false">取消</el-button>
        <el-button type="primary" @click="onSubmit('form')" v-if="!isView">确定</el-button>
      </div>
    </el-dialog>
    <addGiftGoods :bus="bus"></addGiftGoods>
  </div>
</template>
<script>
	import Search from '../giftgoods/search.vue'
	import SearchTable from '../giftgoods/table.vue'
  import ElRow from "element-ui/packages/row/src/row"
  import ElCol from "element-ui/packages/col/src/col"
  import addGiftGoods from '../giftgoods/gift-goods.vue'
	export default {
		props:['bus', 'isView'],
		data(){
      let validateValue = (rule, value, callback) => {
        let index = parseInt(/\.(\d+)\./.exec(rule.field)[1])
        if(!value) {
          callback(new Error('必填项'))
        }
        if(!/^\+?[1-9]\d*$/.test(value)) {
          callback(new Error('必须大于0且为整数'))
        }
        if(index) {
          if(this.form.group[index-1].value>=this.form.group[index].value) {
            callback(new Error('必须大于上一层满赠件数'))
          }
        }
        callback()
      }
      /**
       * Input输入验证规则
       * 必须大于0且为整数
       * @param rule
       * @param value
       * @param callback
       */
      let validateNum = (rule, value, callback) => {
        if(!value) {
          callback(new Error('必填项'))
        }
        if(!/^\+?[1-9]\d*$/.test(value)) {
          callback(new Error('必须大于0且为整数'))
        }else {
          callback()
        }
      }
      let validateGifts = (rule, value, callback) => {
        if(!value.length) {
          callback(new Error('必须添加赠品'))
        }else {
          callback()
        }
      }
			return {
				isShow:false,
        // 是否叠加
        isOverlying: false,
        // 父组件行数据
        row: {},
        form: {},
        rules: {
          value: [{
            validator: validateValue, trigger: 'blur'
          }],
          num: [{
            validator: validateNum, trigger: 'blur'
          }],
          gifts: [{
            validator: validateGifts
          }]
        }
			}
		},
		components:{
      ElCol,
      ElRow,
      Search,
      SearchTable,
      addGiftGoods
    },
		methods:{
      /**
       * 添加赠品
       * @param index 楼层索引
       */
      addGift(index){
        this.bus.$once('addgift/submit', sels => {
          console.log(sels);
          this.form.group[index].gifts = sels
          Array.some(this.form.group[index].gifts, n => {
            if(!n.num) {
              this.$set(n,"num", '')
            }
            n.name = n.name || n.specName
          })
        })
        this.bus.$emit('addgift', {flag:true, sels:this.form.group[index].gifts})
      },
      /**
       * 添加楼层,最多5层
       */
      addFloor() {
          if(this.isOverlying) {
            this.$message.warning('叠加状态无法添加')
            return
          }
          if(this.form.group.length >= 5) {
            this.$message.warning('最多添加5层')
            return
          }
          this.form.group.push({
            id: '',
            value: '',
            gifts: []
          })
      },
      /**
       * 删除楼层
       * @param index 楼层索引
       */
			deleteFloor(index) {
        this.form.group.splice(index, 1)
      },
      /**
       * 删除赠品
       * @param gift 赠品对象
       * @param index 楼层索引
       */
      deleteGift(gift, index) {
        this.form.group[index].gifts.splice(this.form.group[index].gifts.indexOf(gift), 1)
      },
      /**
       * 提交操作
       */
			onSubmit(formName){
				// change format
				// this.formatSels()
				// if(!this.sels || this.sels.length==0){
				// 	this.$message.error('至少选择一个商品!')
				// 	return false
				// }
				// this.bus.$emit('add/table/submit', this.sels)

        this.$refs[formName].validate(valid => {
          if (valid) {
            // 如果勾选叠加则只返回列表中第一层
            this.isOverlying && (this.form.group = [this.form.group[0]])
            this.form.group.forEach(k=>{
              k.gifts.forEach(v => {
                v.num = parseInt(v.num)
              })
            })
            this.form.isOverlying = this.isOverlying
            this.bus.$emit('add/set-rules/submit', this.form)
            this.isShow = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
			}
		},
		mounted(){
			this.bus.$on('add/set-rules', obj => {
        this.row = obj.sels
        this.isShow = obj.flag
        this.isOverlying = obj.sels.isOverlying
        this.form = obj.sels.rules ? {group: obj.sels.rules}:{
          group: [{
            id:'',
            value: '',
            gifts: []
          }]
        }
			})
		}
	}
</script>
<style lang="scss" scoped>
  .mod-tags {
    margin-bottom: 10px;
    .label {
      color: #999;
    }
  }
  .mod-block {
    padding: 0 0 30px 0;
  }
  .cursor {
    color: #3dc8f6;
    cursor: pointer;
  }
  .rules-form-item {
    position: relative;
    top: -5px;
  }
  .mod-search {
    margin-bottom: 10px;
  }
  .tips {
    color: #f57575;
    margin-left: 10px;
  }
  .mod-floor-box {
    /*border: 1px solid #ccc;*/
    /*margin: 15px 0;*/
    /*padding-top: 15px;*/
    /*position: relative;*/
    border: 1px solid #e8fffd;
    margin: 15px 0;
    position: relative;
    padding: 15px 10px 0;
    .unit {
      width: 130px;
      padding: 6px 10px;
      text-align: left;
    }
    .label {
      padding: 6px 0;
      text-align: center;
      &.l {
        text-align: left;
      }
    }
    .remove-row {
      cursor: pointer;
      position: absolute;
      top: 16px;
      right: 0;
      .iconfontmod {
        color: #999;
        font-size: 20px;
      }
    }
    .gift-rows {
      margin: 10px 0;
      .proname {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        white-space: nowrap;
      }
    }
    .el-form-item {
      margin: 0;
    }
  }
</style>
