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
      <el-row :span="24">

      </el-row>
      <el-row :span="24" class="mod-floor-bar">
        <el-button type="small" @click="addGoods">添加商品</el-button>
        <el-button size="small" @click="importGoods">导入商品</el-button>
      </el-row>
    </div>
    <el-form :rules="rules" ref="form" :model="form" label-position="left"
             class="form">
      <el-table :data="form.tableData" style="width: 100%" v-loading="listLoading" ref="elTable">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column width="80" label="序号">
          <template scope="scope">
            {{scope.$index + 1}}
              </template>
        </el-table-column>
        <el-table-column prop="goodsName" width="180" label="商品名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="name" width="180" label="规格" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bn" width="180" label="SKU编码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="活动库存数" width="130">
          <template scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.maxActStock'"
                          :rules="rules.maxActStock">
              <el-input v-model="scope.row.maxActStock" placeholder="活动库存数" :disabled="isView"></el-input>
            </el-form-item>
          </template>
        </el-table-column>自适应<el-table-column>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="140" align="left">
          <template scope="scope">
            <el-button type="text" @click="openSetRules(scope.row)">配置规则</el-button>
            <el-button type="text" @click="deleteRowData(scope.row)" :disabled="isView">删除</el-button>
            <el-form-item :prop="'tableData.' + scope.$index + '.rules'"
                          :rules="rules.setRules">
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="mod-toolbar">
        <div class="f-l">
          <el-button type="primary" @click="submitForm('form')" :disabled="form.tableData.length==0" v-if="!isView">提交活动</el-button>
          <el-button @click="historyBack">返回上一步</el-button>
        </div>
        <el-pagination layout="prev, pager, next"
                       ref="pagination"
                       @click.native="handleCurrentChange"
                       @keyup.enter.native="handleCurrentChange"
                       :page-size="pageSize" :total="total" class="f-r" :current-page.sync="currentPage">
        </el-pagination>
      </el-col>
    </el-form>
    <addPartGoods :bus="bus"></addPartGoods>
    <setRules :bus="bus" :isView="isView"></setRules>
    <ImportGoods :bus="bus"></ImportGoods>
  </div>
