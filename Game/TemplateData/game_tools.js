const shuffle = (array) => {
    return array.sort(x => Math.random() - 0.5);
}

const SimpleTimer = {
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