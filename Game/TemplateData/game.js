let bgAudioPlayer = undefined

// game start logic
function init() {
    window.onblur = onBlurGame
    window.onfocus = onFocusGame
    // load project data
    document.addEventListener('click',()=>{
        if(bgAudioPlayer != undefined){
            bgAudioPlayer.play()
        }
    })

    document.getElementById('gameTitle').innerHTML = localize(projectData.game_data.Title)
    document.getElementById('gameTitle').style.color = projectData.colors.fontColor
    document.querySelector('.background').style.filter = 'blur('+projectData.game_data.bgBlurSize+'px)'
    document.querySelector('#choseFrame').style.backgroundColor = projectData.colors.choseFrameColor
    document.querySelector('#recordFrame').style.backgroundColor = projectData.colors.recordFrameColor

    document.querySelector('#menu_play').addEventListener('click' , ()=>{
        if(quiz.length > 1)showHide('#menuFrame' , '#choseFrame')
        else{
            showHide('#menuFrame' , '#gameFrame')
        }
    })
    document.querySelector('#chose_backmenu').addEventListener('click' , ()=>{showHide('#choseFrame' , '#menuFrame')})
    document.querySelector('#record_backmenu').addEventListener('click' , ()=>{showHide('#recordFrame' , '#menuFrame')})
    document.querySelector('#menu_record').addEventListener('click' , ()=>{showHide('#menuFrame' , '#recordFrame')})

    if(!projectData.game_data.useLocalization && !projectData.game_data.isPlayMusick){
        document.getElementById('menu_settings').style.display = 'none' 
    }

    // category add buttons
    categoryButtonContainer = document.getElementById('categorybutton')
    drawCategory()


    //set all block style
    let alltext = document.getElementsByClassName('text')
    for(let i = 0; i < alltext.length;i++)
        alltext[i].style.color = projectData.colors.fontColor
    let buttons = document.getElementsByTagName('button')
    for(let i = 0; i < buttons.length;i++){
        buttons[i].style.backgroundColor = projectData.colors.buttonsColor
        buttons[i].style.color = projectData.colors.fontColor
    }
    if(projectData.game_data.isPlayMusick){
    bgAudioPlayer = new Audio('./ProjectData/bgAudio.mp3')
    bgAudioPlayer.volume = 1
    bgAudioPlayer.onended = function(){bgAudioPlayer.play()}
    }
    //bgAudioPlayer.autoplay = true
}

function drawCategory(){
    let categoryButtonContainer = document.getElementById('categorybuttons')
    for(let i = 0; i < quiz.length;i++){
        categoryButtonContainer.innerHTML += drawCategoryButton(i)
    }
}

function drawCategoryButton(index){
    return `
        <button onclick="clickCategoryButton(${index})">${quiz[index].category}</button>
    `
}

function clickCategoryButton(index){

}


function onBlurGame(event){
    if(bgAudioPlayer != undefined)bgAudioPlayer.pause()
}

function onFocusGame(event){
    if(bgAudioPlayer != undefined)bgAudioPlayer.play()
}

function showHide(hide , show , classData = 'frame'){
    document.querySelector(hide).setAttribute('class' , classData+' hide')
    document.querySelector(show).setAttribute('class' , classData)
}

function recordDraw(){

}

window.addEventListener("DOMContentLoaded", (event) => { init() });