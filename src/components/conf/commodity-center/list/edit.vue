<template>
    <div class="sku">
       <el-form :rules="rules" ref="ruleForm" :model="formEntity" label-width="80px">
            <section style="margin-top:20px">
                <div class="basic-info mod-toolbar">
                    <el-row>
                        <h1 class="header">基本信息</h1>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="4">
                            <div class="label require-label">商品分类</div>
                        </el-col>
                        <el-col :span="20" class="select-type">
                            <div class="item">{{cateStr}}</div>

                        </el-col>
                    </el-row>

                    <el-row :gutter="40">
                        <el-col :span="4">
                            <div class="label require-label">商品名称</div>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item prop="goodsName">
                                <el-input v-model="formEntity.goodsName" placeholder="长度至少为2个字符，最长50个字符" :disabled="isFromRetek||isHasSpuId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="tips">长度至少为2个字符，最长50个字符</el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="4">
                            <div class="label">广告词</div>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item prop="goodsAd">
                                <el-input v-model="formEntity.goodsAd" placeholder="长度至少为2个字符，最长50个字符"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="tips">长度至少为2个字符，最长50个字符</el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="4">
                            <div class="label require-label">商品编码</div>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item prop="bn">
                                <el-input v-model="formEntity.bn" @change="changeSpuBn" placeholder="2-50个数字或字母" :disabled="isFromRetek||isHasSpuId"></el-input>
                                <div v-if="customErrorSpuBn" class="el-form-item__error">商品编码已经存在，请换一个！</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" class="tips">2-50个数字或字母</el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="4">
                            <div class="label">商品关键词</div>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item>
                                <el-input v-model="formEntity.keywords" placeholder="多个关键字，使用半角竖线‘|’分开"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" class="tips">仅用于前台、后台筛选商品，多个关键字，使用半角竖线‘|’分开</el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="4">
                            <div class="label require-label">品牌</div>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item>
                                <el-select v-model="formEntity.brandId" :disabled="isFromRetek||isHasSpuId" filterable placeholder="请选择">

                                    <el-option v-for="item in brandList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="4">
                            <div class="label require-label">是否称重商品</div>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="catchWeightInd">
                                <el-select v-model="formEntity.catchWeightInd" placeholder="请选择" @change="changeIsWeight" :disabled="isHasSpuId||isFromRetek">
                                    <el-option label="称重商品" value="Y"></el-option>
                                    <el-option label="非称重商品" value="N"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="4">
                            <div class="label">国家</div>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item>
                                <el-select v-model="formEntity.countryId" filterable placeholder="请选择">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option v-for="item in countryList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>

                    <el-row :gutter="40">
                        <el-col :span="4">
                            <div class="label require-label">计量单位</div>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item prop="unit">
                                <el-input v-model="formEntity.unit" :disabled="isFromRetek||isHasSpuId"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>

                    <el-row :gutter="40">
                        <el-col :span="4">
                            <div class="label">商品简介</div>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item prop="brief">
                                <el-input type="textarea" v-model="formEntity.brief"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="4">
                            <div class="label">库位</div>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item prop="location">
                                <el-input  v-model="formEntity.location"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </div>
            </section>

            <section>
                <div class="spec-info mod-toolbar">
                    <el-row>
                        <h1 class="header">规格信息</h1>
                    </el-row>
                    <el-row class="spec-item">
                        <el-col :span="4">
                            <div class="label require-label">无规格</div>
                        </el-col>
                        <el-col :span="20" style="height:40px;line-height:40px">
                            <el-checkbox label="无规格" v-model="selectNoSpecRadio" @change="changeNoSpecRadio" :disabled="((isHasSpuId||isFromRetek)&&!isHasSpecDefault)||isHasSpec&&formEntity.catchWeightInd=='Y'">
                            </el-checkbox>
                        </el-col>
                        <!-- <div v-bind:class="{cover:isHasSpuId||isHasSpec}"></div> -->
                        <div v-bind:class="{cover:isHasSpuId||isFromRetek}"></div>
                    </el-row>
                    <el-row v-for="item in specArr" :key="item.id" class="spec-item">
                        <el-col :span="4">
                            <div class="label require-label">{{item.name}}</div>
                        </el-col>
                        <el-col :span="20" class="checkbox-group">
                            <el-checkbox-group v-model="item.checked">
                                <section v-for="it in item.values" :key="it.id">
                                    <el-checkbox :label="it.name" :key="it.id">
                                    </el-checkbox>
                                    <a style="color:#3dc8f6" @click="deleteSpec(it,item)" v-if="it.shopId">删除</a>
                                </section>

                            </el-checkbox-group>
                            <el-col :span="4">
                                <el-input placeholder="新增规格值" v-model="item.addedSpecName" class="add-sepc-input">
                                    <template slot="append">
                                        <img src="../../../../assets/images/conf/commodity-center/add-spec.png" @click="addSpec(item)"></img>
                                    </template>
                                </el-input>
                            </el-col>
                        </el-col>
                        <div v-bind:class="{cover:isHasSpuId||isFromRetek||selectNoSpecRadio}"></div>
                    </el-row>

                    <el-row v-if="!selectNoSpecRadio&&isHasSpec&&(!isHasSpuId&&!isFromRetek)">
                        <el-col :span="6" :offset="4">
                            <el-button class="spec-btn" @click="generateSpec">生成规格</el-button>
                        </el-col>

                    </el-row>
                    <!--非称重商品表单模板-->
                    <el-row v-if="specEntity.length>0&&formEntity.catchWeightInd!='Y'">
                        <el-col :span="24">
                            <table class="custom-table">
                                <tr>
                                    <th>
                                        <el-col class="cell" :span="2">规格名称</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">货品名称</el-col>
                                    </th>
                                    <th>
                                        <el-tooltip class="item" effect="light" content="商品的唯一编号，必须按照商品实际信息准确填写；若商品由系统导入，则系统自动读取条码，无需填写。" placement="top">
                                            <el-col class="cell" :span="2">货号</el-col>
                                        </el-tooltip>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">重量(g)</el-col>
                                    </th>
                                    <th>
                                        <el-tooltip class="item" effect="light" content="商品的唯一编号，必须按照商品实际信息准确填写；若商品由系统导入，则系统自动读取条码，无需填写。" placement="top">
                                            <el-col class="cell" :span="2">条形码</el-col>
                                        </el-tooltip>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">成本价</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">市场价</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">销售价</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">库存</el-col>
                                    </th>
                                    <!-- <th>
                                        <el-col class="cell" :span="2">库位</el-col>
                                    </th> -->
                                </tr>
                                <tr v-for="(item,index) in specEntity" :key="item.specName">
                                    <td>
                                        <div class="cell" :span="2">
                                            <span style="margin-top:8px;display:inline-block">{{item.specName}}</span>
                                        </div>

                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.productName" @change="validateSpec(item,'productName')" v-bind:class="{error:item.isError_productName}" :disabled="isFromRetek||isHasSpuId"></el-input>

                                        </div>
                                        <div :span="2" v-if="item.isError_productName" class="validate-error">
                                            <span>2-50个字符</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.bn" v-bind:class="{error:item.isError_bn||item.isExist_bn||item.isDulplicate_bn}" @change="validateSpec(item,'bn',index)" :disabled="isFromRetek||isHasSpuId"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_bn" class="validate-error">
                                            <span>2-50个字符</span>
                                        </div>
                                        <div :span="2" v-if="item.isExist_bn" class="validate-error">
                                            <span>该货号存在于数据库</span>
                                        </div>
                                        <div :span="2" v-if="item.isDulplicate_bn&&!item.isExist_bn" class="validate-error">
                                            <span>和已填货号重复</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.weight" v-bind:class="{error:item.isError_weight}" @change="validateSpec(item,'weight')" :disabled="isFromRetek||isHasSpuId"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_weight" class="validate-error">
                                            <span>必填1-10个字符的正整数</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.barCode" v-bind:class="{error:item.isError_barCode||item.isExist_barCode||item.isDulplicate_barCode}" @change="validateSpec(item,'barCode',index)" :disabled="isFromRetek||isHasSpuId"></el-input>
                                        </div>

                                        <div :span="3" v-show="item.isError_barCode" class="validate-error">
                                            <span>1-20个数字字母</span>
                                        </div>
                                        <div :span="3" v-show="item.isExist_barCode" class="validate-error">
                                            <span>该条形码存在于数据库</span>
                                        </div>
                                        <div :span="3" v-show="item.isDulplicate_barCode&&!item.isExist_barCode" class="validate-error">
                                            <span>和已填条形码重复</span>
                                        </div>

                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.cost" v-bind:class="{error:item.isError_cost}" @change="validateSpec(item,'cost')" :disabled="isFromRetek||isHasSpuId"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_cost" class="validate-error">
                                            <span>最多两位小数,整数位最多7个字符的非负数，且小于销售价</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.mktPrice" v-bind:class="{error:item.isError_mktPrice}"  @change="validateSpec(item,'mktPrice')" :disabled="isFromRetek||isHasSpuId"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_mktPrice" class="validate-error">
                                            <span>最多两位小数,整数位最多7个字符的非负数</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.salePrice" v-bind:class="{error:item.isError_salePrice}"  @change="validateSpec(item,'salePrice')"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_salePrice" class="validate-error">
                                            <span>最多两位小数,整数位最多7个字符的非负数，且大于成本价</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.storeCount" v-bind:class="{error:item.isError_storeCount}"  @change="validateSpec(item,'storeCount')" :disabled="item.nostoreSell==0&&item.businessTypeCode=='002'"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_storeCount" class="validate-error">
                                            <span>必填1-20个字符的非负整数或0</span>
                                        </div>
                                    </td>
                                    <!-- <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.location" v-bind:class="{error:item.isError_location}"  @change="validateSpec(item,'location')" :disabled="isFromRetek"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_location" class="validate-error">
                                            <span>必须2-50个字符</span>
                                        </div>
                                    </td> -->
                                </tr>
                            </table>
                        </el-col>
                    </el-row>
                    <!--称重商品表单模板-->
                    <el-row v-if="specEntity.length>0&&formEntity.catchWeightInd=='Y'">
                        <el-col :span="24">
                            <table class="custom-table">
                                <tr>
                                    <th>
                                        <el-col class="cell" :span="2">规格名称</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">货品名称</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">货号</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">商品预设重量(g)</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">条形码</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">成本单价<br>( 元/kg )</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">市场单价<br>( 元/kg )</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">销售单价<br>( 元/kg )</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">销售价(元)</el-col>
                                    </th>
                                    <th>
                                        <el-col class="cell" :span="2">商品库存总重量(g)</el-col>
                                    </th>
                                </tr>
                                <tr v-for="(item, index) in specEntity" :key="item.specName">
                                    <td>
                                        <div class="cell" :span="2">
                                            <span style="margin-top:8px;display:inline-block">{{item.specName}}</span>
                                        </div>

                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.productName" @change="validateSpec(item,'productName')" v-bind:class="{error:item.isError_productName}" :disabled="isFromRetek||isHasSpuId"></el-input>

                                        </div>
                                        <div :span="2" v-if="item.isError_productName" class="validate-error">
                                            <span>2-50个字符</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-tooltip class="item" effect="light" content="唯一编号，必须按照商品实际信息准确填写；若商品由系统导入，则系统自动读取条码，无需填写。" placement="top">
                                                <el-input v-model="item.bn" v-bind:class="{error:item.isError_bn||item.isExist_bn||item.isDulplicate_bn}" @change="validateSpec(item,'bn',index)" :disabled="isFromRetek||isHasSpuId"></el-input>
                                            </el-tooltip>
                                        </div>
                                        <div :span="2" v-if="item.isError_bn" class="validate-error">
                                            <span>2-50个数字和字母</span>
                                        </div>
                                        <div :span="2" v-if="item.isExist_bn" class="validate-error">
                                            <span>该货号存在于数据库</span>
                                        </div>
                                        <div :span="2" v-if="item.isDulplicate_bn&&!item.isExist_bn" class="validate-error">
                                            <span>和已填货号重复</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.weight" v-bind:class="{error:item.isError_weight}" @change="validateSpec(item,'weight')"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_weight" class="validate-error">
                                            <span>必填1-10个字符的正整数，不大于库存总重量</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-tooltip class="item" effect="light" content="商品的唯一编号，必须按照商品实际信息准确填写；若商品由系统导入，则系统自动读取条码，无需填写。" placement="top">
                                                <el-input v-model="item.barCode" v-bind:class="{error:item.isError_barCode||item.isExist_barCode||item.isDulplicate_barCode}" @change="validateSpec(item,'barCode',index)" :disabled="isFromRetek||isHasSpuId"></el-input>
                                            </el-tooltip>
                                        </div>

                                        <div :span="3" v-show="item.isError_barCode" class="validate-error">
                                            <span>1-20个数字字母</span>
                                        </div>
                                        <div :span="3" v-show="item.isExist_barCode" class="validate-error">
                                            <span>该条形码存在于数据库</span>
                                        </div>
                                        <div :span="3" v-show="item.isDulplicate_barCode&&!item.isExist_barCode" class="validate-error">
                                            <span>和已填条形码重复</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.cost" v-bind:class="{error:item.isError_cost}" @change="validateSpec(item,'cost')" :disabled="isFromRetek||isHasSpuId"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_cost" class="validate-error">
                                            <span>最多两位小数，整数位最多7个字符的非负数,小于销售单价</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.mktPrice" v-bind:class="{error:item.isError_mktPrice}"  @change="validateSpec(item,'mktPrice')" :disabled="isFromRetek||isHasSpuId"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_mktPrice" class="validate-error">
                                            <span>最多两位小数,整数位最多7个字符的非负数</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.salePrice" v-bind:class="{error:item.isError_salePrice}"  @change="validateSpec(item,'salePrice')"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_salePrice" class="validate-error">
                                            <span>最多两位小数,整数位最多7个字符的非负数,大于成本单价</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <span style="margin-top:8px;display:inline-block">{{(item.salePrice&&item.weight&&!item.isError_salePrice&&!item.isError_weight)?parseFloat(item.salePrice*item.weight/1000).toFixed(2):''}}</span>
                                        </div>

                                    </td>
                                    <td>
                                        <div class="cell" :span="2">
                                            <el-input v-model="item.storeCount" v-bind:class="{error:item.isError_storeCount}"  @change="validateSpec(item,'storeCount')" :disabled="item.nostoreSell==0&&item.businessTypeCode=='002'"></el-input>
                                        </div>
                                        <div :span="2" v-if="item.isError_storeCount" class="validate-error">
                                            <span>必填1-20个字符的整数,不小于预设重量</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </el-col>
                    </el-row>
                </div>
            </section>
            <section>
                <div class="pic-info mod-toolbar">
                    <el-row>
                        <h1 class="header">图片信息</h1>
                    </el-row>
                    <el-row v-if="isClickGenerateNoSpecButton">
                        <el-col :span="4">
                            <div class="require-pic-label require-label">商品图片</div>
                        </el-col>
                        <el-col :span="3" v-for="item in productPicArr" :key="item.imageId" style="width:100px;position:relative;text-align:center">
                            <img :src="item.imageUrl" />
                            <div class="delete-btn" style="position:absolute">
                                <div class="wrap" @click="deleteProductPic(item)">
                                    <i class="el-icon-delete"></i>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="3" style="text-align:center;width:100px" v-if="productPicArr.length<6">
                            <img @click="showProductPicDialog" src="../../../../assets/images/upload.png"></img>
                        </el-col>

                    </el-row>
                    <el-row v-if="!isClickGenerateNoSpecButton" v-for="(item,index) in specPicArr" :key="item.specName">
                        <el-col :span="4">
                            <div class="require-pic-label require-label">{{item.specName}}</div>
                        </el-col>
                        <el-col :span="3" v-for="it in specPicArr[index].imageIds" :key="it.imageId" style="width:100px;position:relative;text-align:center">
                            <img :src="it.imageUrl" />
                            <div class="delete-btn" style="position:absolute">
                                <div class="wrap" @click="deleteSpecPic(it,index)">
                                    <i class="el-icon-delete"></i>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="3" style="text-align:center;width:100px" v-if="specPicArr[index].imageIds.length<6">
                            <img @click="showSpecPicDialog(index)" src="../../../../assets/images/upload.png"></img>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20" :offset="4">
                            <p class="pic-label">上传商品默认主图，如多规格值时将默认使用该图或分规格上传各规格主图；</p>
                            <p class="pic-label">支持jpg、gif、png格式上传或从图片空间中选择</p>
                            <p class="pic-label">建议使用尺寸800x800像素以上、大小不超过1M的正方形图片，上传后的图片将会自动保存在图片空间的默认分类中。</p>
                        </el-col>
                    </el-row>
                </div>
            </section>
            <section v-if="customAttributes.length">
                <div class="expand-info mod-toolbar">
                    <el-row>
                        <h1 class="header">扩展属性</h1>
                    </el-row>
                    <el-row v-for="item in customAttributes" :key="item.id">
                        <el-col :span="4">
                            <div class="label">{{item.name}}</div>
                        </el-col>
                        <el-col :span="6">
                            <el-input v-model="item.value" @change="changeCustomeSelect(item)"></el-input>
                        </el-col>
                    </el-row>
                    <el-row v-for="item in unCustomAttributes" :key="item.id">
                        <el-col :span="4">
                            <div class="label">{{item.name}}</div>
                        </el-col>
                        <el-col :span="6">
                            <el-select v-model="item.selected" placeholder="请选择" @change="changeUnCustomeSelect(item,item.selected)">
                                <el-option label="请选择" value="" v-if="item.values&&item.values.length"></el-option>
                                <el-option v-for="it in item.values" :label="it.name" :value="it.id" :key="it.id"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </div>
            </section>
            <section v-if="detailparams.length">
                <div class="detail-info mod-toolbar">
                    <el-row>
                        <h1 class="header">详细参数</h1>
                    </el-row>
                    <div v-for="item in detailparams">

                        <div style="display:table-cell;vertical-align:middle">
                            <el-col :span="4">{{item.name}}</el-col>
                        </div>

                        <div style="display:table-cell;">
                            <el-row style="height:40px" :span="24">
                                <el-col :span="3">
                                    <div class="label header">参数名称</div>
                                </el-col>
                                <el-col :span="10">
                                    <div class="label header">值</div>
                                </el-col>
                            </el-row>
                            <el-row style="height:40px" v-for="it in item.list" :key="it.id">
                                <el-col :span="3">
                                    <div class="label"  style="text-align:center;border-left:1px solid #f3f5f7">{{it.name}}</div>
                                </el-col>
                                <el-col :span="10">
                                    <el-input v-model="it.value"></el-input>
                                </el-col>

                            </el-row>

                        </div>
                    </div>

                </div>
            </section>
            <section>
                <div class="spec-info mod-toolbar">
                    <el-row>
                        <h1 class="header">商品详细信息</h1>
                    </el-row>
                    <el-row>
                        <el-col :span="20" :offset="4">
                            <custom-quill-editor v-if="isShowRichTextEditor" :defaultContent="formEntity.pcGoodsInfo" id="pcGoodsInfoId" v-on:passTextContent="getRichTextGoodsInfo">
                            </custom-quill-editor>
                        </el-col>
                    </el-row>


                </div>
            </section>
            <section v-if="tablabels.length">
                <div class="spec-info mod-toolbar" v-for="(item,index) in tablabels" :key="item.id">
                    <el-row>
                        <h1 class="header">{{item.name}}</h1>
                    </el-row>
                    <el-row>
                        <el-col :span="20" :offset="4">
                            <custom-quill-editor v-if="isShowRichTextEditor" :defaultContent="item.tabContent" :id="'tab'+item.id" v-on:passTextContent="getRichTextTabContent">
                            </custom-quill-editor>
                        </el-col>
                    </el-row>
                </div>
            </section>
            <section>
                <div class="bg-group">
                    <el-row>
                        <el-col :span="10" :offset="4">
                            <el-button class="btn-submit" @click="goSave('ruleForm')">提交</el-button>
                            <el-button @click="goBack">返回</el-button>
                        </el-col>
                    </el-row>
                </div>
            </section>

        </el-form>
        <upload-file-dialog v-on:watchDialog="closeUploadDialog" v-on:passSelectedPicUrl="getSelectedPicuUrl" :isShow="isShowUploadDialog"></upload-file-dialog>
        <el-dialog class="error-tips-dialog"
            title="提示"
            :visible.sync="deleteSpecDialogVisible"
            size="tiny">
            <span>确认删除？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="deleteSpecDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="comfirmDeleteSpec" class="confirm-btn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Util from '../../../../assets/js/util'

