const loadScript = Symbol('loadScript');

class googleCharts {
    [loadScript](lang) {
        if (!this.scriptPromise) {
            this.scriptPromise = new Promise((resolve) => {
                const body = document.getElementsByTagName('body')[0]
                const script = document.createElement('script')
                script.type = 'text/javascript'
                script.onload = function () {
                    GoogleCharts.api = window.google
                    if (lang)
                        GoogleCharts.api.charts.load('current', {'packages': ['corechart', 'table'], language: lang});
                    else
                        GoogleCharts.api.charts.load('current', {'packages': ['corechart', 'table'], language: 'en'});
                  GoogleCharts.api.charts.setOnLoadCallback(() => {
                        resolve()
                    })
                }
                script.src = 'https://www.gstatic.com/charts/loader.js'
                body.appendChild(script)
            })
        }
        return this.scriptPromise
    }

    load(callback, type, lang) {
        return this[loadScript](lang).then(() => {
            if (type) {
                if(!Array.isArray(type)) {
                    type=[type]
                }
                this.api.charts.load('current', {'packages': type})
                this.api.charts.setOnLoadCallback(callback)
            } else {
                callback()
            }
        })
    }
}

export let GoogleCharts = new googleCharts();

if (module.hot) {
    module.hot.accept();
}