</template>
<script>
  import Vue from 'vue'
  import addPartGoods from '@/components/common/add-product/index.vue'
  import setRules from './set-rules.vue'
  import ImportGoods from '@/components/common/import/index.vue'
  import util from '@/assets/js/util'
	import Permission from '@/assets/js/permission-util.js'
  export default {
    components:{
      setRules,
      addPartGoods,
      ImportGoods
    },
    data(){
      /**
       * 库存输入验证规则
       * @param rule
       * @param value
       * @param callback
       */
      let validateStock = (rule, value, callback) => {
        if(value && !/^\+?[1-9]\d*$/.test(value)) {
          callback(new Error('必须为大于0的整数'))
        }else {
          callback()
        }
      }
      let setRules = (rule, value, callback) => {
        if(!value) {
          callback(new Error('必须设置规则'))
          return
        }
        value.forEach(k => {
          if(!k.gifts.length) {
            callback(new Error('规则数据不完整'))
          }
        })
        callback()
      }
      return {
        bus: new Vue(),
        form:{
          tableData: [],
          tableId: '',
          sels:[],
          showHeader: false,
          isUpdate: true
        },
        id: this.$route.query.id,
        activity:'',
        activeName: '',
        activeClassify: '',
        actName: '',
        actTypeName: '',
        delVisible: false,
        listLoading:true,
        currentPage: 1,
        currPage: 1,
        total: 0,
        pageSize: 10,
        rules: {
          maxActStock: [{
            validator: validateStock, trigger: 'blur'
          }],
          setRules:[{
            validator: setRules
          }]
        }
      }
    },
		computed:{
			isView(){
				let matched = this.$router.currentRoute.matched;
				let list = matched[matched.length-2].path+'/list';
				let ar = Permission.button(list, this.$router.options.routes)||[];
				return !(ar.indexOf('bt-edit')>-1 && this.form.isUpdate);
			}
		},
    methods:{
      /**
       * 添加商品
       * @param item
       * @param index
       * @param table
       */
      addGoods(item, index, table){
        if(!this.activity.shopIds) {
          this.$message.warning("参与店铺不存在")
          return
        }
        this.bus.$emit('add', {flag:true, sels:this.form.tableData, tableId: this.form.tableId, shopIds: this.activity?this.activity.shopIds:[]})
        // this.bus.$emit('add', {flag:true, sels:item.data, tableId: this.form.tableId, shopIds: this.activity.shopIds})
      },
      /**
       * 导入商品
       */
      importGoods(){
        let data = {
          flag: true,
          actData: this.activity,
          tableId: this.form.tableId,
          sels: this.form.tableData,
          type: 'bn'
        }
        // 导入商品前先把当前列表中的数据提交到临时表
        if(this.form.tableData.length) {
          this.$refs['form'].validate(valid => {
            if (valid) {
              this.onAddGoods(false, {data: this.form.tableData, key: 'bn'}, () => {
                this.bus.$emit('import', data)
              })
            } else {
              return false
            }
          })
        }else {
          this.bus.$emit('import', data)
        }
      },
      /**
       * 打开设置规则
       * @param row 行数据
       */
      openSetRules(row) {
        // console.log(row.rules&&row.rules.group[0].fullnum)
        let data = row
        this.bus.$once('add/set-rules/submit', sels => {
          // 修改字段名 bn->targetId
          sels.group.forEach(item => {
            item.gifts.forEach(g => {
//              if(g['bn']) {
//                g.targetId = g['bn']
//              }
              if(g['specName']) {
                g.name = g['specName']
              }
            })
          })
          data.rules = sels.group
          data.isOverlying = sels.isOverlying
        });
        this.bus.$emit('add/set-rules', {flag:true, sels: data});
      },
      //设置活动信息
      setActMsg(){
        this.activity = JSON.parse(sessionStorage.getItem('active-add'));
        if(this.activity){
          this.actName = this.activity.name;
          this.actTypeName = this.activity.actTypeName;
        }else {
          this.$router.push({path:'/marketing-management/promotions/fullgift/@add'})
        }
      },
      /**
       * 删除临时表商品
       * @param row 行数据
       */
      deleteRowData(row) {
        this.$confirm('确定删除这条数据么?',{type:'warning'}).then((res)=>{
          if(res){
            this.onAddGoods(false, {data:this.form.tableData, key:'bn'}, () => {
              this.$ajax.post(this.$apiUrl.marketing.deleteRedisData,{dataId: row.bn, tableId: sessionStorage.getItem('tableId') || this.form.tableId}).then((rst)=>{
                if(rst.error == 0){
                  this.$message.success('删除成功!');
                  this.getRedistable();
                }
              });
            });
          }
        }).catch(() => {});
      },
      /**
       * 分页当前页码改变
       */
      handleCurrentChange() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.currentPage = this.$refs.pagination.currentPage
            this.currPage = this.currentPage
            this.$refs.pagination.handleCurrentChange(this.currentPage)
            this.onAddGoods(false, {data:this.form.tableData, key:'bn'},this.getRedistable)
          } else {
            this.$refs.pagination.handleCurrentChange(this.currPage)
            return false
          }
        })
      },
      /**
       * 返回
       */
      historyBack(){
        sessionStorage.setItem('active-set', JSON.stringify(this.$data.form))
        this.$router.push({path:'/marketing-management/promotions/fullgift/@add', query:{type:'edit'}})
      },
      /**
       * 提交活动
       * @param formName
       */
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.form.tableData.forEach(k=>{
              k.maxActStock = k.maxActStock == ''?'': parseInt(k.maxActStock)
            })
            this.onAddGoods(false, {data:this.form.tableData, key:'bn'}, () => {
              let opt = {
                activity: JSON.stringify(this.activity),
                params: JSON.stringify({
                  tableId: this.form.tableId
                })
              }
              let ajaxUrl = this.id ? this.$apiUrl.marketing.updateActive : this.$apiUrl.marketing.addActive
              this.$ajax.post(ajaxUrl, opt).then((res) => {
                if(res.error==0){
                  this.$message({
                    showClose: true,
                    message: '活动设置成功',
                    type: 'success'
                  })
                  // 必须跳转到列表页，不然不会更新临时表内容
                  this.$router.push({path:'/marketing-management/promotions/fullgift/list'});
                }
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        });
      },
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
      // },
      //获取临时表数据
      getRedistable(){
        let getOpt = {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          tableId: this.form.tableId
        }
        if(!getOpt.tableId) return
        this.$ajax.post(this.$apiUrl.marketing.getRedistable, getOpt).then(res => {
          this.total = res.data.totalRow
          this.listLoading = false
          let listData = util.array.toArray(res.data.listData)
          Array.forEach(listData, v => {
            v.maxActStock = v.maxActStock || ''
            v.name = v.name || v.specName
          })
          this.form.tableData = listData
        });
      },
      //获取临时表ID
      getRedistableId(){
        let tableId = sessionStorage.getItem('tableId')
        let opt = {
          actType: this.activity.actType
        }
        if(tableId){
          this.form.tableId = tableId
          this.getRedistable()
        }else {
          this.$ajax.post(this.$apiUrl.marketing.getRedistableId,{tableInfo: JSON.stringify(opt)}).then(res => {
            this.form.tableId = res.data
            sessionStorage.setItem('tableId', res.data)
            this.getRedistable()
          });
        }
      },
      //更新临时表数据，emptyFlag true 覆盖，flase 更新
      onAddGoods(emptyFlag, obj, callback){
        let productArr = util.array.toObject(obj.data, obj.key, obj.transform)
        let opt = {
          tableId: this.form.tableId,
          datas: JSON.stringify(productArr),
          ifEmptyOld: emptyFlag
        }
        this.$ajax.post(this.$apiUrl.marketing.redistableAdd, opt).then(res => {
          let getOpt = {
            currentPage: 1,
            pageSize: this.form.pageSize,
            tableId: this.form.tableId
          }
          // this.getRedistable()
        }).then(function(){
          callback && callback()
        });
      },
    },
    mounted(){
      let self = this;
      this.setActMsg();
      this.listLoading = true;
      this.bus.$on('index/add/table/submit', sels => {
        this.onAddGoods(true, {data:sels, key:'bn'}, this.getRedistable)
      })
      this.bus.$on('import/success', function(){
        self.getRedistable();
      });
      if(sessionStorage.getItem('active-set')){
        this.$data.form = JSON.parse(sessionStorage.getItem('active-set'))
        this.listLoading = false;
        return false;
      }
      if(this.id){
        this.$ajax.post(this.$apiUrl.marketing.getActiveInfo,{id: this.id}).then((res) =>{
          this.form = Object.assign(this.form, res.data.params);
          this.getRedistable()
        })
      }else {
        this.getRedistableId()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mod-search{
    background-color: #fff;
    padding: 20px;
  }
  .mod-block{
    background-color: #f2f6f9;
    padding: 0;
  }
  .mod-tags{
    font-size: 14px;
    margin-right: 20px;
    label{
      color: #666;
    }
    span{
      color: #333;
    }
  }
  .mod-add-goods{
    margin-top: 20px;
  }
  .mod-tips{
    margin: 20px 0;
    .tips-text{
      color: #999;
    }
    .icon{
      margin-right: 5px;
    }
  }
  .mod-floor-bar {
    padding: 20px 0;
    position: relative;
  }
  .mod-box{
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    .desc-price{
      line-height: 30px;
      color: #5bc7a3;
      span{
        margin-right: 20px;
      }
    }
    .desc{
      margin-bottom: 20px;
    }
  }
  .mod-list{
    border: 1px solid #f3f5f7;
    border-bottom: none;
    .mod-item{
      height: 50px;
      line-height: 40px;
      border-bottom: 1px solid #f5f5f5;
      font-size: 14px;
      color: #333;
      padding: 5px 20px;
      .item-goods{
        span{
          width: 200px;
        }
      }
      .del{
        margin: 7px 0 0 20px;
        line-height: 38px;
      }
    }
  }
  .mod-mode{
    margin-top: 20px;
    .mode-desc{
      line-height: 38px;
      margin-left: 10px;
    }
  }
  .el-form-item{
    margin-bottom: 0
  }
  .btn {
    cursor: pointer
  }
  .del-btn {
    margin-left: 15px
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
