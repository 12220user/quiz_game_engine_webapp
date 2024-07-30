/*
░██████╗░██╗░░░██╗██╗███████╗  ███████╗███╗░░██╗░██████╗░██╗███╗░░██╗███████╗
██╔═══██╗██║░░░██║██║╚════██║  ██╔════╝████╗░██║██╔════╝░██║████╗░██║██╔════╝
██║██╗██║██║░░░██║██║░░███╔═╝  █████╗░░██╔██╗██║██║░░██╗░██║██╔██╗██║█████╗░░
╚██████╔╝██║░░░██║██║██╔══╝░░  ██╔══╝░░██║╚████║██║░░╚██╗██║██║╚████║██╔══╝░░
░╚═██╔═╝░╚██████╔╝██║███████╗  ███████╗██║░╚███║╚██████╔╝██║██║░╚███║███████╗
░░░╚═╝░░░░╚═════╝░╚═╝╚══════╝  ╚══════╝╚═╝░░╚══╝░╚═════╝░╚═╝╚═╝░░╚══╝╚══════╝

by 12220
Version 2.0.0.0  - in work
actual version https://github.com/12220user/quiz_game_engine_webapp
*/
const $ = (query) => { return document.querySelector(query) };

class QuizEngine {
    constructor(configSrc, quizScr) {
        console.log(`
🅼🅰🅳🅴 🅸🅽
█▀█ █░█ █ ▀█   █▀▀ █▄░█ █▀▀ █ █▄░█ █▀▀
▀▀█ █▄█ █ █▄   ██▄ █░▀█ █▄█ █ █░▀█ ██▄
🆅 2.0.0.0
by 12220user
project github: 12220user/quiz_game_engine_webapp`)
        this.htmTabel = {}
        this.htmTabel['start_screen'] = $('start_load_screen')

        // Add screens
        this.screenSwith = new ScreenSwitch()
        this.screenSwith.AddScreen("load", $('#start_load_screen'))

        // Load Config
        this.loader = new file_loader()
        console.log("Load configuration...")
        this._LoadConfigData(() => {
            this.htmTabel.loader_title = $("#load_title")
            this.htmTabel.loader_title.innerHTML = this.config['GameName']

            // Load quiz
            console.log("Load game data(QUIZ objects)...")
            this.quiz_data_array = []
            this._LoadQuizData(this.config['Source']['QuizEnterPoint'], () => {
                this.quiz_data_array = this.quiz_data_array.filter(item => item !== undefined);


                // Load localize sheets
                this.loader.AsuncLoadText(this.config['Source']['LocalizeSheets'], (data)=>{
                    this.localizeData = (data.split("\r\n"))
                    this.localizer = new Localizer(this.localizeData)
                    this.localizer.LocalizeByID("EN")


                    // END load game
                    this.screenSwith.ViewOnly('menu')
                    // set menu data
                    this.SetMenuData()
                })
            })
        })

    }

    // loaded configuration
    async _LoadConfigData(callback) {
        this.config = await this.loader.AsuncLoadJson("./ProjectData/config.json")
        callback()
    }

    // recusive method from load quiz files
    async _LoadQuizData(loadFile, callback) {
        await this.loader.AsuncLoadJson(loadFile).then(obj => {
            if (obj) this.quiz_data_array.push(obj)
            else {
                callback()
                return
            }
            if (obj.nextFile != '') {
                try {
                    this._LoadQuizData(obj.nextFile, callback)
                } catch { callback() }
            } else callback()
        })
    }


    SetMenuData() {
        if (!this.config) return
        $('#menu').style.backgroundImage = `url('${this.config.Source.Images.MenuBackgroundImage}')`
        $('#menu_game_name').innerHTML = this.config.GameName
        $('#menu_game_logotype').style.backgroundImage = `url('${this.config.Source.Images.LogotypeImage}')`
    }
}