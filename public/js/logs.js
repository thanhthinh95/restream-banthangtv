var rows = 0;
function clearLog() {
    rows = 0;
    $(".CodeMirror-code").html("");
}
function addRow(text,type="") {
    if(rows > 1000 ) clearLog();
    rows++;
    var allow = ["debug","info","warning","error","assert"];
    if(!allow.includes(type)) type = "keyword";
    $(".CodeMirror-activeline").removeClass("CodeMirror-activeline");
    $(".CodeMirror-code").append(`<div class="CodeMirror-activeline" style="position: relative;">
        <div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">${rows}</div></div>
        <pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span class="cm-${type}">${text}</span></span></pre>
    </div>`);
    //scroll
    var scrolltop = Number($('.CodeMirror-scroll')[0].scrollHeight) - Number($('.CodeMirror-scroll')[0].clientHeight);
    $('.CodeMirror-scroll').scrollTop(scrolltop);
}
$(document).ready(function() {
    var socket = io.connect();
    socket.on("connect",function(){
        socket.on("logs",(logs) => {
            addRow(logs.msg,logs.type);
        })
    });
});