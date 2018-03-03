<template>
    <li class="item-menu" v-if="model.productList && model.productList.length">
        <div class="item-ctn" @click.stop="toggle(model)" >
            <i v-if="isFolder && !open" class="icon iconfontmod">&#xe63c;</i>
            <i v-if="!isFolder || open" class="icon iconfontmod">&#xe63b;</i>
            <div class="item-name item">
                <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="model.goodsName">
                    <div class="reference" slot="reference">{{ model.goodsName }}</div>
                </el-popover>
            </div>
            <div class="code item">{{ model.bn }}</div>
            <!-- <div class="unit item"></div> -->
            <div class="stock item"></div>
            <div class="price item"></div>
            <div class="location item"></div>
            <div class="isweight item">{{ model.catchWeightInd }}</div>
            <div class="statue item"></div>
            <div class="item-relative">
                <div class="item-addsub" @click.stop='onEdit(model)' v-if="buttonArr.indexOf('bt-edit')!=-1">编辑</div>
                <div class="item-addsub" @click.stop='onDelete(model)' v-if="buttonArr.indexOf('bt-delete')!=-1">删除</div>
            </div>
        </div>
        <ul>
            <tree-menu v-for="item in model.productList" :model="item" :isWeight="isWeight" :list="list" :key="item.bn" v-if="model.productList && item.show"></tree-menu>
        </ul>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            size="tiny">
            <span>{{ tips }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteClassify">确 定</el-button>
            </span>
        </el-dialog>
    </li>
    <li class="item-menu" v-else>
        <div class="item-ctn">
            <el-checkbox v-model="model.checked" @change.stop="checkbox($event, model)" class="checkbox"></el-checkbox>
            <div class="item-name item mr" @click.stop='convert(model)'>
                <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="model.specName || model.goodsName">
                    <div class="reference" slot="reference">{{ model.specName || model.goodsName }}</div>
                </el-popover>
            </div>

            <div class="code item">{{ model.bn }}</div>
            <!-- <div class="unit item">{{ model.unit }}</div> -->
            <div class="stock item">{{ model.availableNum }}</div>
            <div class="price item">{{ model.salePrice }}</div>
            <div class="location item">{{ model.location }}</div>
            <div class="isweight item">{{ model.catchWeightInd }}</div>
            <div class="statue item" v-if="model.marketable">已上架</div>
            <div class="statue item" v-else>已下架</div>
            <div class="item-relative">
                <div class="item-addsub" v-bind:class="{ hide: model.productName }" @click.stop='onEdit(model)' v-if="buttonArr.indexOf('bt-edit')!=-1">编辑</div>
                <div class="item-addsub" v-bind:class="{ hide: model.productName }" @click.stop='onDelete(model)' v-if="buttonArr.indexOf('bt-delete')!=-1">删除</div>

                <div class="item-addsub" @click.stop='setVirtualStock(model,"start")' v-if="model.nostoreSell==0&&model.businessTypeCode=='002'&&buttonArr.indexOf('bt-startVirtualSTock')!=-1">开启虚拟库存</div>
                <div class="item-addsub" @click.stop='setVirtualStock(model,"stop")' v-if="model.nostoreSell==1&&model.businessTypeCode=='002'&&buttonArr.indexOf('bt-startVirtualSTock')!=-1">关闭虚拟库存</div>

                <div class="item-addsub" @click.stop='marketable(model, -1)' v-if="model.marketable && buttonArr.indexOf('bt-down')!=-1">下架</div>
                <div class="item-addsub" @click.stop='marketable(model, 1)' v-if="!model.marketable && buttonArr.indexOf('bt-up')!=-1">上架</div>
                <div class="item-addsub" @click.stop='setPrice(model)' v-if="isWeight=='N'&&buttonArr.indexOf('bt-setPrice')!=-1">设定价格</div>
                <div class="item-addsub" @click.stop='setStock(model)' v-if="isWeight=='N'&&buttonArr.indexOf('bt-setStock')!=-1&&((model.businessTypeCode=='002'&&model.nostoreSell==1)||(model.businessTypeCode!='002'))">设定库存</div>

            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            size="tiny">
            <span>{{ tips }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteClassify">确 定</el-button>
            </span>
        </el-dialog>
    </li>
</template>

<script>
import config from '@/config'
import Permission from '@/assets/js/permission-util.js';
export default {
    name: 'treeMenu',
    props: ['model', 'list', 'currentPage','isWeight'],
    data() {
        return {
            dialogVisible: false,
            dialogDelVisible:false,
            tips: "",
            dTips:"",
            btips:"",
            current:{},
            parent:[],
            idArr:[],
            goodsId:0,
            deleteId:0,
            market:[],
            buttonArr:[]
        }
    },
    computed: {
        // 是否有子类
        isFolder: function() {
            return this.model.productList && this.model.productList.length
        },
        // 子类是否展开显示
        open: function(){
            let isopen = false;
            for (let i=0, len=this.model.productList.length; i<len; i++ ){
                if(this.model.productList[i].show){
                    isopen = true
                    break;
                }
            }
            return isopen;
        }
    },
    mounted(){
        this.buttonArr=Permission.button(this.$route.path,this.$router.options.routes);
    },

    methods: {
        convert(row){
            window.location.href=config.productDeatilHTML+row.id+".html";
        },
        // 编辑当前分类
        onEdit(model){
            let goodsId = model.goodsId
            this.$router.push({name:'商品发布编辑',query:{ goodsId: goodsId, currentPage:this.currentPage}});
        },

        onDelete(model){
            this.goodsId = model.goodsId
            this.deleteId = model.id
            this.tips = '您确定要删除吗？'
            this.dialogVisible = true
        },

        // 删除分类
        deleteClassify(){
            this.dialogVisible = false
            this.$ajax.post(this.$apiUrl.deleteCategoryUrl, {goodsId: this.goodsId}).then(res =>{
                if(res.error==0){
                    bus.$emit('updateList',{type:'delete', id:this.deleteId})
                    this.goodsId = 0
                    this.deleteId = 0
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        marketable(model, type){
            let val = type == 1 ? true : false
            this.market.push(model.id)
            this.$ajax.post(this.$apiUrl.getMarketableUrl, {type:type, idArr:JSON.stringify(this.market)}).then(res =>{
                if(res.error==0){
                    this.market = []
                    bus.$emit('updateList',{id:model.id, val:val})
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        _traversalArr(id, arr, mode) {
            for(let i in arr){
                if(arr[i].id == id){
                    if(mode=="delete"){
                        arr.splice(i,1);    //  删除店铺分类
                        this.current = null;
                        break;
                    }else{
                        this.current = arr[i];
                        this.parent = arr;
                    }
                    break;
                }else{
                    this._traversalArr(id, arr[i].productList, mode);
                }
            }
        },

        // 收缩展开
        toggle(model) {
            let id = model.id
            this._traversalArr(id, this.list);
            if(this.current && this.current.productList){
                this.current.productList.forEach((item, index)=>{
                    item.show = !item.show
                })
            }
        },

        // 设定当前价格
        setPrice(model){
            model.type = 'price'
            bus.$emit('setProduct', model)
        },
        //设置虚拟库存
        setVirtualStock(model,type){
          var operateTips="";
          if(type=='start'){
            operateTips='确认开启虚拟库存？'
          }else{
            operateTips='确认关闭虚拟库存？'
          }
          this.$confirm(operateTips, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var url=this.$apiUrl.isStartVirtualStock;
            var params={
              isOpen:type=='start'?true:false,
              productIds:model.id
            }
            this.$ajax.post(url,params).then(res=>{
              if(res.error==0){
                // if(type=='start'){
                //   model.nostoreSell=1;
                //   model.nostoreSellName="开启"
                // }else{
                //   model.nostoreSell=0;
                //   model.nostoreSellName="关闭"
                // }
                bus.$emit('setVirtualStock', '')
                this.$message({
                  type:'success',
                  message:'修改成功！'
                })
              }
            })
          }).catch(() => {

          });
        },
        // 设定当前库存
        setStock(model){
            model.type = 'stock'
            bus.$emit('setProduct', model)
        },



        // 勾选分类
        checkbox(e, model){
            let checked = model.checked
            let id = model.id
            if(!checked){
                bus.$emit('onCheck', checked)
            }
            this._traversalArr(id, this.list);
            if(this.current){
                this.current.checked = checked;
                if(checked){
                    this.addId(this.current)
                }else{
                    this.removeId(this.current)
                }
                // if(this.current.productList){
                //     this.current.productList.forEach(item=>{
                //         item.checked = checked
                //         if(checked){
                //             this.addId(item)
                //         }else{
                //             this.removeId(item)
                //         }
                //     })
                // }
            }
        },

        removeId(obj){
            bus.$emit('idArr', {mode:'remove', item:obj})
        },

        addId(obj){
            bus.$emit('idArr', {mode:'add', item:obj})
        }
    },
}
</script>

<style lang="scss" scoped>

.item-menu{
    width: 100%;
    display: block;
    margin-bottom: 5px;
    .reference{
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .item-ctn{
        width: 100%;
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        margin-bottom: 5px;
        background-color: #fff;
        border-radius: 5px;
        padding: 0 25px 0 30px;
        box-sizing: border-box;
        color: #4e4e4e;
        .hide{
            visibility: hidden;
        }
        &:hover{
            box-shadow:0 0 10px rgba(51, 187, 171, .5);
        }
        .icon{
            float: left;
            width: 20px;
            height: 18px;
            text-align: left;
            font-size: 18px;
            color: #5ca9e1;
            margin-left: 78px;
        }
        .item-name{
            float: left;
            width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .mr{
            margin-left: 0px;
            margin-right: 20px;
        }
        .checkbox{
            float: left;
            margin-right: 60px;
        }
        .item{
            float: left;
            text-align: left;
            color: #333;
            height: 40px;
            line-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 5px;
            box-sizing: border-box;
            &.code{
                width: 110px;
                height: 40px;
                margin-left:0px;
            }
            &.unit{
                width: 74px;
            }
            &.stock{
                width: 92px;
            }
            &.price{
                width: 60px;
            }
            &.location{
                width: 78px;
            }
            &.isweight{
                width: 104px;
            }
            &.statue{
                width: 80px;
            }
        }
        .item-relative{
            width: 304px;
            float: left;
            text-align: left;
            .item-addsub{
                float: left;
                text-align: left;
                color: #3dc8f6;
                cursor:pointer;
                margin-right: 4px;
                font-size: 14px;
                &.hide{
                    visibility: hidden;
                }
            }
        }
    }
    ul{
        li{
            .item-ctn{
                background:#f4fcff;
                .mr{
                    margin-left: 0px;
                    width: 85px;
                    margin-right: 15px;
                }
                .checkbox{
                    margin-right: 80px
                }
            }
        }
    }
}

</style>

