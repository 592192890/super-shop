<template>
    <div class="search">
        <section class="header">
            <el-row :span="24" class="mod-toolbar">
                <el-col :span="2">
                    <div class="label">消费门店：</div>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="form.shopMdCode">
                        <el-option v-for="item, index in select.store" :key="item.value" :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" :offset="1" style="width:120px">
                    <div class="label">用户手机号码：</div>
                </el-col>
                <el-col :span="3">
                     <el-input v-model="form.mobile" placeholder="请输入手机号码"></el-input>
                </el-col>
                <el-col :span="2" :offset="1" style="width:60px">
                    <div class="label">状态：</div>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="form.status">
                        <el-option v-for="item, index in select.status" :key="item.code" :label="item.description"
                        :value="item.code">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-button type="primary" @click="onSubmit">搜索</el-button>
                </el-col>
            </el-row>
            <el-row :span="24" class="mod-toolbar" :gutter="5">
                <el-col :span="2">
                    <div class="label">消费时间：</div>
                </el-col>
                <el-col :span="3">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.startConsumeTime" style="width: 100%;" ></el-date-picker>
                </el-col>
                <div style="float:left; height:36px;line-height:36px; padding:0 20px">至</div>
                <el-col :span="3">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.endConsumeTime" :picker-options="endConsumeOptions" style="width: 100%;"></el-date-picker>
                </el-col>

                <el-col :span="2" :offset="1">
                    <div class="label">积分时间：</div>
                </el-col>
                <el-col :span="3">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.startIntegralTime" style="width: 100%;"
                    ></el-date-picker>
                </el-col>
                <div style="float:left; height:36px;line-height:36px; padding:0 20px">至</div>
                <el-col :span="3">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.endIntegralTime" :picker-options="endIntegraOptions" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-row>
        </section>
    </div>
</template>
<script>
	import Permission from '@/assets/js/permission-util.js';
	export default {
		props:['bus'],
		data(){
			let self = this;
			return {
				buttonArr:[],
				select:{
                    store:[],
					status:[]
				},
				form:{
                    shopMdCode:'',
                    mobile:'',
                    status:'',
                    startConsumeTime: '',
                    endConsumeTime:'',
					startIntegralTime:'',
					endIntegralTime:'',
				},
                endConsumeOptions: {
                    disabledDate(time) {
                        return (time.getTime() < self.form.startConsumeTime);
                    }
                },
				endIntegraOptions: {
					disabledDate(time) {
                        return (time.getTime() < self.form.startIntegralTime);
                    }
				}
			}
		},
		methods: {
			onSubmit(){
				if(/^1[3|4|5|8][0-9]\d{8}$/.test(this.form.mobile)|| this.form.mobile==''){
                    this.form.startConsumeTime = Date.parse(new Date(this.form.startConsumeTime))||''
                    this.form.endConsumeTime = Date.parse(new Date(this.form.endConsumeTime))||''
                    this.form.startIntegralTime = Date.parse(new Date(this.form.startIntegralTime))||''
                    this.form.endIntegralTime = Date.parse(new Date(this.form.endIntegralTime))||''
                    this.bus.$emit('index/search',this.form);				
				}else{
                    this.$message({
                        message: '请输入正确的电话号码',
                        type: 'error'
                    });
                }
                
			}
		},
		mounted(){
			this.buttonArr=Permission.button(this.$route.path,this.$router.options.routes)||[];
			this.bus.$emit('search/loaded', this.form);
            this.$ajax.get(this.$apiUrl.getInteralStoreListUrl,{type:'offline'}).then(res=>{
                let arr = res.data
                let opts = []
                if(!arr || !arr.length) return
                arr.forEach(function(v,i){
                    let obj = {}
                    obj.label =v.shopName
                    obj.value =v.shopMdCode
                    opts.push(obj)
                })
                opts.unshift({label: '请选择消费门店',value:''})
                this.select.store=[].concat(opts)
            });

            this.$ajax.get(this.$apiUrl.getInteralStatusUrl).then(res=>{
                let arr = res.data
                if(!arr || !arr.length) return
                arr.unshift({description: '请选择状态',code:''})
                this.select.status=[].concat(arr)
            });

		}
	}
</script>
<style scope="scope" lang="scss">
.search {
    background: #fff;
    border-radius: 4px;
    padding: 10px 20px;
    .label{
        height:36px;
        line-height:36px;
        font-size:14px;
    }      
}
</style>