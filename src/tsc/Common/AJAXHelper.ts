namespace BrickyEditor {
    export class $ajax {
        static get(url: string): Promise<any> {
            return new Promise<any>((resolve, reject) => {
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (this.status >= 200 && this.status < 400) {
                            var data = null;
                            try {
                                data = JSON.parse(this.responseText);
                            }
                            catch {
                                data = this.responseText;
                            }

                            try {
                                resolve(data);
                            }
                            catch (ex) {
                                reject(ex);
                            }
                        } else {
                            reject();
                        }
                    }
                };
                request.send();
                request = null;
            });
        }

        static getScript(url: string) {
            return new Promise((resolve, reject) => {
                var script = document.createElement("script");
                var done = false;
                var loaded = function () {
                    if (!done && (!this.readyState ||
                        this.readyState == "loaded" || this.readyState == "complete")) {
                        done = true;
                        resolve();
                    }
                    else {
                        reject();
                    }
                };
                script.onload = loaded;
                (<any>script).onreadystatechange = loaded;

                script.src = url;
                var head = document.getElementsByTagName("head")[0];
                head.appendChild(script);
            });
        }

        // https://stackoverflow.com/a/31556957
        static jsonp(url: string) {
            return new Promise(function (resolve, reject) {
                var id = '_' + Math.round(10000 * Math.random());
                var callbackName = 'jsonp_callback_' + id;
                window[callbackName] = function (data) {
                    delete window[callbackName];
                    var ele = document.getElementById(id);
                    ele.parentNode.removeChild(ele);
                    resolve(data);
                }

                var src = url + '&callback=' + callbackName;
                var script = document.createElement('script');
                script.src = src;
                script.id = id;
                script.addEventListener('error', reject);
                (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script)
            })
        }
    }
}