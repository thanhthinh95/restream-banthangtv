function generateQuality(quality,link) {
    var m3u8 = "";
    switch(quality) {
        case "360p":
            m3u8 = "#EXT-X-STREAM-INF:BANDWIDTH=500000,RESOLUTION=480x360\n";
            break;
        case "480p":
            m3u8 = "#EXT-X-STREAM-INF:BANDWIDTH=750000,RESOLUTION=854x480\n";
            break;
        case "720p":
            m3u8 = "#EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=1280x720\n";
            break;
        case "1080p":
            m3u8 = "#EXT-X-STREAM-INF:BANDWIDTH=3000000,RESOLUTION=1920x1080\n";
            break;
    }
    m3u8 += `${link}\n`;
    return m3u8;
}
function generateHls(data) {
    if(!id) id = getParams("id");
    var hls = "#EXTM3U\n";
    for(var i=0;i<data.length;i++) {
        let check = "";
        let m3u8 = `#EXTM3U\n`;
        m3u8 += `#EXT-X-VERSION:5\n`;
        m3u8 += `#EXT-X-TARGETDURATION:12\n`;
        m3u8 += `#EXT-X-MEDIA-SEQUENCE:0\n`;
        for(var j=0;j<data[i].file.length;j++) {
            m3u8 += `#EXT-X-BYTERANGE:${data[i].byterange[j]}\n`;
            if(check != data[i].file[j]) {
                m3u8 += `#EXT-X-DISCONTINUITY\n`;
            }
            check = data[i].file[j];
            m3u8 += `#EXTINF:${data[i].extinf[j]}\n`;
            m3u8 += `${host}/api/chunks/${id}/${data[i].quality}/${data[i].file[j]}\n`;
        }
        m3u8 += `#EXT-X-ENDLIST`;
        var link = URL.createObjectURL(new Blob([m3u8], {
            type: "application/x-mpegURL"
        }));
        hls += `${generateQuality(data[i].quality,link)}`;
    }
    var linkHLS = URL.createObjectURL(new Blob([hls], {
        type: "application/x-mpegURL"
    }));
    initPlayer(linkHLS);
}
function getParams(name,url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}
function getInfo() {
    if(!id) id = getParams("id");
    $.ajax({
        type: "GET",
        url: `${host}/api/get/?id=${id}`,
        success: function(data) {
            if(data.status == 1) {
                generateHls(data.data);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.msg
                });
            }
        }
    });
}
function initPlayer(link) {
    var player = jwplayer("mediaplayer");
    player.setup({
        playbackRateControls: [0.75, 1, 1.25, 1.5],
        key: "MBvrieqNdmVL4jV0x6LPJ0wKB/Nbz2Qq/lqm3g==",
        autostart: true,
        controls: true,
        volume: 75,
        primary: "html5",
        skin: {
            "controlbar": {
                "background": "rgba(0,0,0,0)",
                "icons": "rgba(255,255,255,0.8)",
                "iconsActive": "#FFFFFF",
                "text": "#F2F2F2"
            },
            "menus": {
                "background": "#333333",
                "text": "rgba(255,255,255,0.8)",
                "textActive": "#FFFFFF"
            },
            "timeslider": {
                "progress": "#F2F2F2",
                "rail": "rgba(255,255,255,0.3)"
            },
            "tooltips": {
                "background": "#FFFFFF",
                "text": "#000000"
            }
        },
        stretching: "uniform",
        width: "100%",
        height: "100%",
        allowfullscreen: true,
        allowscriptaccess: "always",
        file: link,
        type: "hls"
    });
}
var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.userAgent);
if(!iOS) {
    getInfo();
} else {
    if(!id) id = getParams("id");
    initPlayer(`${host}/hls/${id}.m3u8`);
}
//check f12
(function () {
	'use strict';

	const devtools = {
		isOpen: false,
		orientation: undefined
	};

	const threshold = 160;

	const emitEvent = (isOpen, orientation) => {
		window.dispatchEvent(new CustomEvent('devtoolschange', {
			detail: {
				isOpen,
				orientation
			}
		}));
	};

	setInterval(() => {
		const widthThreshold = window.outerWidth - window.innerWidth > threshold;
		const heightThreshold = window.outerHeight - window.innerHeight > threshold;
		const orientation = widthThreshold ? 'vertical' : 'horizontal';

		if (
			!(heightThreshold && widthThreshold) &&
			((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
		) {
			if (!devtools.isOpen || devtools.orientation !== orientation) {
				emitEvent(true, orientation);
			}

			devtools.isOpen = true;
			devtools.orientation = orientation;
		} else {
			if (devtools.isOpen) {
				emitEvent(false, undefined);
			}

			devtools.isOpen = false;
			devtools.orientation = undefined;
		}
	}, 500);

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = devtools;
	} else {
		window.devtools = devtools;
	}
})();
window.addEventListener('devtoolschange', event => {
    var debug = getParams("debug");
    if(event.detail.isOpen && !debug) window.location.assign(redirect);
});
$(document).keydown(function (event) {
    if (event.keyCode == 123) {
        return false;
    } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {      
        return false;
    }
});