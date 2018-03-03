<template>
    <div>
        <el-steps :space="200" :active="1" class="mod-process">
            <el-step title="选择分类"></el-step>
            <el-step title="填写商品详情"></el-step>
            <el-step title="商品发布成功"></el-step>
        </el-steps>
        <div class="mod-species">
            <h3>您当前的选择是:</h3>
            <div class="species-bd">
                <div class="bd-box">
                    <h4>一级分类</h4>
                    <el-tree :data="regions" :props="props" :load="loadNode" lazy show-checkbox>
                    </el-tree>
                </div>
                <div class="bd-box">
                    <h4>二级分类</h4>
                </div>
                <div class="bd-box">
                    <h4>三级分类</h4>
                </div>
                <div class="bd-box">
                    <h4>spu</h4>
                </div>
            </div>
        </div>
        <div class="mod-btn">
            <el-button type="primary">下一步</el-button>
            <el-button type="text">返回</el-button>
        </div>
    </div>
</template>
<script>
    export
    default
    {
        data()
            {
                return {
                    regions: [
                    {
                        'name': 'region1'
                    },
                    {
                        'name': 'region2'
                    }],
                    props:
                    {
                        label: 'name',
                        children: 'zones'
                    },
                    count: 1
                };
            },
            methods:
            {
                loadNode(node, resolve)
                {
					this.$ajax.post('http://t.com/productList/publish', {level:node.level}).then((res)=>{
                         resolve(res.data.classify);
					});

                }
            }
    }
</script>
<style scope="scope" lang="scss">
    .mod-process {
        width: 400px;
        margin: 0 auto;
    }
    .mod-species {
        h4 {
            background: #dfe6ec;
        }
        .species-bd {
            .bd-box {
                float: left;
                width: 170px;
                margin-right: 20px;
            }
        }
    }
    .mod-btn {
        padding: 20px 0;
        clear: both;
    }
</style>
