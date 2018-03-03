<template>
    <div class="mod-block mod-set">
      <div :class="isView?'block-mask':''">
      	<div class="mod-search">
  	    	<el-row type="flex">
            <el-col>
              <span class="mod-tags">
                <label>活动名称：</label>
                <span>{{actName}}</span>
              </span>
              <span class="mod-tags">
                <label>活动类型：</label>
                <span>{{actTypeName}}</span>
              </span>
            </el-col>
          </el-row>
  		  </div>
        <el-row :span="24" class="mod-floor-bar">
          <el-button size="small" @click="addFloor()">添加层级</el-button><span class="tips">最多添加5个层级</span>
        </el-row>
    		<el-form ref="form" :model="form">
          <el-row :span="24" class="mod-floor-box"
                  v-for="(item, index) in form.group" :key="item.id">
            <el-row :span="24">
              <el-col :span="2" class="label l" style="width: 55px;">订单满</el-col>
              <el-col :span="2" style="width: 80px;">
                <el-form-item :prop="'group.'+ index +'.value'"
                              :rules="rules.value" class="money-form-item">
                  <el-input v-model="item.value" placeholder="金额" size="small"></el-input>
                </el-form-item>
                <!--<el-input v-model="item.value" placeholder="金额" size="small"></el-input>-->
              </el-col>
              <el-col :span="2" class="unit">元</el-col>
              <el-col :span="6">
                <el-button size="small" @click="addGift(index)">添加赠品</el-button>
              </el-col>
              <el-button v-if="index > 0" class="f-r" type="primary" size="small" @click="deleteFloor(index)">删除</el-button>
            </el-row>
            <el-row :span="24">
              <el-table :data="item.items" style="width: 100%" ref="elTable">
                <el-table-column label="序号" type="index" width="80">
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称" width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" label="销售价" width="100">
                </el-table-column>
                <el-table-column label="赠送数量" width="100">
                  <template scope="scope">
                    <el-form-item :prop="'group.'+ index +'.items.' + scope.$index + '.giftNum'"
                                  :rules="rules.num">
                      <el-input v-model="scope.row.giftNum" placeholder="赠送数量" size="small"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="总数限制" style="width:360px">
                  <template scope="scope">
                    <el-select v-model="scope.row.limitType" @change="limitTypeChange(scope.row)" placeholder="请选择" style="width:140px" size="small">
                      <el-option
                        v-for="item in limits"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                      <!--<el-option label="抢完为止" value="1"></el-option>-->
                      <!--<el-option label="限定总数量" value="2"></el-option>-->
                      <!--<el-option label="限定每天总数" value="3"></el-option>-->
                    </el-select>
                    <el-form-item :prop="'group.'+ index +'.items.' + scope.$index + '.limitValue'"
                                  :rules="rules.num" class="tablenum-form-item"
                                  v-if="scope.row.limitType != '1'">
                      <el-input v-model="scope.row.limitValue" placeholder="限制数量" style="width:120px" size="small"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column  prop="operator" label="操作" width="100">
                  <template scope="scope">
                    <el-button type="text" size="small" @click="deleteGift(scope.row, index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-form-item :prop="'group.'+ index +'.items'"
                            :rules="rules.items" class="rules-form-item">
              </el-form-item>
            </el-row>
            <!--<span class="remove-row cursor"  @click="deleteFloor(index)"><i class="el-icon el-icon-close"></i></span>-->

          </el-row>
    		</el-form>
      </div>
      <el-col :span="24" class="mod-toolbar">
        <div class="f-l">
          <el-button type="primary" @click="submitForm('form')" :disabled="form.group.length==0" v-if="!isView">提交活动</el-button>
          <el-button @click="historyBack">返回上一步</el-button>
        </div>
      </el-col>
    <addGiftGoods :bus="bus"></addGiftGoods>
    </div>
