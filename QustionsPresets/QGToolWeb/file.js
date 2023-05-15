const file = {
    write:function (name , value){
        localStorage.setItem(name , value)
    },
    read:function(name){
        return localStorage.getItem(name)
    }
}

const projects = {
    get:function(){
        let data = file.read('prj-list')
        if(data == '' || data== null || data == undefined || data== NaN){
            data = 'demo'
        }
        return data.split(';')
    },
    add:function(name){
        if(!this.contains(name))file.write('prj-list' , file.read('prj-list') +';' + name)
    },
    remove:function(name){
        var list = this.get()
        var nVl = ''
        for(let i = 0 ; i < list.length; i++){
            if(i == 0){
                if(list[i] != name) nVl += list[i]
            }
            if(list[i] != name) nVl += ';' + list[i]
        }
        file.write('prj-list')
    },
    contains:function(name ){
        var list = this.get()
        for(let i = 0 ; i < list.length; i++){
            if(list[i] == name) return true
        }
        return false
    }
}