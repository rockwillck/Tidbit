var session = ""
for (set of Object.entries(localStorage)) {
    let key = set[0]
    if (!key.endsWith("Title") && !key.endsWith("Story")) {
        let list = document.getElementById("sessions")
        let sessionBtn = document.createElement("button")
        sessionBtn.className = "sessionBtn"
        sessionBtn.innerText = localStorage.getItem(key + "Title")
        sessionBtn.addEventListener("click", () => {
            session = key
            dismiss()
        })
        list.appendChild(sessionBtn)
    }
}

console.log(Object.entries(localStorage).map(x => x[0]))

function newSession() {
    id = Object.entries(localStorage).length
    localStorage.setItem(`S${id}`,"")
    localStorage.setItem(`S${id}Title`,"New Tidbit")
    localStorage.setItem(`S${id}Story`,"")
    session = "S" + id
    dismiss()
}

function dismiss() {
    document.getElementsByClassName("sessionDialogueContainer")[0].style.scale = "0"

    console.log(localStorage.getItem(session + "Story"), localStorage.getItem(session + "Title"), session)
    if (localStorage.getItem(session + "Story")) {
        document.getElementById("story").value = localStorage.getItem(session + "Story").replaceAll("\\n", "\n")
    }

    if (localStorage.getItem(session + "Title")) {
        document.getElementById("title").value = localStorage.getItem(session + "Title")
    }

    wordCount = getWordCount()
    charCount = getCharCount()
    setCount()
}

var wordCount = 0
var charCount = 0

function changed() {
    localStorage.setItem(session+"Story", document.getElementById("story").value.split("\n").join("\\n"))
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
    localStorage.setItem(session+"Title", document.getElementById("title").value)
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

function deleteSesh() {
    if (confirm("Are you sure you want to delete this session? This decision is permanent.") == true) {
        localStorage.removeItem(session)
        localStorage.removeItem(session + "Title")
        localStorage.removeItem(session + "Story")
        window.location.reload()
    }
}