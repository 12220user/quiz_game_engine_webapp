/*
░██████╗░██╗░░░██╗██╗███████╗  ███████╗███╗░░██╗░██████╗░██╗███╗░░██╗███████╗
██╔═══██╗██║░░░██║██║╚════██║  ██╔════╝████╗░██║██╔════╝░██║████╗░██║██╔════╝
██║██╗██║██║░░░██║██║░░███╔═╝  █████╗░░██╔██╗██║██║░░██╗░██║██╔██╗██║█████╗░░
╚██████╔╝██║░░░██║██║██╔══╝░░  ██╔══╝░░██║╚████║██║░░╚██╗██║██║╚████║██╔══╝░░
░╚═██╔═╝░╚██████╔╝██║███████╗  ███████╗██║░╚███║╚██████╔╝██║██║░╚███║███████╗
░░░╚═╝░░░░╚═════╝░╚═╝╚══════╝  ╚══════╝╚═╝░░╚══╝░╚═════╝░╚═╝╚═╝░░╚══╝╚══════╝

by 12220
Version 1.0.0.2 realise
actual version https://github.com/12220user/quiz_game_engine_webapp
documentation - in progress
*/

let addManager = {
    canShowAd: true,
    review:function(){
        ysdk.feedback.canReview()
        .then(({ value, reason }) => {
            if (value) {
                ysdk.feedback.requestReview()
                    .then(({ feedbackSent }) => {
                        console.log(feedbackSent);
                    })
            } else {
                console.log(reason)
            }
        })
    },
    showInterstitial: function(callback) {
        MuteAudio(true)
        if(!this.canShowAd){
            callback()
            MuteAudio(false)
            return
        }
        this.canShowAd = false
        ysdk.adv.showFullscreenAdv({
            callbacks:{
                onClose: function(w){callback();MuteAudio(false)}
            },
            onError:function(e){callback()}
        })
        setTimeout(() => { this.canShowAd = true }, 1000 * 60 * 3)
    },
    initMobileStyle: function() {
        if (window.orientation !== undefined || window.innerHeight <= 722) {
            // это мобильный браузер 
            if(document.querySelector('#mstyle') == null){
                console.log(1)
                document.querySelector('head').innerHTML += `<link id='mstyle' rel="stylesheet" href="./TemplateData/m.style.css">`
            }
        }
        else{
            console.log(2)
            if(document.querySelector('#mstyle') != null){
                console.log(3)
                document.querySelector('#mstyle').remove()
            }
        }
    }
}

