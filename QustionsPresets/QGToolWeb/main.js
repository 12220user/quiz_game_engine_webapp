let prjName = ''

function init(){
    // draw caterogory
    projectNameButtonDraw()
}

function projectNameButtonDraw(){
    var list = projects.get()
    var container = document.querySelector('#projectNames')
    container.innerHTML = ''
    for(let i = 0 ; i < list.length; i++){
        container.innerHTML += `
            <button onclick="click_NameButton('${list[i]}')">${list[i]}</button>
        `
    }
}
init()

function click_NameButton(name){
    if(prjName != ''){
        file.write('prj:' + prjName , document.querySelector('#txt_area').value)
    }
    console.log('choose item: ' + name)
    prjName = name
    document.querySelector('#cE').innerHTML = prjName
    var data = file.read('prj:' + prjName)
    document.querySelector('#txt_area').value = data == null ? '' : data
}

function addProject(){
    var name = document.querySelector('#addTitle').value
    if(!projects.contains(name)){
        projects.add(name)
        projectNameButtonDraw()
        document.querySelector('#addTitle').value = ''
    }
}

function addToArea(data){
    document.querySelector('#txt_area').value += data+'\n' 
    file.write('prj:' + prjName , document.querySelector('#txt_area').value)  
}


function formToFormat(){
    var out = ''
    out+= document.querySelector('#fCategory').value + "|";
    out+= document.querySelector('#fQ').value + "|";
    out+= document.querySelector('#fH').value + "|";

    out += document.querySelector('input[name="r1"]:checked').value + '|'
    out+= document.querySelector('#fimg').value + "|";


    out+= document.querySelector('#fa1').value + "|";
    out+= document.querySelector('#fa2').value + "|";
    out+= document.querySelector('#fa3').value + "|";
    out+= document.querySelector('#fa4').value;
    addToArea(out)

    document.querySelector('#fQ').value = ''
    document.querySelector('#fimg').value = ''
    document.querySelector('#fa1').value  = ''
    document.querySelector('#fa2').value  = ''
    document.querySelector('#fa3').value  = ''
    document.querySelector('#fa4').value  = ''
}


function convertLogic(){
    var lines = document.querySelector('#txt_area').value.split('\n')
    let resultObj = []
    if(lines.length != 0){
        for(let i =0 ; i < lines.length; i++){
            if(lines[i] != ''){
                
                let data = lines[i].split('|')
                console.log(lines[i].split('|'))
                if(data.length < 7) {}
                else{
                    let entity =  {}
                    entity['answers'] = []
                    entity['question'] = data[1]
                    entity['hard'] = parseInt(data[2])
                    entity['right'] = parseInt(data[3])
                    entity['img'] = data[4]

                    for(let z = 5; z < data.length; z++){
                        entity['answers'].push(data[z])
                    }

                    let isEmptyCategory = true
                    let index = 0
                    for(let y = 0; y < resultObj.length; y++){
                        if(resultObj[y]['category'] == data[0]){
                            isEmptyCategory = false
                            index = y
                            break
                        }
                    }
                    if(isEmptyCategory){
                        resultObj.push({'category':data[0] , 'questions': [entity]})
                    }
                    else{
                        resultObj[index]['questions'].push(entity)
                    }
                }
            }
        }
    }
    document.querySelector('#result').innerHTML = JSON.stringify(resultObj)
}

function copy(){
    
        // Get the text field
        var copyText = document.getElementById("result");
      
        // Select the text field
        //copyText.select();
        //copyText.setSelectionRange(0, 99999); // For mobile devices
      
         // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.innerHTML);
      
        // Alert the copied text
        alert("Copied the text: " + copyText.innerHTML);
}