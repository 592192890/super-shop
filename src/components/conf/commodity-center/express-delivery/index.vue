<template>
    <div class="express-delivery">
        <!--运费模板-->
        <fee-section></fee-section>

        <!--自提模板-->
        <pickup-section></pickup-section>
        
        <!--发货地址/退货地址-->
        <express-address-section></express-address-section>
        
    </div>
</template>
<script>
import feeSection from './feeSection'
import pickupSection from './pickupSection'
import expressAddressSection from './expressAddressSection'
export default {
    components:{
        feeSection,
        pickupSection,
        expressAddressSection
    },
    data(){
        return {

            
        }
    },
    methods:{
       
        
    },
    mounted(){
        
        
        

      
    }
}
</script>
<style>

</style>
