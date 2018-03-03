import Vue from 'vue'
import Vuex from 'vuex'
// import demo from './demo/demo'
import formSearch from './form-search'
import list from './list'
import voucherActivities from './voucher-activities'
import couponRule from './coupon-rule'

Vue.use(Vuex)
export
default new Vuex.Store({
    modules: {
        // namespaced: true,
        formSearch: formSearch,
        list: list,
        voucherActivities: voucherActivities,
        couponRule: couponRule,
    }
})