let bgAudioPlayer = undefined
let gameTask = {
    currentRecord: 0,
    categoryIndex: 0,
    questionsList: undefined,
    isRun: false,
    canSetAnswer: false,
    currentQuestion: undefined,
    answerContainer: undefined,
    questionText: undefined,
    questtionImage: undefined,
    timerContainer: undefined,
    frames: {
        gameFrame: undefined,
        rightAnswerFrame: undefined,
        winFrame: undefined,
        loseFrame: undefined,
        setState: function(type) {
            if (this.gameFrame == undefined) this.gameFrame = document.querySelector('#quizGame')
            if (this.rightAnswerFrame == undefined) this.rightAnswerFrame = document.querySelector('#quizSuccsec')
            if (this.winFrame == undefined) this.winFrame = document.querySelector('#quizResultGameWin')
            if (this.loseFrame == undefined) this.loseFrame = document.querySelector('#quizResultGameLose')

            let curr = 0
            let array = [this.gameFrame, this.rightAnswerFrame, this.winFrame, this.loseFrame]
            if (type == 'game') curr = 0
            if (type == 'right') curr = 1
            if (type == 'win') curr = 2
            if (type == 'lose') curr = 3

            for (let i = 0; i < array.length; i++) {
                if (curr == i) {
                    array[i].classList.remove('subHide')
                } else {
                    array[i].classList.add('subHide')
                }
            }
        }
    },
    questionSet: function(question) {
        this.timerContainer.innerHTML = ''
        this.currentQuestion = question
        let right = question.answers[question.right]
        //unsort answers
        this.currentQuestion.answers = shuffle(this.currentQuestion.answers)
        //console.log('right - ' + question.right)
        for(let i = 0; i < question.answers.length; i++){
            if(right == this.currentQuestion.answers[i]){
                this.currentQuestion.right = i
                //console.log(i)
            }
        }
        //console.log('n_right - ' + this.currentQuestion.right)

        this.questionText.innerHTML = this.currentQuestion.question
        if (this.currentQuestion.img != '' || this.currentQuestion.img != NaN || this.currentQuestion.img != undefined) {
            this.questtionImage.style.display = 'block'
            this.questtionImage.style.backgroundImage = `url('./ProjectData/QuizImg/${ this.currentQuestion.img}')`
        } else {
            this.questtionImage.style.display = 'none'
        }

        this.canSetAnswer = false
        answer_showAnimateButtons(this.currentQuestion.answers, 1, () => {
            this.canSetAnswer = true
            gameTimer.play(projectData.game_data.questionTime, (time) => {
                //console.log('timeout')
                this.lose()
            })
        })
    },
    answerListener: function(i) {
        if (this.currentQuestion != undefined) {
            if (this.currentQuestion.right == i) {
                this.right()
            } else this.lose()
            gameTimer.stop()
        }
    },
    right: function() {
        this.currentQuestion = undefined
            //console.log('right')
        this.currentRecord += 1
        //console.log(this.currentRecord)
            // next question
        if (this.currentRecord < this.questionsList.length) {
            this.frames.setState('right')
            customSimpleTimer.play(projectData.game_data.questionStepTime, '#next_question_timer', () => {
                this.frames.setState('game')
                this.questionSet(this.questionsList[this.currentRecord])
            })
        }
        // game won
        else {
            let isNew = record.set(this.categoryIndex , this.currentRecord)
            //console.log( quiz[this.categoryIndex].category)
            if(gameTimer.isRun) gameTimer.stop()
            document.querySelector('#category_win_text').innerHTML = quiz[this.categoryIndex].category
            this.frames.setState('win')
            this.isRun = false
        }
    },
    lose: function() {
        document.querySelector('#lose_record_text').innerHTML = `${this.currentRecord}/${this.questionsList.length}`
        document.querySelector('#lose_record_pesent').innerHTML = `${Math.round((this.currentRecord/this.questionsList.length)*100)}%`
        let isNew = record.set(this.categoryIndex , this.currentRecord)
        //console.log(isNew)
        this.currentQuestion = undefined
            //console.log('false')
        this.frames.setState('lose')
        if (gameTimer.isRun) gameTimer.stop();
        this.isRun = false;
        categoryIndex = NaN
    },
    StartGame: function(category) {
        if (this.isRun) return
        this.currentRecord = 0;
        this.isRun = true
        this.categoryIndex = category

        // сортировка вопросов
        this.questionsList = shuffle(quiz[category].questions).sort(x => x.hard)

        // запуск игры
        this.frames.setState('game')
        this.questionSet(this.questionsList[0])
    }
}
let gameTimer = {
    isRun: false,
    play: function(time, finishCallback) {
        if (this.isRun) return
        this.isRun = true
        this.timeChangeEvent(0)
        let currTime = 0
        let iterId = setInterval(() => {
            if (!this.isRun) {
                clearInterval(iterId)
            } else {
                if (currTime > time - 1) {
                    this.isRun = false
                    finishCallback(time)
                    clearInterval(iterId)
                } else this.timeChangeEvent(currTime)
            }
            currTime++;
        }, 1000)
    },
    stop: function() {
        this.isRun = false
    },
    timeChangeEvent: function(time) {
        gameTask.timerContainer.innerHTML = 'Осталось ' + (projectData.game_data.questionTime - time - 1) + 'c'
    }
}

let customSimpleTimer = {
    play: function(time, containerSelector, callback) {
        let container = document.querySelector(containerSelector)
        container.innerHTML = time
        setTimeout(() => {
            time -= 1
            if (time > 0) {
                this.action(time, container)
                this.play(time, containerSelector, callback)
            } else {
                callback()
            }
        }, 1000)
    },
    action: function(value, container) {
        container.innerHTML = value
    }
}


// game start logic
function init() {
    console.log(`
🅼🅰🅳🅴 🅸🅽

█▀█ █░█ █ ▀█   █▀▀ █▄░█ █▀▀ █ █▄░█ █▀▀
▀▀█ █▄█ █ █▄   ██▄ █░▀█ █▄█ █ █░▀█ ██▄
    `)

    window.onblur = onBlurGame
    window.onfocus = onFocusGame
        // load project data
    document.addEventListener('click', () => {
        //if (bgAudioPlayer != undefined) {
        //    bgAudioPlayer.play()
        //}
    })


    gameTask.frames.setState('game')

    document.getElementById('gameTitle').innerHTML = localize(projectData.game_data.Title)
    document.getElementById('gameTitle').style.color = projectData.colors.fontColor
    document.querySelector('.background').style.filter = 'blur(' + projectData.game_data.bgBlurSize + 'px)'
    document.querySelector('#choseFrame').style.backgroundColor = projectData.colors.choseFrameColor
    document.querySelector('#recordFrame').style.backgroundColor = projectData.colors.recordFrameColor


    gameTask.isRun = false
    gameTask.answerContainer = document.querySelector('#answersList')
    gameTask.questionText = document.querySelector('#questionContainer')
    gameTask.timerContainer = document.querySelector('#gametimer')
    gameTask.questtionImage = document.querySelector('#qestionImg')


    document.querySelector('#menu_play').addEventListener('click', () => {
        if (quiz.length > 1) showHide('#menuFrame', '#choseFrame')
        else {
            clickCategoryButton(0)
        }
    })
    document.querySelector('#chose_backmenu').addEventListener('click', () => { showHide('#choseFrame', '#menuFrame') })
    document.querySelector('#record_backmenu').addEventListener('click', () => { showHide('#recordFrame', '#menuFrame') })
    document.querySelector('#menu_record').addEventListener('click', () => { showHide('#menuFrame', '#recordFrame'); recordDraw() })
    document.querySelector('#settings_backmenu').addEventListener('click', () => { showHide('#settingsFrame', '#menuFrame') })

    if (!projectData.game_data.useLocalization && !projectData.game_data.isPlayMusick) {
        document.getElementById('menu_settings').style.display = 'none'
    }
    document.querySelector('#menu_settings').addEventListener('click', () => { showHide('#menuFrame', '#settingsFrame') })

    // category add buttons
    categoryButtonContainer = document.getElementById('categorybutton')
    drawCategory()


    //set all block style
    let alltext = document.getElementsByClassName('text')
    for (let i = 0; i < alltext.length; i++)
        alltext[i].style.color = projectData.colors.fontColor
    let buttons = document.getElementsByTagName('button')
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = projectData.colors.buttonsColor
        buttons[i].style.color = projectData.colors.fontColor
    }
    if (projectData.game_data.isPlayMusick) {
        let slider = document.querySelector('#volume')
        slider.value = save.get('VOLUME' , 50)
        volumeSize = slider.value/100
        //bgAudioPlayer = new Audio('./ProjectData/bgAudio.mp3')
        //bgAudioPlayer.volume = parseFloat(slider.value/100)
        //bgAudioPlayer.onended = function() { bgAudioPlayer.play() }
        // web audio api
        setTimeout(()=>{
            loadSound('./ProjectData/bgAudio.mp3')
            setVolume(slider.value/100)
        },3500)

        slider.addEventListener('input' , (value)=>{
            value = slider.value
            save.set('VOLUME' , value)
            setVolume(value/100)
            //bgAudioPlayer.volume = parseFloat(value/100)
        })
    }
    //bgAudioPlayer.autoplay = true
}

