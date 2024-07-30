class Localizer{
    constructor(dataSheets){
        this.tabel = []
        for(let i = 0; i < dataSheets.length; i++){
            this.tabel.push(dataSheets[i].split(","))
        }
    }

    LocalizeByID(lang){
        let lngIndex = 1;
        for(let x = 1; x < this.tabel[0].length; x++){
            if(this.tabel[0][x] == lang){ lngIndex = x; break;}
        }

        for(let i = 1; i < this.tabel.length; i++){
            try{
                let ell = document.querySelector(`#${this.tabel[i][0]}`)
                 if(ell) ell.innerHTML = this.tabel[i][lngIndex] 
            } catch{}
        }
    }
}