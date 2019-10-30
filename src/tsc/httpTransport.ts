export const getRequest = (url: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    let request: XMLHttpRequest | null = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) {
          let data = null;
          try {
            data = JSON.parse(this.responseText);
          } catch {
            data = this.responseText;
          }

          try {
            resolve(data);
          } catch (ex) {
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
};

export const loadScriptAsync = (url: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");

    let done = false;
    const scriptDocLoadedHandler = () => {
      const { readyState } = script as {
        readyState?: "loaded" | "complete";
      };

      if (
        done === false &&
        // IE hack
        (readyState === undefined ||
          readyState === "loaded" ||
          readyState === "complete")
      ) {
        done = true;
        resolve();
      } else {
        reject();
      }
    };

    script.onload = scriptDocLoadedHandler;
    // TODO: IE hack, do we really need this, check the IE8+
    if ((script as any).onreadystatechange !== undefined) {
      (script as any).onreadystatechange = scriptDocLoadedHandler;
    }

    script.src = url.indexOf("//") === 0 ? `https:${url}` : url;
    document.head.appendChild(script);
  });
};

// https://stackoverflow.com/a/31556957
export const jsonp = <TResponse>(url: string) => {
  return new Promise<TResponse>((resolve, reject) => {
    const id = "_" + Math.round(10000 * Math.random());
    const callbackName = "jsonp_callback_" + id;
    (window as any)[callbackName] = (data: TResponse) => {
      delete (window as any)[callbackName];
      const element = document.getElementById(id);
      if (element !== null) {
        element.remove();
      }
      resolve(data);
    };

    const src = url + "&callback=" + callbackName;
    const script = document.createElement("script");
    script.src = src;
    script.id = id;
    script.addEventListener("error", reject);
    (
      document.getElementsByTagName("head")[0] ||
      document.body ||
      document.documentElement
    ).appendChild(script);
  });
};