function drawCategory() {
    let categoryButtonContainer = document.getElementById('categorybuttons')
    for (let i = 0; i < quiz.length; i++) {
        categoryButtonContainer.innerHTML += drawCategoryButton(i)
    }
}

function drawCategoryButton(index) {
    return `
        <button onclick="clickCategoryButton(${index})">${quiz[index].category}</button>
    `
}

function clickCategoryButton(index) {
    if(quiz.length == 1)showHide('#menuFrame', '#gameFrame')
    else showHide('#choseFrame' , '#gameFrame')
    gameTask.questionsList = quiz[index]
    console.log(index)
    gameTask.StartGame(index)
}

function onBlurGame(event) {
    //if (bgAudioPlayer != undefined) bgAudioPlayer.pause()
    MuteAudio(true)
}

function onFocusGame(event) {
    MuteAudio(false)
    //if (bgAudioPlayer != undefined) bgAudioPlayer.play()
}

function showHide(hide, show, classData = 'frame') {
    document.querySelector(hide).setAttribute('class', classData + ' hide')
    document.querySelector(show).setAttribute('class', classData)
}

function recordDraw() {
    let container = document.querySelector('#recordContainer')
    container.innerHTML = ''
    let a = 0 , b = 0
    for(let i = 0; i< quiz.length; i++){
        container.innerHTML += `<div class="recordObj" style="color:${projectData.colors.fontColor};">
        <div class="Name text">${quiz[i].category}</div>
        <div class="RecordValue text">${record.get(i)}/${quiz[i].questions.length}</div>
    </div>`
        a+= quiz[i].questions.length
        b+= record.get(i)
    }
    let result = Math.round(100*b/a)
    document.querySelector('#game_r_per').innerHTML = result
}

function answer_showAnimateButtons(array, delay, finich = null) {
    gameTask.answerContainer.innerHTML = ''
    for (let i = 0; i < array.length; i++) {
        setTimeout(() => {
            drawAnswerButton(array[i], i)
            if (i != 0) document.querySelector('#answer-' + (i - 1)).setAttribute('class', '')
            if (i == array.length - 1) finich()
        }, (i + 1) * delay * 1000)
    }
}

function drawAnswerButton(item, i) {
    gameTask.answerContainer.innerHTML += `
    <button id="answer-${i}" class="buttonAnimation" style='color:${projectData.colors.fontColor};background-color:${projectData.colors.buttonsColor};' onclick="clickAnswer(${i})">${item}</button>
    `
}

function clickAnswer(index) {
    if (gameTask.canSetAnswer) gameTask.answerListener(index)
}

function goToMenu() {
    addManager.showInterstitial(function(){})
    addManager.review()
    gameTask.frames.setState('game')
    showHide("#gameFrame", "#menuFrame")
}

function restartGame() {
    addManager.showInterstitial(()=>{
        if (gameTask.categoryIndex != NaN || gameTask.categoryIndex != undefined) gameTask.StartGame(gameTask.categoryIndex)
    })
}

function shuffle(array) {
    return array.sort(x => Math.random() - 0.5);
}


window.addEventListener("DOMContentLoaded", (event) => { 
    addManager.initMobileStyle()
    init() 
});
addEventListener('resize' , (event)=>{
    addManager.initMobileStyle()
})