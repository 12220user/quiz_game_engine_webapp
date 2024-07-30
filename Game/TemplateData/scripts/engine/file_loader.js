class file_loader {
    constructor() {

    }

    async AsuncLoadJson(dir) {
        let response = await fetch(dir)
        if (!response.ok) return undefined
        let data = await response.json()
        return data
    }

    async AsuncLoadText(dir , callback){
        let response = await fetch(dir)
        if (!response.ok) return undefined
        let data = await response.text()
        callback( data )
    }
}