<template>
	<div>
		<div class="mod-sort" v-for="items in sortData">
			<div class="sort-inner">
				<h3 class="sort-hd">一级分类</h3>	
				<ul class="sort-bd">
					<li class="txt-overflow" v-for="item,index in items" @click="bindClick($event, index, item)" :class="index==selectedIndex?'selected':''">{{ item.name }}</li>
				</ul>
			</div>
			<i v-if="!hiddenArrow" class="arrow"></i>
		</div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				selectedIndex:-1
			}
		},
		props:['sortData','title', 'hiddenArrow'],
		methods:{
			bindClick(e, index, item){
				this.selectedIndex = index;
				this.$emit('click', e, {index:index, item:item});
			}	
		},
		mounted(){
		}
	}
</script>
<style scope="scope" lang="scss">
	.mod-sort {
		width:25%;	
		float:left;
		position:relative;
		.sort-inner {
			margin-right:30px;
			position:relative;
			.sort-hd {
				height:40px;
				line-height:40px;
				border-radius:2px 2px 0px 0px;
				background:#f3f5f7;
				color:#999999;
				padding-left:20px;
			}
			.sort-bd {
				height:320px;
				overflow:auto;
				border:1px solid #f3f5f7;
				border-top:0px;
				li {
					height:40px;
					line-height:40px;
					border-bottom:1px solid #f3f5f7;
					padding:0 20px;
					&.selected {
						color: #3dc8f6;
					}
					&:hover {
						background: #eee;
					}
				}
			}
		}
		.arrow {
			position:absolute;
			top:10px;
			right:10px;
			&:after {
				font-family: "iconfontcom";
				content:'\e605';
				color:#d5d5d5;
				font-size:14px;
			}
		}
	}
</style>
