class ScreenSwitch {
    constructor(classTagToHide = 'hide') {
        this.screens = []
        this.classSwitch = classTagToHide
        this.lastScreen = undefined
        this.currentScreen = undefined
    }

    AddScreen(name, html) {
        this.screens.push({ name: name, html: html })
    }

    ViewOnly(name) {
        if (this.screens.length > 0) {
            this.screens.forEach(ellement => {
                this._setVisible(ellement.name.toLowerCase() == name.toLowerCase(), ellement)
            })
        }
    }

    View(name) {
        let ell = this.screens.find(x => x.name.toLowerCase() == name.toLowerCase())
        if (ell) this._setVisible(true, ell)
    }

    Close(name) {
        let ell = this.screens.find(x => x.name.toLowerCase() == name.toLowerCase())
        if (ell) this._setVisible(false, ell)
    }

    _setVisible(show, ellement) {
        if (show) {
            this.lastScreen = this.currentScreen
            this.currentScreen = ellement.name
        }
        if (show && ellement.html.classList.contains(this.classSwitch)) {
            ellement.html.classList.remove(this.classSwitch)
        } else {
            ellement.html.classList.add(this.classSwitch)
        }
    }
}