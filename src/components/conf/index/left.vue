<template>
 <el-menu :default-active="acitiveMenu" class="el-menu-wrap" :collapse="collapsed" unique-opened router>
	 <items  :model='item' v-if="!item.hidden" v-for='item in routes' :key="item.path" :parentPath="parentPath" ></items>
</el-menu>
</template>
<script>
import items from './items.vue';
export default
{
	data(){
		return {
			collapsed:false,
			parentPath:'/'+location.pathname.split('/')[1],
			rootRoutes:this.getRootRoutes(),
			acitiveMenu:'',
		}
	},
	computed: {
		routes(){
			return this.rootRoutes[this.parentPath].children||[];
		}
	},
	props:['bus'],
	components:{items},
	methods:{
		getRootRoutes(){
			let obj = {};
			this.$router.options.routes.forEach(function(item){
				obj[item.path] = item;	
			});
			return obj;
		},
		actived(){
			var route = this.$route.path;
			var ar = [];
			if(route.indexOf('/')>-1 && route.indexOf('@')>-1){
				route = route.split('/');	
				for(var i=0;i<route.length;i++){
					if(route[i].indexOf('@')>-1){
						break;
					}else{
						ar.push(route[i]);	
					}		
				}
				ar.push('list');
				return ar.join('/');
			}
			return this.$route.path;
		}
	},
	mounted(){
		let self = this;
		this.acitiveMenu=this.actived()
		this.bus.$on('hd/navClick', function(obj){
			self.parentPath = obj.parentPath;
		});	
	},
	watch:{
        $route(){
            var self = this
            setTimeout(function(){
            	self.acitiveMenu=self.actived()
            },0)
        }
    }
}
</script>
<style>
	.el-menu-wrap.el-menu{
		overflow-y:auto;
		overflow-x:hidden;
	}
</style>
