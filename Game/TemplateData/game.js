let bgAudioPlayer = undefined
let gameTask = {
    questionsList : undefined,
    isRun: false,
    currentQuestion: undefined,
    answerContainer: undefined,
    questionText: undefined,
    questtionImage: undefined,
    timerContainer:undefined,
    questionSet: function(question){
        this.timerContainer.innerHTML = ''
        this.currentQuestion = question
        this.questionText.innerHTML = question.question
        if(question.img != '' || question.img != NaN || question.img != undefined){
            this.questtionImage.style.display = 'block'
            this.questtionImage.style.backgroundImage = `url('./ProjectData/QuizImg/${ question.img}')`
        }else{
            this.questtionImage.style.display = 'none'
        }

        answer_showAnimateButtons(question.answers , 1 , ()=>{
            gameTimer.play(projectData.game_data.questionTime , (time)=>{
                //console.log('timeout')
                this.lose()
            })
        })
    },
    answerListener:function(i){
        if(this.currentQuestion != undefined){
            if(this.currentQuestion.right == i){
                this.right()
            }else this.lose()
            gameTimer.stop()
        }
    },
    right:function(){
        this.currentQuestion = undefined
        //console.log('right')
    },
    lose:function(){
        this.currentQuestion = undefined
        //console.log('false')
    }
}
let gameTimer = {
    isRun:false,
    play:function(time , finishCallback){
        if(this.isRun) return
        this.isRun = true
        let currTime = 0
        let iterId = setInterval(()=>{
            if(!this.isRun){
                clearInterval(iterId)
            }
            else{
                if(currTime > time-1){
                    this.isRun = false
                    finishCallback(time)
                    clearInterval(iterId)
                }
                else this.timeChangeEvent(currTime)
            }
            currTime++;
        } , 1000)
    },
    stop:function(){
        this.isRun = false
    },
    timeChangeEvent: function(time){
        gameTask.timerContainer.innerHTML = 'Осталось '+ (projectData.game_data.questionTime-time-1) + 'c'
    }
}


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


    gameTask.isRun = false
    gameTask.answerContainer = document.querySelector('#answersList')
    gameTask.questionText = document.querySelector('#questionContainer')
    gameTask.timerContainer = document.querySelector('#gametimer')
    gameTask.questtionImage = document.querySelector('#qestionImg')


    document.querySelector('#menu_play').addEventListener('click' , ()=>{
        if(quiz.length > 1)showHide('#menuFrame' , '#choseFrame')
        else{
            clickCategoryButton(0)
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
    showHide('#menuFrame' , '#gameFrame')
    gameTask.questionsList = quiz[index]    
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

function answer_showAnimateButtons(array , delay, finich=null){
    gameTask.answerContainer.innerHTML = ''
    for(let i = 0 ; i < array.length; i++){
        setTimeout(()=>{
            drawAnswerButton(array[i] , i)
            if(i!= 0) document.querySelector('#answer-' + (i-1)).setAttribute('class' , '')
            if(i == array.length-1) finich()
        } , (i+1)*delay*1000)
    }
}

function drawAnswerButton(item , i){
    gameTask.answerContainer.innerHTML += `
    <button id="answer-${i}" class="buttonAnimation" style='color:${projectData.colors.fontColor};background-color:${projectData.colors.buttonsColor};' onclick="clickAnswer(${i})">${item}</button>
    `
}
function clickAnswer(index){
    gameTask.answerListener(index)
}


window.addEventListener("DOMContentLoaded", (event) => { init() });