import uploadFileDialog from '@/components/common/packageDialog/uploadPicDialog'
import customQuillEditor from '@/components/common/Quilleditor'
var itObj;
var itemObj;
var timer;
var barCodeTimer;
var bnTimer;
export default {
    components:{
        uploadFileDialog,
        customQuillEditor
    },
    data(){
        var isLocation=(rule, value, callback) => {
            if(!value){
                return callback();
            }
            if (!/^.{2,50}$/.test(value)) {

                return callback(new Error('2-50个字符'));

            }
            return callback();
        }
        var isNumber = Util.validateForm.isNumber;
        var isWeight=Util.validateForm.isWeight;
        var isProductCode = Util.validateForm.isProductCode;
        var isStoreCount=Util.validateForm.isStoreCount;
        return {
            selectNoSpecRadio:false,
            isClickGenerateNoSpecButton:false,
            deleteSpecDialogVisible:false,
            isShowSalePriceError:false,
            isShowCostError:false,
            isShowRichTextEditor:false,
            cateStr:'',
            isHasSpuId:false,
            customErrorSpuBn:false,
            currentPage:1,//返回传给商品发布列表的查询页码
            isFromRetek:false,//判断是否来源于spu模板，如果是的话，一下字段不能编辑
            judgePicType:'',//判断是商品图片还是规格图片；'product'是商品
            titles:[{id:1,name:'商品中心'},{id:2,name:'商品发布'},{id:3,name:'商品发布编辑'}],
            isHasSpec:false,//商品是否有具备多规格的radio
            isHasSpecDefault:false,//spu默认是否选择了无规格radio
            selectedFirstCategory:{},
            selectedSecondCategory:{},
            selectedThirdCategory:{},
            specEntity:[],
            backupSpecEntity:[],
            //规格表格自定义错误字段
            customErrorField:{
                isError_weight:false,
                isError_barCode:false,
                isExist_barCode:false,
                isDulplicate_barCode:false,
                isError_mktPrice:false,
                isError_bn:false,
                isExist_bn:false,
                isDulplicate_bn:false,
                isError_productName:false,
                isError_cost:false,
                isError_storeCount:false,
                isError_salePrice:false,
                isError_location:false
            },
            uploadFileUrl:this.$apiUrl.uploadImageUrl,

            isShowUploadDialog:false,
            productPicArr:[],
            productDetailContent:'',
            tagContent:'',
            isShowGenerateSpec:false,
            editorOption: {
                // some quill options
            },
            brandList:[],
            countryList:[],
            specArr:[],
            specPicArr:[],//和规格上传图片有关[{specName:'',imageIds:[]},{}]
            attributes:[],
            customAttributes:[],//自定义的扩展
            unCustomAttributes:[],//非自定义的扩展
            detailparams:[],
            tablabels:[],
            formEntity:{
                countryId:'',
                brandId:'0',
                propsAttributes:[],
                propsText:[],
                pcGoodsInfo:'',
                catchWeightInd:'',
                storeCount:''

            },
            ruleForm:{
                bn:'',
                goodsName:'',
                unit:'',
                barCode:'',
                keywords:'',
                brief:'',
                catchWeightInd:'',
                location:''

            },
            rules:{
                goodsName:[
                    { required: true, message: '必填',trigger: 'change' },
                    { message: '长度为2到50个字符', min:2,max:50,trigger: 'change' }
                ],
                goodsAd:[
                    { message: '长度为2到50个字符', min:2,max:50,trigger: 'change' }
                ],
                bn:[
                    { required: true, message: '必填',trigger: 'change' },
                    { message: '最大长度为20个字符',max:20,trigger: 'change' }
                ],
                brief:[
                    { max:70, message:"最大长度为70个字符", trigger: 'change' }
                ],
                unit:[
                    { required: true, message: '必填', trigger: 'change' }
                ],
                barCode:[
                    { required: true, validator:isProductCode,message: '必填', trigger: 'change' }
                ],
                keywords:[
                    { message: '长度为2到50个字符', min:2,max:50,trigger: 'change' }
                ],
                catchWeightInd:[
                    { required: true, message: '必选择',trigger: 'change' },
                ],
                location:[
                    {validator:isLocation,trigger: 'change'}
                ]
            }
        }
    },
    methods:{
        changeIsWeight:function(){
            //1.有规格：{
            //     称重：无规格
            //     非称重：有规格和无规格都可以
            // }
            // 2.无规格：{
            //     称重：无规格
            //     非称重：无规格
            // }
            if(!this.isHasSpec||(this.isHasSpec&&this.formEntity.catchWeightInd=='Y')){
                this.selectNoSpecRadio=true;
                //如果之前就是选中的无规格radio,不需要变化
                if(this.isClickGenerateNoSpecButton){
                    return;
                }
                this.specPicArr=[];
                this.specEntity=[Object.assign({},{
                    specName:'无规格',
                    specAttributes:[],//后端根据这个字段判断是否有无规格
                    specText:'',
                    productName:'',
                    bn:'',
                    weight:'',
                    mktPrice:'',
                    cost:'',
                    storeCount:'',
                    salePrice:'',
                    barCode:'',
                    nostoreSell:1//开启虚拟库存
                },this.customErrorField)]

                //清空已经选择的有规格
                this.specArr.forEach(v=>{
                    v.checked=[];
                })
                this.isClickGenerateNoSpecButton=true;//点击生成无规格
            }
        },
        changeNoSpecRadio:function(){
            if(this.selectNoSpecRadio){
                //如果之前就是选中的无规格radio,不需要变化
                if(this.isClickGenerateNoSpecButton){
                    return;
                }
                this.specPicArr=[];
                this.specEntity=[Object.assign({},{
                    specName:'无规格',
                    specAttributes:[],//后端根据这个字段判断是否有无规格
                    specText:'',
                    productName:'',
                    bn:'',
                    weight:'',
                    mktPrice:'',
                    cost:'',
                    storeCount:'',
                    salePrice:'',
                    barCode:'',
                    nostoreSell:1//开启虚拟库存
                },this.customErrorField)]

                //清空已经选择的有规格
                this.specArr.forEach(v=>{
                    v.checked=[];
                })
                this.isClickGenerateNoSpecButton=true;//点击生成无规格
            }
        },
        getRichTextGoodsInfo:function(result){
            var content=result.content;
            this.formEntity.pcGoodsInfo=content;
        },
        getRichTextTabContent:function(result){
            var content=result.content;
            var id=result.id;

            this.tablabels.forEach(v=>{
                if(id.indexOf(v.id)!=-1){
                    v.tabContent=content;
                }
            })
        },
        changeSpuBn:function(){

            clearTimeout(timer)
            timer=setTimeout(()=>{
                this.isExistProductCode();
            },300)
        },
        validatePrice:function(type){
            if(type=="cost"){
                if(/^\d{1,7}(\.\d{1,2})?$/.test(this.formEntity[type])){
                    if(this.formEntity.salePrice){
                        if(parseFloat(this.formEntity.cost)<parseFloat(this.formEntity.salePrice)){
                            this.isShowCostError=false;
                            this.isShowSalePriceError=false;
                        }else{
                            this.isShowCostError=true;
                        }
                    }else{
                        this.isShowCostError=false;
                    }

                }else{
                    this.isShowCostError=true;
                    // this.isShowSalePriceError=true;
                }
            }
            if(type=="salePrice"){
                if(/^\d{1,7}(\.\d{1,2})?$/.test(this.formEntity[type])){
                    if(this.formEntity.cost){
                        if(parseFloat(this.formEntity.cost)<parseFloat(this.formEntity.salePrice)){
                            this.isShowSalePriceError=false;
                            this.isShowCostError=false;
                        }else{
                            this.isShowSalePriceError=true;
                        }
                    }else{
                        this.isShowSalePriceError=false;
                    }

                }else{
                    this.isShowSalePriceError=true;
                    // this.isShowCostError=true;
                }
            }

        },
        isExistDataBase:function(filedName,value,item,index){
            var url=this.$apiUrl.validateFiledUrl;
            var params={};
            if(filedName=="bn"){
                params.skuBn=value
            }
            if(filedName=="barCode"){
                params.barcode=value
            }

            this.$ajax.get(url,params).then(res=>{
                if(res.error==0){
                    if(res.data.length>0){

                        //存在于数据库,但需要判断该数据和数据库里面的数据是否有改变
                        if(this.backupSpecEntity[index][filedName]==item[filedName]&&this.backupSpecEntity[index].skuId==item.skuId){
                            //未改变该字段
                            item['isExist_'+filedName]=false;

                        }else{
                            item['isExist_'+filedName]=true;
                        }

                    }else{
                        //不存在于数据库
                        item['isExist_'+filedName]=false;


                    }
                }else{
                    this.$message({
                        type:'error',
                        message:res.msg
                    })
                }
            })
        },
        //判断条形码和货号是否有重复值
        isDulplicate:function(filedName){
            var tempArr=[];
            this.specEntity.forEach(v=>{
                if(!v[filedName]){
                    v['isDulplicate_'+filedName]=false;
                }else{
                    if(tempArr.indexOf(v[filedName])==-1){
                        tempArr.push(v[filedName]);
                        v['isDulplicate_'+filedName]=false;
                    }else{
                        v['isDulplicate_'+filedName]=true;
                    }
                }

            })
        },
        isExistProductCode:function(){
            var url=this.$apiUrl.validateProductCodeUrl;
            var params={
                bn:this.formEntity.bn
            }
            this.$ajax.post(url,params).then(res=>{
                if(res.error==0){
                    if(res.data.length>0){
                        //存在于数据库
                        if(this.formEntity.spuId==res.data[0].spuId){
                            this.customErrorSpuBn=false;
                        }else{
                            this.customErrorSpuBn=true;
                        }

                    }else{
                        //不存在于数据库
                        this.customErrorSpuBn=false;
                    }
                }else{
                    this.$message({
                        type:'error',
                        message:res.msg
                    })
                }
            })
        },
        validateSpec:function(item,type,index){
            //如果是称重的话，不判断该字段,这个只是临时方案，到时可能会修改
            if(type=='location'){
                item['isError_'+type]=false;
                return;
            }
            /////////////////////////////////////////////

            if((!item[type]||item[type].toString().trim()=="")&&type!='location'){
                //库存不是必填
                item['isError_'+type]=true;


            }else{
                if(type=='weight'){
                    if(this.formEntity.catchWeightInd=='Y'){
                        if(/^\d{1,10}$/.test(item[type])&&item[type]>0){
                            if(item['storeCount']){
                                if(parseFloat(item[type])<=parseFloat(item['storeCount'])){
                                    item['isError_'+type]=false;
                                    item['isError_storeCount']=false;
                                }else{
                                    item['isError_'+type]=true;
                                }
                            }else{
                                item['isError_'+type]=false;
                            }

                        }else{
                            item['isError_'+type]=true;
                        }
                    }else{
                        if(/^\d{1,10}$/.test(item[type])&&item[type]>0){
                            item['isError_'+type]=false;
                        }else{
                            item['isError_'+type]=true;
                        }
                    }

                }else if(type=="barCode"){
                    if(/^[\d\w]{1,20}$/.test(item[type])){
                        item['isError_'+type]=false;
                        //验证字段是否存在于数据库
                        if(index!=undefined){
                            clearTimeout(barCodeTimer)
                            barCodeTimer=setTimeout(()=>{
                                this.isExistDataBase('barCode',item[type],item,index)
                            },300);
                        }


                    }else{
                        item['isError_'+type]=true;
                        item['isExist_'+type]=false;
                    }
                    if(index!=undefined){
                        //让该字段所有的重复提示取消
                        this.specEntity.forEach(v=>{
                            v['isDulplicate_'+type]=false;
                        })
                    }
                }else if(type=="mktPrice"){
                    if(/^\d{1,7}(\.\d{1,2})?$/.test(item[type])){
                        item['isError_'+type]=false;
                    }else{
                        item['isError_'+type]=true;
                    }
                }else if(type=="productName"){
                    if(item[type].length>=2&&item[type].length<=50){
                        item['isError_'+type]=false;
                    }else{
                        item['isError_'+type]=true;

                    }
                }else if(type=="bn"){
                    if(/^[\d\w]{2,50}$/.test(item[type])){
                        item['isError_'+type]=false;
                        //验证字段是否存在于数据库
                        if(index!=undefined){
                            clearTimeout(bnTimer);
                            bnTimer=setTimeout(()=>{
                                this.isExistDataBase('bn',item[type],item,index)
                            },300)
                        }

                    }else{
                        item['isError_'+type]=true;
                        item['isExist_'+type]=false;
                    }
                    if(index!=undefined){
                        //让该字段所有的重复提示取消
                        this.specEntity.forEach(v=>{
                            v['isDulplicate_'+type]=false;
                        })
                    }
                }else if(type=="cost"){
                    if(/^\d{1,7}(\.\d{1,2})?$/.test(item[type])){
                        if(item.salePrice){
                            if(parseFloat(item.cost)<parseFloat(item.salePrice)){
                                item['isError_'+type]=false;
                                item['isError_salePrice']=false;
                            }else{
                                item['isError_'+type]=true;
                            }
                        }else{
                            item['isError_'+type]=false;
                        }

                    }else{
                        item['isError_'+type]=true;
                        // item['isError_salePrice']=true;
                    }
                }else if(type=="salePrice"){
                    if(/^\d{1,7}(\.\d{1,2})?$/.test(item[type])){
                        if(item.cost){
                            if(parseFloat(item.cost)<parseFloat(item.salePrice)){
                                item['isError_'+type]=false;
                                item['isError_cost']=false;
                            }else{
                                item['isError_'+type]=true;
                            }
                        }else{
                            item['isError_'+type]=false;
                        }

                    }else{
                        item['isError_'+type]=true;
                        // item['isError_cost']=true;
                    }
                }else if(type=="storeCount"){
                    if(this.formEntity.catchWeightInd=="Y"){
                        if(/^[\d]{1,20}$/.test(item[type])){
                            if(item['weight']){
                                if(parseFloat(item[type])>=parseFloat(item['weight'])){
                                    item['isError_'+type]=false;
                                    item['isError_weight']=false;
                                }else{
                                    item['isError_'+type]=true;
                                }
                            }else{
                                item['isError_'+type]=false;
                            }

                        }else{
                            item['isError_'+type]=true;
                        }
                    }else{
                        if(/^[\d]{1,20}$/.test(item[type])){
                            item['isError_'+type]=false;
                        }else{
                            item['isError_'+type]=true;
                        }
                    }

                }else if(type=="location"){
                    if(item[type]==''||/^.{2,50}$/.test(item[type])){
                        item['isError_'+type]=false;
                    }else{
                        item['isError_'+type]=true;
                    }
                }
                else{
                    item['isError_'+type]=false;
                }

            }
        },
        deleteProductPic:function(item){
            var imageId=item.imageId;
            var tempPicArr=[];
            this.productPicArr.forEach(v=>{
                if(v.imageId!=imageId){
                    tempPicArr.push(v)
                }
            })
            this.productPicArr=tempPicArr;
        },
        deleteSpec:function(it,item){
            this.deleteSpecDialogVisible=true;
            itObj=it;
            itemObj=item;
        },
        comfirmDeleteSpec:function(){
            var it=itObj;
            var item=itemObj;
            var url=this.$apiUrl.deleteSpecUrl;
            var params={
                id:it.id
            }
            this.$ajax.post(url,params).then(res=>{
                if(res.error==0){
                    var newSpecArr=[];
                    item.values=item.values.filter(v=>{
                        if(v.id!=it.id){
                            return v;
                        }
                    })
                    //重新生成规格
                    //重新生成规格
                    var tempItemChecked=[];
                    for(var i=0;i<item.checked.length;i++){
                        if(item.checked[i]!=it.name){
                            tempItemChecked.push(item.checked[i])

                        }
                    }
                    item.checked=tempItemChecked;
                    this.reGenerateSpec();
                    this.$message({
                        type:"success",
                        message:'规格删除成功！'
                    })
                }else{

                    this.$message({
                        type:"error",
                        message:res.msg
                    })
                }
                this.deleteSpecDialogVisible=false;
            })
        },
        addSpec:function(item){
            if(!item.addedSpecName||!item.addedSpecName.toString().trim()){
                this.$message({
                    type:"warning",
                    message:'请输入规格名称'
                })
                return;
            }
            var url=this.$apiUrl.addSpecUrl;
            var params={
                specId:item.id,
                specValueName:item.addedSpecName,
                specValueSort:item.values.length+1
            }
            this.$ajax.post(url,params).then(res=>{
                if(res.error==0){
                    item.values.push({id:res.data.specValueId,name:res.data.specValueName,shopId:res.data.shopId})
                    this.$message({
                        type:"success",
                        message:'规格新增成功！'
                    })
                }else{
                    this.$message({
                        type:"error",
                        message:res.msg
                    })
                }
            })
        },
        deleteSpecPic:function(item,index){
            var imageId=item.imageId;
            var tempPicIdArr=[];
            this.specPicArr[index].imageIds.forEach(v=>{
                if(v.imageId!=imageId){
                    tempPicIdArr.push(v)
                }
            })
            this.specPicArr[index].imageIds=tempPicIdArr;
        },
        showProductPicDialog:function(){
            this.isShowUploadDialog=true;

            this.judgePicType="product";
        },
        showSpecPicDialog:function(index){
            this.isShowUploadDialog=true;

            this.judgePicType=index;

            this.specEntity[index].imageIds=[];

        },

        closeUploadDialog:function(){
            this.isShowUploadDialog=false;
        },
        getSelectedPicuUrl:function(result){
            this.isShowUploadDialog=false;
            //判断图片是商品图片还是规格图片
            if(this.judgePicType=="product"){


                if(result.length+this.productPicArr.length>6){
                    this.$message({
                        type:'warning',
                        message:'最多选择6张图片'
                    })
                }else{
                    result.forEach(value=>{
                        if(this.productPicArr.length){
                            for(var i=0;i<this.productPicArr.length;i++){
                                var item=this.productPicArr[i];
                                if(value.imageId==item.imageId){
                                    break;
                                }
                                if(i==this.productPicArr.length-1){
                                    this.productPicArr.push(value);
                                }
                            }
                        }else{
                            this.productPicArr.push(value);
                        }
                    })
                }
            }else{
                var index=this.judgePicType;
                if(result.length+this.specPicArr[index].imageIds.length>6){
                    this.$message({
                        type:'warning',
                        message:'最多选择6张图片'
                    })
                }else{
                    result.forEach(value=>{
                        if(this.specPicArr[index].imageIds.length){
                            for(var i=0;i<this.specPicArr[index].imageIds.length;i++){
                                var item=this.specPicArr[index].imageIds[i];
                                if(value.imageId==item.imageId){
                                    break;
                                }
                                if(i==this.specPicArr[index].imageIds.length-1){
                                    this.specPicArr[index].imageIds.push(value);
                                }
                            }
                        }else{
                            this.specPicArr[index].imageIds.push(value);
                        }


                    })
                }
            }



        },
        generateSpec:function(){

            //options里面是否有规格数组信息
            if(this.specArr&&this.specArr.length){
                for(var i=0;i<this.specArr.length;i++){
                    var v=this.specArr[i];
                    if(!v.checked||!v.checked.length){
                        this.$message({
                            type:'warning',
                            message:'请选择规格'
                        })
                        return false;
                    }
                }
            }else{
                this.$message({
                    type:'warning',
                    message:"请选择规格"
                })
                return;
            }

            this.isClickGenerateNoSpecButton=false;//点击生成有规格
            //根据选择的规格生成需要显示多少规格图片
            // this.specPicArr=[];
            var tempSpecPicArr=[];//临时规格图片，为了保存之前的规格图片信息

            this.specArr[0].checked.forEach(v=>{
                // this.specPicArr.push({specName:v,imageIds:[]})
                tempSpecPicArr.push({specName:v,imageIds:[]})
            })
            //判断规格图片
            var newSpecPicArr=[];
            if(this.specPicArr.length){
                tempSpecPicArr.forEach(v=>{
                    for(var i=0;i<this.specPicArr.length;i++){
                        var picItem=this.specPicArr[i];
                        if(v.specName==picItem.specName){
                            newSpecPicArr.push(picItem);
                            break;
                        }
                        if(i==this.specPicArr.length-1){
                            newSpecPicArr.push(v)
                        }
                    }
                })
                this.specPicArr=newSpecPicArr;
            }else{
                this.specPicArr=tempSpecPicArr;
            }

            this.isShowGenerateSpec=true;

            var tempSpecEntity=[];//为了判断生成规格时，之前的规格不清空
            // this.specEntity=[];

            var specIdArr=[];
            var specNameArr=[];

            this.specArr.forEach((value,index)=>{
                //根据name查找id
                var tempIdArr=[];
                value.checked.forEach((v,i)=>{

                    value.values.forEach(vv=>{
                        if(v==vv.name){
                            tempIdArr.push(vv.id);
                        }
                    })
                })

                specIdArr.push(tempIdArr);
                specNameArr.push(value.checked);
            })

            //整理后的规格信息name
            var newSpecNameArr=this.doExchange(specNameArr);
            //整理后的规格信息id
            var newSpecIdArr=this.doExchange(specIdArr);

            //设置specAttributes

            newSpecNameArr.forEach((value,index)=>{

                tempSpecEntity.push(Object.assign({},{
                    specName:value,
                    specAttributes:new Array(this.specArr.length),
                    productName:'',
                    bn:'',
                    weight:'',
                    mktPrice:'',
                    cost:'',
                    storeCount:'',
                    salePrice:'',
                    barCode:'',
                    nostoreSell:1//开启虚拟库存
                },this.customErrorField))
            })

            //根据id查询parentId
            tempSpecEntity.forEach(v=>{
                this.specArr.forEach((vv,i)=>{
                    v.specAttributes[i]={};
                    v.specAttributes[i].id=vv.id
                })
            })

            newSpecIdArr.forEach((value,index)=>{

                var arr=value.toString().split(',')

                arr.forEach((v,i)=>{
                    // tempSpecEntity[index].specAttributes[i]={};
                    tempSpecEntity[index].specAttributes[i].value=v;
                })

            })

            //判断哪一些值之前存在
            var newSpecEntity=[];
            if(this.specEntity.length){
                tempSpecEntity.forEach(v=>{
                    for(var i=0;i<this.specEntity.length;i++){
                        var item=this.specEntity[i];
                        if(v.specName==item.specName){
                            newSpecEntity.push(item);
                            break;
                        }
                        if(i==this.specEntity.length-1){
                            newSpecEntity.push(v);
                        }
                    }

                })
                this.specEntity=newSpecEntity;
            }else{
                this.specEntity=tempSpecEntity;
            }


        },
        reGenerateSpec:function(){
            for(var i=0;i<this.specArr.length;i++){
                var item=this.specArr[i];
                if(item.checked.length==0){
                    //规格列表
                    this.specEntity=[];
                    //规格信息radio
                    // this.specArr=[];
                    //规格图片
                    this.specPicArr=[];
                    return;
                }
            }
            //根据选择的规格生成需要显示多少规格图片
            // this.specPicArr=[];
            var tempSpecPicArr=[];//临时规格图片，为了保存之前的规格图片信息

            this.specArr[0].checked.forEach(v=>{
                // this.specPicArr.push({specName:v,imageIds:[]})
                tempSpecPicArr.push({specName:v,imageIds:[]})
            })
            //判断规格图片
            var newSpecPicArr=[];
            if(this.specPicArr.length){
                tempSpecPicArr.forEach(v=>{
                    for(var i=0;i<this.specPicArr.length;i++){
                        var picItem=this.specPicArr[i];
                        if(v.specName==picItem.specName){
                            newSpecPicArr.push(picItem);
                            break;
                        }
                        if(i==this.specPicArr.length-1){
                            newSpecPicArr.push(v)
                        }
                    }
                })
                this.specPicArr=newSpecPicArr;
            }else{
                this.specPicArr=tempSpecPicArr;
            }

            this.isShowGenerateSpec=true;

            var tempSpecEntity=[];//为了判断生成规格时，之前的规格不清空
            // this.specEntity=[];

            var specIdArr=[];
            var specNameArr=[];

            this.specArr.forEach((value,index)=>{
                //根据name查找id
                var tempIdArr=[];
                value.checked.forEach((v,i)=>{

                    value.values.forEach(vv=>{
                        if(v==vv.name){
                            tempIdArr.push(vv.id);
                        }
                    })
                })

                specIdArr.push(tempIdArr);
                specNameArr.push(value.checked);
            })

            //整理后的规格信息name
            var newSpecNameArr=this.doExchange(specNameArr);
            //整理后的规格信息id
            var newSpecIdArr=this.doExchange(specIdArr);


            //设置specAttributes

            newSpecNameArr.forEach((value,index)=>{
                tempSpecEntity.push(Object.assign({},{
                    specName:value,
                    specAttributes:new Array(this.specArr.length),
                    productName:'',
                    bn:'',
                    weight:'',
                    mktPrice:'',
                    cost:'',
                    storeCount:'',
                    salePrice:'',
                    barCode:'',
                    nostoreSell:1//开启虚拟库存

                },this.customErrorField))
            })

            //根据id查询parentId
            tempSpecEntity.forEach(v=>{
                this.specArr.forEach((vv,i)=>{
                    v.specAttributes[i]={};
                    v.specAttributes[i].id=vv.id
                })
            })

            newSpecIdArr.forEach((value,index)=>{

                var arr=value.toString().split(',')

                arr.forEach((v,i)=>{
                    // tempSpecEntity[index].specAttributes[i]={};
                    tempSpecEntity[index].specAttributes[i].value=v;
                })

            })

            //判断哪一些值之前存在
            var newSpecEntity=[];
            if(this.specEntity.length){
                tempSpecEntity.forEach(v=>{
                    for(var i=0;i<this.specEntity.length;i++){
                        var item=this.specEntity[i];
                        if(v.specName==item.specName){
                            newSpecEntity.push(item);
                            break;
                        }
                        if(i==this.specEntity.length-1){
                            newSpecEntity.push(v);
                        }
                    }

                })
                this.specEntity=newSpecEntity;
            }else{
                this.specEntity=tempSpecEntity;
            }




        },
        //组合数组
        doExchange: function (doubleArrays) {
            var len = doubleArrays.length;
            if (len >= 2) {
                var arr1 = doubleArrays[0];
                var arr2 = doubleArrays[1];
                var len1 = doubleArrays[0].length;
                var len2 = doubleArrays[1].length;
                var newlen = len1 * len2;
                var temp = new Array(newlen);
                var index = 0;
                for (var i = 0; i < len1; i++) {
                    for (var j = 0; j < len2; j++) {
                        temp[index] = arr1[i] + "," + arr2[j];
                        index++;
                    }
                }
                var newArray = new Array(len - 1);
                newArray[0] = temp;
                if (len > 2) {
                    var _count = 1;
                    for (var i = 2; i < len; i++) {
                        newArray[_count] = doubleArrays[i];
                        _count++;
                    }
                }
                return this.doExchange(newArray);
            }
            else {
                return doubleArrays[0];
            }
        },
        changeCustomeSelect:function(item){
            var rootId=item.id;
            var value=item.value;

            var arr=this.formEntity.propsAttributes;
            //判断是更新还是插入
            if(arr.length>0){
                for(var i=0;i<arr.length;i++){
                    if(arr[i].id==rootId){
                        arr[i].value=value;
                        break;
                    }
                    if(i==arr.length-1){
                        this.formEntity.propsAttributes.push({id:rootId,value:value})
                    }
                }
            }else{
                this.formEntity.propsAttributes.push({id:rootId,value:value})
            }


        },
        changeUnCustomeSelect:function(item,selectedId){
            var rootId=item.id;
            var value='';
            var arr=this.formEntity.propsText;
            //判断是更新还是插入
            if(arr.length>0){
                for(var i=0;i<arr.length;i++){
                    if(arr[i].id==rootId){
                        arr[i].value=selectedId;
                        break;
                    }
                    if(i==arr.length-1){
                        this.formEntity.propsText.push({id:rootId,value:selectedId})
                    }
                }
            }else{
                this.formEntity.propsText.push({id:rootId,value:selectedId})
            }

        },
        //验证是否可以save
        beforeSave:function(){
            if(!this.productPicArr.length&&this.isClickGenerateNoSpecButton){
                this.$message({
                    type:'warning',
                    message:'请上传商品信息图片'
                })
                return false;
            }


            if(!this.specEntity.length){
                this.$message({
                    type:'warning',
                    message:'请填写规格信息'
                })
                return false;
            }
            //判断商品编码是否重复
            if(this.customErrorSpuBn){
                this.$message({
                    type:'warning',
                    message:'商品编码重复'
                })
                return false;
            }

            //判断是否有重复的条形码和货号
            this.isDulplicate('bn');
            this.isDulplicate('barCode');
            //规格表单是否填写
            for(var i=0;i<this.specEntity.length;i++){
                var v=this.specEntity[i];

                this.validateSpec(v,'weight')
                this.validateSpec(v,'barCode')
                this.validateSpec(v,'mktPrice')
                this.validateSpec(v,'productName')
                this.validateSpec(v,'bn')
                this.validateSpec(v,'cost')
                this.validateSpec(v,'salePrice')
                this.validateSpec(v,'storeCount')
                this.validateSpec(v,'location')

            }

            for(var i=0;i<this.specEntity.length;i++){
                var v=this.specEntity[i];

                var isError=false;
                for(var key in this.customErrorField){
                    if(v[key]){
                        isError=true;
                        break;
                    }
                }
                if(isError){
                    this.$message({
                        type:'warning',
                        message:'相关字段填写有误，请检查相关字段后在提交！'
                    })
                    return false;
                }

            }
            //判断选择的是无规格radio还是有规格radio
            if(!this.isClickGenerateNoSpecButton){
                //如果有规格
                if(this.isHasSpec){
                    for(var i=0;i<this.specArr.length;i++){
                        var v=this.specArr[i];
                        if(!v.checked||!v.checked.length){
                            this.$message({
                                type:'warning',
                                message:'请选择规格'
                            })
                            return false;
                        }
                    }
                    if(!this.specPicArr.length){
                        this.$message({
                            type:'warning',
                            message:'请上传规格信息图片'
                        })
                        return false;
                    }else{
                        for(var i=0;i<this.specPicArr.length;i++){
                            var v=this.specPicArr[i];
                            if(!v.imageIds.length){
                                this.$message({
                                    type:'warning',
                                    message:'请上传规格信息图片'
                                })
                                return false;
                            }
                        }
                    }
                }else{
                    this.$message({type:'error',message:'请选择无规格'})
                }

            }

            return true;
        },
        goSave:function(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(!this.beforeSave()){
                        return;
                    }
                    this.formEntity.skuVoList=this.specEntity;
                    //设置ids
                    if(this.isClickGenerateNoSpecButton){
                        //无规格
                        var tempIds=[];
                        this.productPicArr.forEach(v=>{
                            tempIds.push(v.imageId)
                        })
                        this.formEntity.skuVoList[0].imageIds=tempIds
                    }else{
                        this.formEntity.skuVoList.forEach(v=>{
                            this.specPicArr.forEach(vv=>{
                                if(v.specName.indexOf(vv.specName)!=-1){
                                    var tempImageIdsArr=[];
                                    vv.imageIds.forEach(vvv=>{
                                        tempImageIdsArr.push(vvv.imageId)
                                    })
                                    v.imageIds=tempImageIdsArr;
                                }
                            })
                        })
                    }

                    //设置tab
                    this.formEntity.tabLabelRelList=[];
                    this.tablabels.forEach(v=>{
                        var obj={
                            tabLabelId:v.id,
                            tabContent:v.tabContent,
                            tabLabelRelId:v.tabLabelRelId
                        }

                        this.formEntity.tabLabelRelList.push(obj)
                    })

                    //设置详细参数，只有自定义的
                    this.formEntity.infoAttributes=[];
                    this.detailparams.forEach(v=>{
                        var tempListArr=[];
                        v.list.forEach(vv=>{
                            tempListArr.push({id:vv.id,value:vv.value})
                        })
                        this.formEntity.infoAttributes=this.formEntity.infoAttributes.concat(tempListArr)
                    })
                    //设置商品图片
                    this.formEntity.imageIds=[];
                    this.productPicArr.forEach(v=>{
                        this.formEntity.imageIds.push(v.imageId)
                    })


                    var url=this.$apiUrl.addOrUpdateProductPublishUrl;

                    var tempParams=this.formEntity;
                    var params={
                        data:JSON.stringify(tempParams),
                        id:tempParams.goodsId
                    }
                    this.$ajax.post(url,params).then(res=>{
                        if(res.error==0){
                            this.$message({
                                type:'success',
                                message:res.msg
                            })
                            this.$router.push({name:'商品发布列表',params:{currentPage:this.currentPage}})
                        }else{
                            this.$message({
                                type:'error',
                                message:res.msg
                            })
                        }
                    })



                } else {
                    this.$message({
                        type:'warning',
                        message:'相关字段填写有误，请检查相关字段后在提交！'
                    })
                    return false;
                }
            });
        },
        goBack:function(){
            this.$router.push({name:'商品发布列表',params:{currentPage:this.currentPage}})
        },
        getAllSelect:function(options){
            //存储下拉框的值
            this.brandList.push({id:0,name:'无品牌'})
            this.brandList=this.brandList.concat(options.brands);
            if(this.brandList.length){
                this.formEntity.brandId=this.brandList[0].id;
            }else{
                this.$message({
                    type:'warning',
                    message:'选择的三级分类未关联品牌，请先去后台展示管理关联品牌!'
                })
            }


            this.countryList=options.countries;

            options.attributes.forEach(value=>{
                value.selected=null;
            })
            this.attributes=options.attributes;
            //将自定义的和非自定义的区分
            this.attributes.forEach(value=>{
                //type==4的为自定义的
                if(value.expressionType==4){
                    this.customAttributes.push(value)
                }else{
                    this.unCustomAttributes.push(value)
                }
            })

            this.detailparams=options.detailparams;

            options.specs.forEach(value=>{
                value.checked=[];
            })
            this.specArr=options.specs;

            this.tablabels=options.tablabels;
        },
        getDetail(goodsId){
            var url=this.$apiUrl.getProductDeatilUrl+"?id="+goodsId;
            this.$ajax.post(url).then(res=>{
                if(res.error==0){
                    if(res.data.spuId){
                        this.isHasSpuId=true;//来源于spu
                        //判断spu是有规格的还是无规格的
                    }
                    this.getAllSelect(res.data.options)
                    this.formEntity=Object.assign({},res.data);

                    //判断国家id是否存在
                    if(this.countryList.length){
                        for(var i=0;i<this.countryList.length;i++){
                            var item=this.countryList[i];
                            if(item.id==this.formEntity.countryId){
                                break;
                            }
                            if(i==this.countryList.length-1){
                                this.formEntity.countryId='';
                            }
                        }
                    }else{
                        this.formEntity.countryId='';
                    }



                    //判断是否来源于spu模板
                    this.isFromRetek=res.data.spuSource==1?true:false;

                    //判断是否有规格.
                    if(res.data.options.specs.length>0){
                        this.isHasSpec=true;

                    }else{
                        this.isHasSpec=false;

                    }
                    //判断是否有规格
                    if(res.data.hasSpec){
                        this.selectNoSpecRadio=false;
                        this.isHasSpecDefault=true
                    }else{

                        this.selectNoSpecRadio=true;
                        this.isHasSpecDefault=false;
                        this.isClickGenerateNoSpecButton=true;
                    }



                    //商品图片
                    this.productPicArr=res.data.imageList;
                    //tab标签内容
                    var tabArr=res.data.tabLabelRelList;
                    if(tabArr.length){
                        this.tablabels.forEach((v,index)=>{

                            tabArr.forEach(vv=>{
                                if(v.id==vv.tabLabelId){
                                    v.tabContent=vv.tabContent||"";
                                    v.tabLabelRelId=vv.tabLabelRelId;
                                }
                            })

                        })
                    }

                    //商品分类
                    var categoryArr=[];

                    res.data.backCatePathResultList.forEach(v=>{
                        categoryArr.push(v.backCateName)
                    });
                    this.cateStr=categoryArr.join('>');


                    //是否显示规格sku数据
                    if(res.data.skuVoList&&res.data.skuVoList.length){
                        this.backupSpecEntity=JSON.parse(JSON.stringify(res.data.skuVoList));

                        res.data.skuVoList.forEach(v=>{
                            if(this.isFromRetek){
                                v.storeCount=v.storeCount||'0';

                            }
                            this.validateSpec(v,'weight')
                            this.validateSpec(v,'barCode')
                            this.validateSpec(v,'mktPrice')
                            this.validateSpec(v,'productName')
                            this.validateSpec(v,'bn')
                            this.validateSpec(v,'cost')
                            this.validateSpec(v,'salePrice')
                            this.validateSpec(v,'storeCount')
                            this.validateSpec(v,'location')
                            //转为和之前接口一样的字段
                            v.specText=v.specAttributes;
                            v.specAttributes=null;
                        })

                        //判断是否是无规格还是有规格
                        if(!res.data.skuVoList[0].specText||res.data.skuVoList[0].specText.length==0){
                            //无规格
                            this.selectNoSpecRadio=true;//选择无规格radio

                            //生成specName
                            res.data.skuVoList[0].specName='无规格';
                        }else{
                            //生成specName
                            res.data.skuVoList.forEach(v=>{
                                var tempSpecNameArr=[];
                                if(v.specText&&v.specText.length){
                                    v.specText.forEach((vv,index)=>{
                                        tempSpecNameArr.push(vv[3])
                                    })
                                    v.specName=tempSpecNameArr.join(',');
                                }else{
                                    //如果是无规格
                                    v.specName="无规格"
                                }

                            })

                            //设置规格图片
                            var tempObj={};
                            res.data.skuVoList.forEach(v=>{

                                var imageUrlArr=[];
                                v.imageList.forEach(vv=>{
                                    imageUrlArr.push(vv);
                                })
                                //去重
                                if(!tempObj[v.specText[0][3]]){
                                    tempObj[v.specText[0][3]]=1;
                                    this.specPicArr.push({specName:v.specText[0][3],imageIds:imageUrlArr});
                                }

                                //设置选中的radio
                                v.specAttributes=[];
                                v.specText.forEach(vv=>{
                                    v.specAttributes.push({id:vv[0],value:vv[1]})
                                })

                            })

                            this.specArr.forEach(v=>{
                                v.checked=[];
                                res.data.skuVoList.forEach(vv=>{
                                    vv.specText.forEach(vvv=>{
                                        if(v.id==vvv[0]){
                                            if(v.checked.indexOf(vvv[3])==-1){
                                                v.checked.push(vvv[3])
                                            }

                                        }
                                    })
                                })
                            })
                        }
                        this.specEntity=res.data.skuVoList.map(v=>{
                            v=Object.assign({},v,this.customErrorField);
                            return v;
                        });




                    }




                    //自定义扩展属性
                    // var propsAttributes=res.data.propsAttributes;
                    var propsAttributes=res.data.propsText;
                    var tempPropsAttributes=[];
                    this.customAttributes.forEach((v,index)=>{
                        propsAttributes.forEach(vv=>{
                            if(v.id==vv[0]){
                                v.value=vv[3];
                                tempPropsAttributes.push({id:v.id,value:v.value})

                            }
                        })
                    })
                    this.formEntity.propsAttributes=tempPropsAttributes;
                    //非自定义扩展属性
                    var propsText=res.data.propsText;
                    var tempPropsText=[];
                    this.unCustomAttributes.forEach((v,index)=>{
                        propsText.forEach(vv=>{
                            if(v.id==vv[0]){
                                v.selected=parseInt(vv[1]);//字符串转为数字
                                tempPropsText.push({id:v.id,value:v.selected})
                            }
                        })

                    })
                    this.formEntity.propsText=tempPropsText;

                    //自定义详细参数，详细参数只有自定义的
                    if(res.data.propsDetailText&&res.data.propsDetailText.length){
                        res.data.propsDetailText.forEach(v=>{
                            this.detailparams.forEach(vv=>{
                                if(v[0]==vv.id){
                                    vv.list.forEach(vvv=>{
                                        if(vvv.id==v[1]){
                                            vvv.value=v[5]
                                        }
                                    })
                                }
                            })
                        })
                    }

                    //如果没有值，为value设一个为空的默认值
                    this.detailparams.forEach(v=>{
                        v.list.forEach(vv=>{
                            if(!vv.value){
                                vv.value=""
                            }
                        })
                    })


                }else{
                    this.$message({
                        type:'error',
                        message:res.msg
                    })
                }
                //页面加载完后，在显示富文本
                this.isShowRichTextEditor=true;
            })
        }
    },
    computed: {
        //   editor() {
        //     return this.$refs.myQuillEditor.quill
        //   }

    },
    mounted(){

        //得到分类信息
        // this.selectedFirstCategory=JSON.parse(sessionStorage.getItem('selectedFirstCategory'));
        // this.selectedSecondCategory=JSON.parse(sessionStorage.getItem('selectedSecondCategory'));
        // this.selectedThirdCategory=JSON.parse(sessionStorage.getItem('selectedThirdCategory'));
        // this.formEntity.catbackId=this.selectedThirdCategory.catbackId;
        var goodsId=this.$route.query.goodsId;
        this.currentPage=this.$route.query.currentPage||1;
        this.getDetail(goodsId)

    }
}
</script>
<style scoped lang="scss">
    .el-col-3{
        min-width:120px;
    }
    .el-col-4{
        min-width:160px;
    }
    .el-col-10{
        min-width:400px;
    }
    .delete-btn{
        position: absolute;
        bottom:0px;
        width:100%;
        height:26px;
        line-height:26px;
        .wrap{
            background-color:#000000;
            opacity:0;
            margin:0px auto;
            width:100px;
            color:#ffffff;
            &:hover{
                opacity:0.3;
            }
        }
    }
    .tips{
        height:40px;
        line-height:40px;
        color:#999999;
        &.multi{
            line-height:20px;
        }
    }
    .el-checkbox-group{
        line-height:40px;
        section{
            display: inline-block;
            margin-right:30px;
        }
    }
    .custom-table{
        margin-top:10px;
        width: 100%;
        th{
            white-space: nowrap;
            overflow: hidden;
            background-color: #eef1f6;
            text-align: center;
            height:40px;
            vertical-align: middle;
            padding-left:18px;
            padding-right:18px;
        }
        tr{
            vertical-align:top;
        }
        td{
            height: 40px;
            text-align:center;
            text-overflow: ellipsis;
            // vertical-align: middle;
            border-bottom: 1px solid #dfe6ec;
            padding-left:18px;
            // padding-right:18px;
            .cell{
                margin-top:8px;
                margin-bottom:8px;
            }
            .validate-error{
                height:44px;
                line-height:15px;
                color:#ff4949;
                text-align:left;
            }
        }
    }
    .header{
        font-size:16px;
        color:#3dc8f6;
    }
    .select-type{
        padding-left:40px;
        padding-bottom:20px;
        height:40px;
        line-height:40px;
        background-color:#ffffff;
        .item{
            color:#666666;
            font-size:14px;
            &.title{
                width:120px;
                color:#333333;
            }
        }
        .arrow{
            padding-left:5px;
            padding-right:5px;
        }
        div{
            float:left
        }
    }
    .label{
        font-size:14px;
        color:#666666;
        height:40px;
        line-height:40px;
    }
    .pic-label{
        font-size:12px;
        color:#666666;
        height:22px;
        line-height:22px;
    }
    .require-pic-label{
        font-size:14px;
        color:#666666;
        height:100px;
        line-height:100px;
    }
    .right{
        height:40px;
        line-height:40px;
        color:#333333;
        font-size:14px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .mod-toolbar{
        background-color:#ffffff;
        padding:25px;
        margin-bottom:0px;
        margin-top:0px;
        .el-row{
            border-bottom:1px solid #f3f5f7;
        }
        .last-row{
            border:none;
        }
    }
    .spec-info{
        .spec-item{
            margin-bottom:0px;
        }
    }
    img{
        width:100px;
        height:100px;
    }
    .latlang .el-form-item__label{
        text-align:left
    }

    .require-label:before{
        content: '*';
        color: #ff4949;
        margin-right: 4px;
    }
    .detail-info .label.header{
        background-color:#f3f5f7;
        text-align:center;
    }
    .btn-submit{
        background-color:#3dc8f6;
        color:#ffffff;
        border:none;
    }
    .spec-btn{
        background-color:#3dc8f6;
        color:#ffffff;
        border:none;
        margin-top:10px;
    }
    .radio-group{
        height:40px;
        line-height:40px;
    }
    .cover{
        position:absolute;
        width:100%;
        height:100%;
        opacity:0.3;
        background-color:#666666;
        z-index:100
    }
    .bg-group{
        background-color:#fff;
        padding-left:25px;
        padding-bottom:40px;
    }
</style>
<style lang="scss">
    .mod-toolbar {
        .el-row{
            border-bottom-width:0px!important;
            margin-bottom:10px;
             &:first-child{
                border-bottom: 1px solid #f3f5f7!important;
            }
        }
    }
    .sku .ql-container.ql-snow{
        height:375px;
    }

    .sku .el-form-item__content{
        margin-left:0px!important;
    }
    .sku .el-upload--picture-card{
        width:100px;
        height:100px;
    }
    .sku .el-upload-list__item {
        width:100px;
        height:100px;
    }
    .sku .add-sepc-input{
        .el-input__inner{
            border-right-width: 0px;
        }

        img{
            height:16px;
            width:16px;
            vertical-align:middle;
        }
    }
    .sku .error input{
        border:1px solid #ff4949;
    }
    .sku .el-checkbox__input.is-checked .el-checkbox__inner{
        background-color:#33bcac;
        border-color:#33bcac;
    }
</style>
