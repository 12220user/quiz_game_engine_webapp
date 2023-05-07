// game start logic
function init() {
    window.onblur = onBlurGame
    window.onfocus = onFocusGame
    // load project data
    let buttons = document.getElementsByTagName('button')
    for(let i = 0; i < buttons.length;i++){
        buttons[i].style.backgroundColor = projectData.colors.buttonsColor
        buttons[i].style.color = projectData.colors.fontColor
    }

    document.getElementById('gameTitle').innerHTML = localize(projectData.game_data.Title)
    document.getElementById('gameTitle').style.color = projectData.colors.fontColor
    document.querySelector('.background').style.filter = 'blur('+projectData.game_data.bgBlurSize+'px)'
    document.querySelector('#choseFrame').style.backgroundColor = projectData.colors.choseFrameColor

    document.querySelector('#menu_play').addEventListener('click' , ()=>{showHide('#menuFrame' , '#choseFrame')})
    document.querySelector('#chose_backmenu').addEventListener('click' , ()=>{showHide('#choseFrame' , '#menuFrame')})

    let alltext = document.getElementsByClassName('text')
    for(let i = 0; i < alltext.length;i++)
        alltext[i].style.color = projectData.colors.fontColor
}

function onBlurGame(event){
    
}

function onFocusGame(event){
    
}

function showHide(hide , show , classData = 'frame'){
    document.querySelector(hide).setAttribute('class' , classData+' hide')
    document.querySelector(show).setAttribute('class' , classData)
}

window.addEventListener("DOMContentLoaded", (event) => { init() });