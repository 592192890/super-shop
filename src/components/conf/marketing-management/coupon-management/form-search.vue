<template>
	<el-form :inline="true" :model="formInline" class="demo-form-inline" :label-position="labelPosition">
	<!-- <el-row type="flex" justify="end" class="add-new">
		<el-col :span="3" v-if="addNewName">
			<el-button type="info" size="large" @click="onSearch">{{addNewName}}</el-button>
		</el-col>
	</el-row> -->
	<el-row :gutter="20">
        <!-- 表单1.1 -->
		<el-col :span="6" v-if="typle.typle1">
			<el-form-item :label="lableName.name1" v-if="typle.typle1 == 'input'">
				<el-input v-model="formInline.value1" :placeholder="placeholderName.name1"></el-input>
			</el-form-item>
            <el-form-item :label="lableName.name1" v-if="typle.typle1 == 'select'">
				<el-select v-model="formInline.value1" :placeholder="placeholderName.name1">
				<el-option v-for="(option,index) in options.option1" :label="option" :value="index" :key="option[0]"></el-option>	
				</el-select>
			</el-form-item>
		</el-col>
        <!-- 表单1.2 -->
		<el-col :span="6" v-if="typle.typle2">
			<el-form-item :label="lableName.name2" v-if="typle.typle2 == 'select'">
				<el-select v-model="formInline.value2" :placeholder="placeholderName.name2">
				<el-option v-for="(option,index) in options.option2" :label="option" :value="index" :key="option[0]"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="lableName.name2" v-if="typle.typle2 == 'input'">
				<el-input v-model="formInline.value2" :placeholder="placeholderName.name2"></el-input>
			</el-form-item>
		</el-col>
        <!-- 表单1.3 -->
		<el-col :span="6" v-if="typle.typle3">
			<el-form-item :label="lableName.name3" v-if="typle.typle3 == 'select'">
				<el-select v-model="formInline.value3" :placeholder="placeholderName.name3">
				<el-option v-for="(option,index) in options.option3" :label="option" :value="index" :key="option[0]"></el-option>
				</el-select>
			</el-form-item>
            <el-form-item :label="lableName.name3" v-if="typle.typle3 == 'input'">
				<el-input v-model="formInline.value3" :placeholder="placeholderName.name3"></el-input>
			</el-form-item>
		</el-col>
        <!-- 表单1.4 -->
		<el-col :span="6" v-if="typle.typle4">
			<el-form-item :label="lableName.name4" v-if="typle.typle4 == 'select'">
				<el-select v-model="formInline.value4" :placeholder="placeholderName.name4">
				<el-option v-for="(option,index) in options.option4" :label="option" :value="index" :key="option[0]"></el-option>
				</el-select>
			</el-form-item>
            <el-form-item :label="lableName.name4" v-if="typle.typle4 == 'input'">
				<el-input v-model="formInline.value4" :placeholder="placeholderName.name4"></el-input>
			</el-form-item>
		</el-col>
	</el-row>
	<el-row :gutter="20">
        <!-- 表单2.1 -->
		<el-col :span="6" v-if="typle.typle5">
			<el-form-item :label="lableName.name5" v-if="typle.typle5 == 'input'">
				<el-input v-model="formInline.value5" :placeholder="placeholderName.name5"></el-input>
			</el-form-item>
            <el-form-item :label="lableName.name5" v-if="typle.typle5 == 'select'">
				<el-select v-model="formInline.value5" :placeholder="placeholderName.name5">
				<el-option v-for="(option,index) in options.option5" :label="option" :value="index" :key="option[0]"></el-option>
				</el-select>
			</el-form-item>
		</el-col>
        <!-- 表单2.2 -->
		<el-col :span="8" v-if="lableName.name6">
			<el-form-item :label="lableName.name6">
				<el-col :span="11">
				<el-date-picker type="date" placeholder="请选择" v-model="formDate.date1" style="width: 100%;"></el-date-picker>
				</el-col>
				<el-col class="line" :span="2">-</el-col>
				<el-col :span="11">
				<el-date-picker type="date" placeholder="请选择" v-model="formDate.date2" style="width: 100%;"></el-date-picker>
				</el-col>
			</el-form-item>
		</el-col>
        <!-- 表单2.3 -->
		<el-col :span="8" v-if="lableName.name7">
			<el-form-item :label="lableName.name7">
				<el-col :span="11">
				<el-date-picker type="date" placeholder="请选择" v-model="formDate.date3" style="width: 100%;"></el-date-picker>
				</el-col>
				<el-col class="line" :span="2">-</el-col>
				<el-col :span="11">
				<el-date-picker type="date" placeholder="请选择" v-model="formDate.date4" style="width: 100%;"></el-date-picker>
				</el-col>
			</el-form-item>
		</el-col>
        <!-- 表单2.4 -->
        <el-col :span="4" v-if="lableName.name8">
			<el-form-item :label="lableName.name8" v-if="typle.typle8 == 'input'">
				<el-input v-model="formInline.value8" :placeholder="placeholderName.name8"></el-input>
			</el-form-item>
            <el-form-item :label="lableName.name8" v-if="typle.typle8 == 'select'">
				<el-select v-model="formInline.value8" :placeholder="placeholderName.name8">
				<el-option label="百货" value="shanghai"></el-option>
				<el-option label="超市" value="beijing"></el-option>
				<el-option label="电器" value="beijing"></el-option>
				<el-option label="置业" value="beijing"></el-option>
				<el-option label="便利" value="beijing"></el-option>
				<el-option label="珠宝" value="beijing"></el-option>
				</el-select>
			</el-form-item>
		</el-col>
        <!-- 表单2.5 -->
        <el-col :span="4" v-if="lableName.name9">
			<el-form-item :label="lableName.name9" v-if="typle.typle9 == 'input'">
				<el-input v-model="formInline.value9" :placeholder="placeholderName.name9"></el-input>
			</el-form-item>
            <el-form-item :label="lableName.name9" v-if="typle.typle9 == 'select'">
				<el-select v-model="formInline.value9" :placeholder="placeholderName.name5">
				<el-option label="百货" value="shanghai"></el-option>
				<el-option label="超市" value="beijing"></el-option>
				<el-option label="电器" value="beijing"></el-option>
				<el-option label="置业" value="beijing"></el-option>
				<el-option label="便利" value="beijing"></el-option>
				<el-option label="珠宝" value="beijing"></el-option>
				</el-select>
			</el-form-item>
		</el-col>
		<el-col class="btn-area">
			<el-form-item class="add-btn" v-if="addNewName">
				<el-button class="add" size="large" @click="linkToAdd">{{addNewName}}</el-button>
			</el-form-item>
			<el-form-item class="search-btn">
				<el-button type="primary" size="large" @click="onSearch">搜索</el-button>
			</el-form-item>
		</el-col>
	</el-row>
	</el-form>
