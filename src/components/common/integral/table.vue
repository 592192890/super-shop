<template>
    <div class="mod-search-table">
        <el-table :data="ajaxData.list" style="width: 100%" v-loading="listLoading">
            <slot name="column"></slot>
            <el-table-column label="操作" width="200"  fixed="right" align="left" >
                <template scope="scope">    
                    <div>
                        <el-button type="text" @click="checkTicket(scope.$index, scope.row)" v-if="buttonArr.indexOf('bt-check')!=-1">查看小票</el-button>
                        <el-button type="text" v-if="buttonArr.indexOf('bt-audit')!=-1&&scope.row.status==1" @click="audit(scope.row)" >去审核</el-button>
                        <el-button type="text" v-if="buttonArr.indexOf('bt-refuse')!=-1&&scope.row.status==1" @click="reject(scope.row)">拒绝</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="mod-toolbar">
            <el-pagination ref="pagination"
                style="float:right;"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page.sync="ajaxData.currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="ajaxData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="ajaxData.totalRow">
            </el-pagination>
        </el-col>
        <el-dialog
          title="小票预览"
          :visible.sync="dialogVisible"
          size="tiny"
          >
          <div class="qr-code" v-if="dialogVisible"><img @click="enlargeImg(imageUrl)" :src="imageUrl"></div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :visible.sync="dialogAuditVisible"
          size="tiny"
          title="审核"
        >
            <div>
                <label>消费时间：</label>
                <span>{{consumeTime}}</span>
            </div>
            <div class="audit">
                <label>消费金额：</label>
                <el-input v-model="consumeAmount" style="width:100px" placeholder="请输入内容"></el-input>
            元</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogAuditVisible = false">取 消</el-button>
            <el-button type="primary" @click="onAudit">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :visible.sync="dialogRejectVisible"
          size="tiny"
          title="拒绝积分原因"
        >
            <el-select v-model="value" style="100%" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogRejectVisible = false">取 消</el-button>
            <el-button type="primary" @click="onReject">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
    import util from '@/assets/js/util'
    import Permission from '@/assets/js/permission-util.js';
    export default {
        props:['bus'],
        data(){
            return {
                value:'',
                dialogVisible:false,
                dialogAuditVisible:false,
                dialogRejectVisible:false,
                imageUrl:'',
                currentItem:null,
                consumeTime:'',
                consumeAmount:'',
                options: [{
                  value: '消费小票已过积分时间',
                  label: '消费小票已过积分时间'
                }, {
                  value: '消费小票不属于该门店',
                  label: '消费小票不属于该门店'
                }, {
                  value: '消费小票不清晰，需重新拍摄',
                  label: '消费小票不清晰，需重新拍摄'
                }],
                formData:{},
                listLoading:true,
                ajaxData: {},
                buttonArr:[]
            }
        },
        methods:
        {
            enlargeImg(url){
                window.open(url);
            },
            checkTicket(index, row){
                this.imageUrl = row.imageUrl
                this.dialogVisible = true
            },
            reject(row){
                this.currentItem = row
                this.dialogRejectVisible = true
            },
            onReject(){
                let self = this, opt = {
                    id: parseInt(this.currentItem.id),
                    failureCause: this.value
                }
                this.listLoading = true;
                this.$ajax.get(self.$apiUrl.getInteralRefuseUrl,opt).then((rst)=>{
                    this.listLoading = false;
                    this.dialogRejectVisible = false
                    if(rst.error == 0){
                        this.$message({
                            message: rst.msg,
                            type: 'success'
                        });
                        this.getData()
                        this.currentItem = null
                    }
                    
                }); 
            },
            audit(row){ 
                this.currentItem = row
                this.consumeTime = row.consumeTime
                this.consumeAmount = row.consumeAmount
                this.dialogAuditVisible = true
            },
            onAudit(){
                let self = this, opt = {
                    id: parseInt(this.currentItem.id),
                    consumeAmount: parseInt(this.consumeAmount)
                }
                this.listLoading = true;
                this.$ajax.get(self.$apiUrl.getInteralAuditUrl,opt).then((rst)=>{
                    this.listLoading = false;
                    this.dialogAuditVisible = false
                    if(rst.error == 0){
                        this.$message({
                            message: rst.msg,
                            type: 'success'
                        });
                        this.getData()
                        this.currentItem = null
                    }
                    
                }); 
            },
            //operate end
            //页码改变事件
            handleCurrentChange(val)
            {
                this.getData();
            },
            //每页条数改变事件
            handleSizeChange(pageSize){
                this.ajaxData.pageSize = pageSize;
                this.getData();
            },

            handleTime(data){
                if(data && data.list && data.list.length){
                    data.list.forEach(function(val){
                        val.consumeTime = val.consumeTime && util.formatDate.format(new Date(val.consumeTime), 'yy-MM-dd hh:mm:ss ')
                        val.integralTime = val.integralTime && util.formatDate.format(new Date(val.integralTime), 'yy-MM-dd hh:mm:ss ')
                    })
                    return data
                }    
            },
            //获取数据
            getData()
            {
                let self = this;
                self.listLoading = true;
                let opt = Object.assign({
                    currentPage: self.ajaxData.currentPage || 1,
                    pageSize: self.ajaxData.pageSize || 20
                }, self.formData);
                this.$ajax.get(this.$apiUrl.getInteralListUrl, opt).then(res =>{
                    this.listLoading = false;
                    if(res.error==0){
                        let data = this.handleTime(res.data)
                        this.ajaxData = Object.assign({},data); 
                    }  
                });
            }
        },
        created()
        {
            var self = this;
            this.bus.$on('index/search', function(obj){
                self.formData = Object.assign({},obj)
                if(self.formData.endIntegralTime){
                    self.formData.endIntegralTime = self.formData.endIntegralTime + 3600 * 1000 * 24
                }
                if(self.formData.endConsumeTime){
                    self.formData.endConsumeTime = self.formData.endConsumeTime + 3600 * 1000 * 24
                } 
                self.ajaxData.currentPage = 1
                self.getData();
            });
            this.bus.$on('search/loaded', function(data){
                self.formData = data; 
                self.getData();
            });
        },
        mounted(){
            this.buttonArr=Permission.button(this.$route.path,this.$router.options.routes)||[];
        }
    }
</script>
<style scope="scope" lang="scss">
.qr-code {
    width:320px;
    height:320px;
    overflow-y: scroll;
    margin:0 auto;
    img{
        width:100%;
        display:block;
    }
}
.audit{
    padding-top:20px;
}
</style>
