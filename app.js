var wordCount = 0
var charCount = 0
onload = (e) => {
    wordCount = getWordCount()
    charCount = getCharCount()
    setCount()
}

function changed() {
    localStorage.setItem("story", document.getElementById("story").value.split("\n").join("\\n"))
    wordCount = getWordCount()
    charCount = getCharCount()
    setCount()
}
var charQ = false
function setCount() {
    if (charQ) {
        document.getElementsByClassName("count")[0].innerText = charCount + " characters"
    } else {
        document.getElementsByClassName("count")[0].innerText = wordCount + " words"
    }
}

function char() {
    charQ = !charQ
    setCount()
}

function getWordCount() {
    if (document.getElementById("story").value.replaceAll("\n", " ").match(/([0-9a-zA-Z ])/g) != null) {
        countStr = document.getElementById("story").value.replaceAll("\n", " ").match(/([0-9a-zA-Z ])/g).join("")
        while (countStr.includes("  ")) {
            countStr = countStr.replaceAll("  ", " ")
        }
        if (countStr.endsWith(" ")) {
            countStr = countStr.slice(0, -1)
        }
        return countStr.split(" ").length
    } else {
        return 0
    }
}
function getCharCount() {
    return document.getElementById("story").value.length
}

function titleChanged() {
    localStorage.setItem("title", document.getElementById("title").value)
}

if (localStorage.getItem("story")) {
    document.getElementById("story").value = localStorage.getItem("story").replaceAll("\\n", "\n")
}

if (localStorage.getItem("title")) {
    document.getElementById("title").value = localStorage.getItem("title")
}

function insertTextAtCursor(el, text) {
    var val = el.value, endIndex, range, doc = el.ownerDocument;
    if (typeof el.selectionStart == "number"
            && typeof el.selectionEnd == "number") {
        endIndex = el.selectionEnd;
        el.value = val.slice(0, endIndex) + text + val.slice(endIndex);
        el.selectionStart = el.selectionEnd = endIndex + text.length;
    } else if (doc.selection != "undefined" && doc.selection.createRange) {
        el.focus();
        range = doc.selection.createRange();
        range.collapse(false);
        range.text = text;
        range.select();
    }
}

document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === 's' || event.key === 'S')) {
        event.preventDefault();
    }
    if (event.key == "Tab") {
        event.preventDefault()
        if(document.activeElement.value != undefined) {
            insertTextAtCursor(document.activeElement, "    ")
        }
    }
});

function dynamic_text() {
    return `[This document was written using Tidbit.]
${document.getElementById("title").value}
------
${document.getElementById("story").value}`;
}

function download_file(name, contents, mime_type) {
    mime_type = mime_type || "text/plain";

    var blob = new Blob([contents], {type: mime_type});

    var dlink = document.createElement('a');
    dlink.download = name;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function(e) {
        // revokeObjectURL needs a delay to work properly
        var that = this;
        setTimeout(function() {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };

    dlink.click();
    dlink.remove();
}