</template>
<script>
export default {
    data() {
      return {
        formInline: {
          value1: '',
		  value2: '',
		  value3: '',
		  value4: '',
		  value5: '',
		//   value6: '',
		//   value7: '',
		  value8: '',
		  value9: '',
		},
		formDate:{
			date1:"",
			date2:"",
			date3:"",
			date4:""
		},
		lableName:"",
		placeholderName:"",
        typle:"",
        labelPosition:"top"
	  }
	},
	mounted(){
		this.lableName = this.$store.state.formSearch.lableName;
		this.placeholderName = this.$store.state.formSearch.placeholderName;
		this.typle = this.$store.state.formSearch.typle;
		this.options = this.$store.state.formSearch.options;
        
	},
	computed:{
		addNewName(){
			return this.$store.state.formSearch.addNewName
		},
	},
    methods: {
        onSearch() {
			var self = this;
			//对象键名需要根据rap定义做修改
			var objFormInline = this.formInline,
				objFormDate = this.formDate;
	
			//对象合并
			var param = Object.assign(objFormInline, objFormDate);

			self.$ajax.post('http://t.com/marketing-management/coupon-management',
					param
					).then((res) =>
					{
						console.log("res suc!");
					}).catch((res)=>{
						console.log("res erro!");
					});
		},
		linkToAdd(){
			var self = this;
			switch(self.addNewName){
				case "新增优惠券":
					self.$router.push({name:'新增优惠券定义'});
					break;
				case "新增用券规则":
					self.$router.push({name:'用券规则配置'});
					break;
				case "新增发券活动":
					self.$router.push({name:'发券活动配置'});
					break;
			}
		}
    }
}
</script>
<style lang="scss" scoped>
.el-form{
	background-color: #fff;
	padding: 20px 20px 0;
}
.add-new{
	height:100px;
	line-height: 100px;
}
// .search-btn{
//     position: absolute;
//     right:140px;
//     bottom:0;
// }
.btn-area{
    position: absolute;
	display: inline-block;
	width: auto;
	z-index: 0;
    right:0;
    bottom:0;
	.search-btn{
		float: right;
	}
	.add-btn{
		float: right;
		.add{
			background-color: #52cfaa;
			color:#fff;
			border-color: #fff;
			&:hover,&:active{
				opacity: .8;
			}
		}
	}
}
</style>


