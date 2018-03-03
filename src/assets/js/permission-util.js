import Vue from 'vue'
var permission={
    button:function(currentPath,routers){
        var result=[];
        for(var i=0;i<routers.length;i++){
            var item=routers[i];
    
            if(currentPath.indexOf(item.path)!=-1&&item.path!='/'){
                var currentPath="/"+currentPath.split('/').slice(2).join('/');
    
                if(item.children){
                    result=this.button(currentPath,item.children)
                }else{
                    
                    result=item.buttonArr;
                }
                
                break;
            }
            
            
        }
        return result;
    },
    // 根据远程路由和本地路由进行匹配出用户被授权的路由
    router:function(localRouter,remoteRouter){
        var newLocalRouter=[];
        remoteRouter && remoteRouter.forEach(v=>{
            for(var i=0;i<localRouter.length;i++){
                var item=localRouter[i];
                if(v.path==item.path){
                    var result={};
                    //判断是否有children
                    if(v.children&&v.children.length&&v.children[0].resourceLevel==0){
                        result.path=item.path;
                        result.name=item.name;
                        result.component=item.component;
                        if(item.iconCls){
                            result.iconCls = item.iconCls;
                        }
                        if(item.redirect){
                            result.redirect = item.redirect;
                        }
                        if(item.hiddenChildren){
                            result.hiddenChildren=item.hiddenChildren;
                        }
                        if(item.meta){
                            result.meta={needHide: true}
                        }
                        result.children=this.router(item.children,v.children);
    
                        newLocalRouter.push(result);
                    }else{
                        result.path=item.path;
                        result.name=item.name;
                        result.component=item.component;
                        result.hidden=item.hidden;
                        if(item.hiddenChildren){
                            result.hiddenChildren=item.hiddenChildren;
                        }
                        if(item.meta){
                            result.meta={needHide: true}
                        }
                        if(v.children&&v.children.length&&v.children[0].resourceLevel!=0){
                            var buttonArr=[];
                            v.children.forEach(vv=>[
                                buttonArr.push(vv.path)
                            ])
                            result.buttonArr=buttonArr;
                        }
                        newLocalRouter.push(result);
                    }
                    
                    break;
                }
                
            }
        })
        return newLocalRouter;
    }
}

export default permission;
