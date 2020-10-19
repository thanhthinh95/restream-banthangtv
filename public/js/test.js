$(document).ready(function(){
    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    getInfo(iOS);
});
function getInfo(iOS) {
    $.ajax({
        type: "GET",
        url: `${host}/api/get/?id=${id}`,
        success: function(data) {
            alert(data.status);
            
        }
    });
}