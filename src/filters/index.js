exports.countTotalPrice = (val)=>{
    let price = 0;
    if(val.items){
        val.items.forEach(function(v) {
            price += parseFloat(v.price)*v.num
        });
    }
    return price.toFixed(2) || 0; 
}

exports.countTotalCost = (val)=>{
    let cost = 0;
    if(val.items){
        val.items.forEach(function(v) {
            cost += parseFloat(v.cost)*v.num
        });
    }
    return cost.toFixed(2) || 0; 
}