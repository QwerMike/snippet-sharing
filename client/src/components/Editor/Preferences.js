export class Preferences {
    constructor(obj) {
        obj = obj || {};
        this.theme = obj.theme || "monokai";
        this.mode = obj.mode || "plain_text";
        this.enableBasicAutocompletion = obj.enableBasicAutocompletion || true;
        this.enableLiveAutocompletion = obj.enableBasicAutocompletion || false;
        this.fontSize = obj.fontSize || 14;
        this.showGutter = obj.showGutter || true;
        this.showPrintMargin = obj.showPrintMargin || false;
        this.highlightActiveLine = obj.highlightActiveLine || true;
        this.enableSnippets = obj.enableSnippets || false;
        this.showLineNumbers = obj.showLineNumbers || true;
    }
}

export default Preferences;