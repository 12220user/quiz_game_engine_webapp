const save = {
    get: function(token , base){
        let str = localStorage.getItem(token)
        return str == null || str == '' || str == NaN? base: parseInt(str)
    },
    set:function(token , obj){
        localStorage.setItem(token , obj+'')
    }
}

const record = {
    get:function(type){
        return save.get('record-data-type-'+type , 0)
    },
    set:function(type , value){
        if(record.get('record-data-type-'+type) < value)
        {
            save.set('record-data-type-'+type , value)
            return true
        }
        return false
    }
}