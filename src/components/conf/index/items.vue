<template>
	<div v-if="!model.hidden">
		 <template v-if="nonChildren">
			  <el-menu-item :index="path" :key="path" v-if="!model.url" >
				  <i class="iconfontmod" v-html="model.iconCls" v-if="model.iconCls"></i> {{ model.name }}
			  </el-menu-item>
			  <li v-if="model.url" class="el-menu-item" @click="goTo(model.url)">
				  <i class="iconfontmod"  v-html="model.iconCls"  v-if="model.iconCls"></i> {{ model.name }}
			  </li>
		  </template> 
		 <template v-else>
			  <el-submenu :index="path" >
				<template>
					<span slot="title">
						<i class="iconfontmod"  v-html="model.iconCls"  v-if="model.iconCls"></i> {{ model.name }}</span>
				</template>
				<items v-if="model.children" v-for='child in model.children' :model='child' :key="path" :parentItem="model" :parentPath="parentPath" ></items>
			</el-submenu>
		 </template>
	 </div>
 </template>
<script type="text/javascript">
import Vue from 'vue'
    export default {
        name: 'items',
        props: ['model', 'parentItem', 'parentPath'],
        data() {
            return {
            }
        },
        computed: {
			nonChildren(){
				var item = this.model;
				/*var subChildren = '';
				if(item.children && item.children.length ==1){
					subChildren = item.children[0].children;	
					return !(subChildren && subChildren.length!=0);
				}
				return (!item.children || item.children.length==1);	*/
				return !item.children || item.hiddenChildren;
			},
			path(){
				var item = this.model;
				var parentItem = this.parentItem;
				var lastPath = item.path+(item.children?'/'+item.children[0].path:'');
				if(parentItem){
					Vue.set(item, '_path', parentItem._path+'/'+item.path);
					lastPath = parentItem._path+'/'+lastPath;
				}else {
					Vue.set(item, '_path', item.path);
				}
				return this.parentPath+'/'+lastPath;	
			}
        },
        methods: {
					goTo(local){
						location.href=local;	
					}
        }
    }
</script>