</template>
<script>
	import Vue from 'vue'
	import addGiftGoods from '../giftgoods/gift-goods.vue'
  import util from '@/assets/js/util'
	import Permission from '@/assets/js/permission-util.js';
	export default {
		components:{
      addGiftGoods
    },
		data(){
      let validateMoney = (rule, value, callback) => {
        let index = parseInt(/\.(\d+)\./.exec(rule.field)[1])
        if(!value) {
          callback(new Error('必填项'))
        }
        if(!/(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/.test(value)) {
          callback(new Error('非法金额'))
        }
        if(index) {
          if(this.form.group[index-1].value>=this.form.group[index].value) {
            callback(new Error('必须大于上一层满赠金额'))
          }
        }
        callback()
      }
      let validateItems = (rule, value, callback) => {
        if(!value.length) {
          callback(new Error('必须存在赠品'))
        }else {
          callback()
        }
      }
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
			return {
				bus: new Vue(),
        index:0,
        limits: [{
          value: 1,
          label: '抢完为止'
        },{
          value: 2,
          label: '限定总数量'
        },{
          value: 3,
          label: '限定每天总数'
        }],
        form: {
          group: [{
            id: '',
            value: '',
            items: []
          }],
          isUpdate: true
        },
        id: this.$route.query.id,
        activity:'',
				activeName: '',
				activeClassify: '',
        actName: '',
        actTypeName: '',
        currentPage: 1,
        currPage: 1,
        total: 0,
        pageSize: 10,
        rules: {
          value: [
            { validator: validateMoney, trigger: 'blur' }
          ],
          items: [
            { validator: validateItems }
          ],
          num: [
            { validator: validateNum, trigger: 'blur' }
          ]
        }
			}
		},
		computed:{
			isView(){
				var matched = this.$router.currentRoute.matched;
				var list = matched[matched.length-2].path+'/list';
				var ar = Permission.button(list, this.$router.options.routes)||[];
				return !(ar.indexOf('bt-edit')>-1 && this.form.isUpdate);
			}
		},
		methods:{
      /**
       * 添加赠品
       * @param index 楼层索引
       */
      addGift(index){
        this.index = index
//        this.bus.$once('add/gift-goods/submit', (sels) => {
//          Array.some(sels, n => {
//            if(!n.num) {
//              this.$set(n,"num", '')
//            }
//            if(!n.limit) {
//              let limit = {
//                type: '1',
//                size: ''
//              }
//              this.$set(n,"limit", limit)
//            }
//          })
//          this.form.group[index].items = sels
//        });
//        this.bus.$emit('add/gift-goods', {flag:true, sels:this.form.group[index].items});
        this.bus.$emit('addgift', {flag:true, sels:this.form.group[this.index].items});
      },
      /**
       * 添加楼层,最多5层
       */
      addFloor() {
        if(this.form.group.length >= 5) {
          this.$message.warning('最多添加5层')
          return
        }
        this.form.group.push({
          id: '',
          value: '',
          items: []
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
        this.form.group[index].items.splice(this.form.group[index].items.indexOf(gift), 1)
      },
      limitTypeChange(row) {
        if(row.limitType == 1) {
          row.limitValue = ''
        }
      },
      //设置活动信息
      setActMsg(){
        this.activity = JSON.parse(sessionStorage.getItem('active-add'));
        if(this.activity){
          this.actName = this.activity.name;
          this.actTypeName = this.activity.actTypeName;
        }
      },
			historyBack(){
				sessionStorage.setItem('active-set', JSON.stringify(this.$data.form));
				this.$router.push({path:'/marketing-management/promotions/fullgift/@add', query:{type:'edit'}});
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.group.forEach(k=>{
              k.items.forEach(v => {
                v.giftNum = parseInt(v.giftNum)
              })
            })
            let opt = {
              activity: JSON.stringify(this.activity),
              params: JSON.stringify({
                rules:this.form.group
              }),
              saveRedisTable: false
            }
            let ajaxUrl = this.id ? this.$apiUrl.marketing.updateActive : this.$apiUrl.marketing.addActive
            this.$ajax.post(ajaxUrl, opt).then((res) => {
              if(res.error == 0){
                this.$message({
                  showClose: true,
                  message: '活动设置成功',
                  type: 'success'
                });
                // 必须跳转到列表页，不然不会更新临时表内容
                this.$router.push({path:'/marketing-management/promotions/fullgift/list'});
              }else{
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error'
                });
              }
              
            });
          } else {
            console.log('error submit!!');
            return false;
          }
				});
			}
      //设置活动信息
      // setActMsg(){
      //   try {
      //     this.activity = JSON.parse(sessionStorage.getItem('active-add'))
      //     if (this.activity.name) {
      //       this.activeName = this.activity.name
      //       this.activeClassify = this.activity.activeTypeLabel
      //       this.activeType = this.activity.actType
      //     }else {
      //       throw "active is empty"
      //     }
      //   }catch (e) {
      //     // 解析活动信息异常时返回到添加页
      //     this.$message.warning("活动信息异常")
      //     this.$router.push({path:'/marketing-management/promotions/fullgift/@add'})
      //   }
      // }
		},
		mounted(){
      this.setActMsg();
      this.listLoading = true;
      this.bus.$on('addgift/submit', sels => {
        Array.some(sels, n => {
          if(!n.giftNum) {
            this.$set(n,"giftNum", '')
          }
          if(!n.limitType) {
            this.$set(n,"limitType", 1)
          }
          if(!n.limitValue) {
            this.$set(n,"limitValue", '')
          }
          n.name = n.name ||  n.specName
          n.price = n.price ||  n.salePrice
        })
        this.form.group[this.index].items = sels
      });
      if(sessionStorage.getItem('active-set')){
        this.$data.form = JSON.parse(sessionStorage.getItem('active-set'))
        this.listLoading = false
        return false;
      }
      if(this.id){
        this.listLoading = false
        this.$ajax.post(this.$apiUrl.marketing.getActiveInfo,{id: this.id,saveRedisTable:false}).then((res) =>{
          // this.form.tableId = res.data.params.tableId
          this.form.group = res.data.params.rules;
          this.form.isUpdate = res.data.params.isUpdate;
          // this.getRedistable()
        });
      }
		}
	}
</script>
<style lang="scss" scoped>
  .mod-block {
    padding: 0 0 30px 0;
    background-color: #f2f6f9;
  }
  .mod-search{
    padding: 20px;
  }
  .mod-tags{
    margin-right: 20px;
    font-size: 14px;
    label{
      color: #666;
    }
    span{
      color: #333;
    }
  }
  .cursor {
    cursor: pointer;
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .money-form-item {
    position: relative;
    top: -5px;
  }
  .tablenum-form-item {
    display: inline-block;
    position: relative;
    top: -1px;
  }
  .tips {
    color: #f57575;
    margin-left: 10px;
  }
  .mod-floor-bar {
    padding: 20px 20px 0 0;
    position: relative;
  }
  .mod-floor-box {
    padding: 20px;
    margin: 10px 0;
    position: relative;
    background: #fff;
    .unit {
      padding: 6px 10px;
      width: 105px;
      text-align: left;
    }
    .label {
      padding: 6px 0;
      text-align: center;
      &.l {
        text-align: left;
      }
    }
    .gift-rows {
      margin: 10px 0
    }
  }
  .mod-pop .mod-pop-btn {
    position: inherit;
    text-align: right;
  }
</style>
<style lang="scss">
	.mod-set{
    .el-form-item__error{
      position: relative;
      margin-bottom: 5px;
      text-align: left;
    }
    .el-table tr{
      height: 55px;
    }
  }
</style>
