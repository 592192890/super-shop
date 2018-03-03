<template>
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
</template>
