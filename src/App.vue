<template>  
    <div>
        <router-view v-if="isShowRouter"></router-view>
    </div>
    
</template>
<script>
    import Permission from './assets/js/permission-util.js'
    import CustomRouter from './router/custom-router.js' 
    export default {
        data(){
            var Permission = Permission;
            return {
               isShowRouter:false
            }
        },
        methods:{
            generateNewRouter:function(res){
                //动态增加router
                var addRouter=[];
                // addRouter.push(CustomRouter)
                addRouter=CustomRouter;
                

                //根据动态生成的router匹配后端返回的路由
                var newRouter=Permission.router(addRouter,res.data.resources);
                newRouter.unshift({
                    path: '*',
                    redirect: '/404',
                    hidden: true
                })
                this.$router.options.routes=this.$router.options.routes.concat(newRouter)
                this.$router.addRoutes(newRouter)
            },
        },
        mounted(){
            
            //动态增加router
            // if(this.$route.path!='/login'&&this.$route.path!="/"){
                //获得授权的路由
                var params={
                    loop:1,
                    systemCode:"BMP"
                }
                this.$ajax.get(this.$apiUrl.getPermissionRouter,params).then(res=>{
                    if(res.error==0){
                        if(res.data.resources.length==0){
                            this.$message({
                                type:'warning',
                                message:'你没有任何权限！'
                            })
                            return;
                        }
                        //动态生成路由
                        this.generateNewRouter(res);
                    }else{
                        this.$message({
                            type:"error",
                            message:res.msg
                        })
                    }
                    
                    this.isShowRouter=true

                })

            // }
        }
    }
</script>
<style scoped lang="scss">
</style>