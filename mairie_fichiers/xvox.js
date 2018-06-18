/* Compatibility Managment */

function getXMLHttpRequest() {
    var xhr = null;
    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest();
        }
    } else {
        console.log("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }
    return xhr;
}

/* Player management */
function Voxi_Audio_timeupdate() {

    if (vocalisation.inPause == true || vocalisation.onPlay == false) {
        return;
    }

    var timePause = 0;
    var toTime = new Date();
    var differenceTravel = 0;

    if (vocalisation.currentTime != null) {
        differenceTravel = toTime.getTime() - vocalisation.currentTime.getTime();
    }
    else
        differenceTravel = 0;

    var currentTime = parseFloat((differenceTravel) / (1000)) - vocalisation.totalPause;

    if (((currentTime + vocalisation.ctime) / vocalisation.totalSoundDuration * 100) <= 100)
        document.getElementById('voxi_time_play').style.width = (currentTime + vocalisation.ctime) / vocalisation.totalSoundDuration * 100+"%";
    if (!vocalisation.st && vocalisation.indexWord < vocalisation.tabPos[vocalisation.voice].length && currentTime >= (vocalisation.tabPos[vocalisation.voice][vocalisation.indexWord].posSound)) {

        if (vocalisation.nextNode) {
            vocalisation.nextNode = false;

            vocalisation.sentences[vocalisation.index_silence].Node.replaceChild(vocalisation.sentences[vocalisation.index_silence].Son, vocalisation.sentences[vocalisation.index_silence].Node.childNodes[vocalisation.savedNode]);
            vocalisation.index_silence++;
            if (typeof vocalisation.sentences[vocalisation.index_silence] != "undefined")
                vocalisation.wordNum = vocalisation.sentences[vocalisation.index_silence].Words.length;

          vocalisation.indexNew = 0;
        }

        if (typeof vocalisation.sentences[vocalisation.index_silence] != "undefined") {
            var fils = vocalisation.sentences[vocalisation.index_silence].Node.childNodes;

            for (var i = 0; i < fils.length; i++) {
                if (fils[i] == vocalisation.sentences[vocalisation.index_silence].Son) {
                    vocalisation.savedNode = i;
                    if (typeof vocalisation.sentences[vocalisation.index_silence].Words != "undefined")
                        vocalisation.sentences[vocalisation.index_silence].Node.replaceChild(vocalisation.sentences[vocalisation.index_silence].Words[vocalisation.indexNew].Node, fils[i]);
                    break;
                }
            }
        }

        if (vocalisation.indexNew > 0) {
            if (typeof vocalisation.sentences[vocalisation.index_silence].Words[vocalisation.indexNew].Node != "undefined") {
                if (vocalisation.sentences[vocalisation.index_silence].Words[vocalisation.indexNew-1].Node.parentNode == vocalisation.sentences[vocalisation.index_silence].Node)
                    vocalisation.sentences[vocalisation.index_silence].Node.replaceChild(vocalisation.sentences[vocalisation.index_silence].Words[vocalisation.indexNew].Node, vocalisation.sentences[vocalisation.index_silence].Words[vocalisation.indexNew-1].Node);
            }
        }

        vocalisation.indexWord++;
        vocalisation.indexNew++;
    }
    if (vocalisation.indexNew >= vocalisation.wordNum) {
           vocalisation.nextNode = true;
    }
}

function Voxi_Audio_Play() {
    if (vocalisation.st == true || (vocalisation.st == false && vocalisation.stat != "sent")) {
        vocalisation.currentTime = new Date();
        vocalisation.timeUpdate = setInterval(function(){ Voxi_Audio_timeupdate() }, 200);
    }
    if (vocalisation.stat != "sent") {
        vocalisation.stat = "sent";
        send_stat();
    }
    if (vocalisation.inPause == true) {
        vocalisation.Resume = new Date();
        var timePause = parseFloat((vocalisation.Resume.getTime() - vocalisation.timePause.getTime())/1000);
        vocalisation.totalPause += timePause;
    }
        vocalisation.inPause = false;
        vocalisation.st = false;
        vocalisation.onPlay = true;
        document.getElementById('player').play();

        document.getElementById('play_img').src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/play_hover_anim.gif";
        document.getElementById('pause_img').src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/pause_hover.png";
        document.getElementById('stop_img').src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/stop_hover.png";
}
    function Voxi_Audio_Pause()
    {
        vocalisation.inPause = true;
        vocalisation.timePause = new Date();
        document.getElementById('player').pause();
        document.getElementById('play_img').src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/play_hover.png";
        document.getElementById('pause_img').src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/pause.png";
    }
    function Voxi_Audio_Stop()
    {
        vocalisation.onPlay = false;
        vocalisation.st = true;
        vocalisation.inPause = false;
        vocalisation.totalPause = 0;
        vocalisation.timePause = null;
        vocalisation.Resume = null;
        document.getElementById('player').pause();
        document.getElementById('player').currentTime=0;

        vocalisation.currentTime = null;
        document.getElementById('voxi_time_play').style.width = "0%";
        clearInterval(vocalisation.timeUpdate);

        document.getElementById("play_img").src = vocalisation.playerImgs.play;
        document.getElementById("play_img").setAttribute("alt", "Ecoutez l\'article");
        document.getElementById("play").setAttribute("title", "Ecoutez l\'article");
        document.getElementById('play_img').src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/play.png";
        document.getElementById('pause_img').src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/pause.png";
        document.getElementById('stop_img').src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/stop.png";

        if (typeof vocalisation.sentences[vocalisation.index_silence] != "undefined")
            vocalisation.sentences[vocalisation.index_silence].Node.replaceChild(vocalisation.sentences[vocalisation.index_silence].Son, vocalisation.sentences[vocalisation.index_silence].Node.childNodes[vocalisation.savedNode]);

        vocalisation.index_silence = 0;
        vocalisation.lastIndexSilence = vocalisation.index_silence;
        vocalisation.indexWord = 0;
        vocalisation.indexNew = 0;
        vocalisation.nextNode = false;
        vocalisation.wordNum = 0;
        vocalisation.savedNode = 0;
        vocalisation.sentences = [];
        vocalisation.ctime = 0;
        spliceText();

        if (!vocalisation.cacheMode) {
            vocalisation.tabLivesIndex = 0;
            vocalisation.currentTime = new Date();
            vocalisation.player = vocalisation.tabLives[vocalisation.tabLivesIndex];
            vocalisation.player.source = vocalisation.player.source.replace("http://ns329423.ip-37-187-116.eu", "https://core.xvox.fr");
            vocalisation.tabPos["fem"] = vocalisation.player.silences;
            vocalisation.silences = vocalisation.player.silences;
            var srcPlaymp = document.getElementById("mp3_src");
            srcPlaymp.src = vocalisation.player.source+".mp3";
            var srcPlaywa = document.getElementById("wav_src");
            srcPlaywa.src = vocalisation.player.source+".wav";
            var playBtn = document.getElementById("play");
            document.getElementById("player").load();
            vocalisation.tabLivesIndex++;
        }

        if (typeof vocalisation.sentences[vocalisation.index_silence] != "undefined")
            vocalisation.wordNum = vocalisation.sentences[vocalisation.index_silence].Words.length;
    }
function Voxi_Audio_Manage()
{
    var xvox_main_div = document.getElementById("playerVoc");
    if (xvox_main_div.style.display == "none" || xvox_main_div.style.display == "") {
        document.getElementById("playerVoc").style.display = 'block';
        document.getElementById("voxi_loaded").style.display = "block";
        xvox_live_voc();
    }
    else
        Voxi_Audio_Play();
}

function Voxi_audio_HL_Play()
{
    document.getElementById('playerHL').play();
    document.getElementById('playHL_img').src = vocalisation.player.playbtn.on;
    document.getElementById('pauseHL_img').src = vocalisation.player.pausebtn.on;
    document.getElementById('stopHL_img').src = vocalisation.player.stopbtn.on;
}

function Voxi_audio_HL_Pause()
{
    document.getElementById('playerHL').pause();
    document.getElementById('pauseHL_img').src = vocalisation.playerImgs.pause;
}

function Voxi_audio_HL_Stop()
{
    document.getElementById('playerHL').pause();
    document.getElementById('playerHL').currentTime=0;
    vocalisation.index_silence = 0;
    document.getElementById('playHL_img').src = vocalisation.playerImgs.play;
    document.getElementById('pauseHL_img').src = vocalisation.playerImgs.pause;
    document.getElementById('stopHL_img').src = vocalisation.playerImgs.stop;
}

/* Core */

function selColor(color, motif, elem) {
    if (motif == "sentence") {
        if (vocalisation.currentSenColored != null) {
            removeClassName(vocalisation.currentSenColored, 'selectedColor');
            vocalisation.currentSenColored.style.marginTop = "3px";
        }
        else {
            removeClassName(document.getElementById("firstSurbColSe"), 'selectedColor');
            document.getElementById("firstSurbColSe").style.marginTop = "3px";
        }
        elem.className += 'selectedColor';
        elem.style.marginTop = "2px";
        vocalisation.currentSenColored = elem;
        vocalisation.color = color;
    }
    else if (motif == "word") {
        if (vocalisation.currentWorColored != null) {
            removeClassName(vocalisation.currentWorColored, 'selectedColor');
            vocalisation.currentWorColored.style.marginTop = "3px";
        }
        else {
            removeClassName(document.getElementById("firstSurbColWo"), 'selectedColor');
            document.getElementById("firstSurbColWo").style.marginTop = "3px";
        }
        elem.className += 'selectedColor';
        elem.style.marginTop = "2px";
        vocalisation.currentWorColored = elem;
        vocalisation.wordColor = color;
    }
    else if (motif == "text") {
        if (vocalisation.currentTexColored != null) {
            removeClassName(vocalisation.currentTexColored, 'selectedColor');
            vocalisation.currentTexColored.style.marginTop = "3px";
        }
        else {
            removeClassName(document.getElementById("firstSurbColTe"), 'selectedColor');
            document.getElementById("firstSurbColTe").style.marginTop = "3px";
        }
        elem.className += 'selectedColor';
        elem.style.marginTop = "2px";
        vocalisation.currentTexColored = elem;
        vocalisation.textColor = color;
    }
    Voxi_Audio_Stop();
    Voxi_Audio_Play();
}

function setOption(option) {
    if (option == "bold") {
        if (vocalisation.senOpts.fontStyle != null) {
            removeClassName(document.getElementById("surbItalElem"), 'selectedColor');
        }
        if (vocalisation.senOpts.fontWeight == null) {
            document.getElementById("surbBoldElem").className += "selectedColor";
            vocalisation.senOpts.fontWeight = option;
            vocalisation.senOpts.fontStyle = null;
        }
        else {
            removeClassName(document.getElementById("surbBoldElem"), 'selectedColor');
            vocalisation.senOpts.fontWeight = null;
        }
    }
    else if (option == "italic") {
        if (vocalisation.senOpts.fontWeight != null) {
            removeClassName(document.getElementById("surbBoldElem"), 'selectedColor');
        }
        if (vocalisation.senOpts.fontStyle == null) {
            vocalisation.senOpts.fontStyle = option;
            vocalisation.senOpts.fontWeight = null;
            document.getElementById("surbItalElem").className += "selectedColor";
        }
        else {
            removeClassName(document.getElementById("surbItalElem"), 'selectedColor');
            vocalisation.senOpts.fontStyle = null;
        }

    }
    else if (option == "underline") {
        if (vocalisation.senOpts.textDecoration == null) {
            vocalisation.senOpts.textDecoration = option;
            document.getElementById("surbUnderElem").className += "selectedColor";
        }
        else {
            removeClassName(document.getElementById("surbUnderElem"), 'selectedColor');
            vocalisation.senOpts.textDecoration = null;
        }
    }
    Voxi_Audio_Stop();
    Voxi_Audio_Play();
}

function show_menu_player()
{
    document.getElementById("engine_img").src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/engine_on.png";
    var voxi_menu = document.getElementById("voxi_menu");
    if (voxi_menu.style.display == 'none' || voxi_menu.style.display == "")
    {
        document.getElementById("voxi_menu_bg").style.display = "block";
        document.getElementById("voxi_menu_bg").style.backgroundImage  = 'url("https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/bg_engine_new.png")';
        voxi_menu.style.display = 'block';
    }
    else
    {
        document.getElementById("voxi_menu_bg").style.display = "none";
        voxi_menu.style.display = 'none';
        document.getElementById("voxi_menu_bg").style.backgroundImage  = 'none';
    }
}

function xvox_display_player() {
    var pla = document.getElementById('playerVoc');
    if (pla.style.visibility != "visible") {
        pla.style.visibility = "visible";
        document.getElementById("voxi_loaded").style.display = "block";
        //Voxi_Audio_Play();
        xvox_live_voc();
    }
    else {
        pla.style.visibility = "hidden";
        document.getElementById("voxi_loaded").style.display = "none";
    }
     //Voxi_Audio_Play();
}

function hasClass(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function removeClassName(elem, name){
    var remClass = elem.className;
    var re = new RegExp('(^| )' + name + '( |$)');
    remClass = remClass.replace(re, '$1');
    remClass = remClass.replace(/ $/, '');
    elem.className = remClass;
}

function init_player()
{
    var play = '<a onclick="Voxi_Audio_Manage()" accesskey="L" id="xvox_accesskey"></a>';
    play += '<audio id="player">';
    play += '<source id="mp3_src" src="'+(typeof vocalisation.player.source != "undefined" ? vocalisation.player.source : "")+'.mp3" type="audio/mpeg">';
      play += '<source id="wav_src" src="'+(typeof vocalisation.player.source != "undefined" ? vocalisation.player.source : "")+'.wav" type="audio/wav">';
    play += '</audio>';
    play += '<div id="voxi_player_div">';
    play += '<button id="play" title="Ecouter l\'article">';
    play += ' <img id="play_img" src="'+vocalisation.playerImgs.play+'" alt="audio_play"/>';
    play += '</button>';
    play += '</div>';
    play += '<div id="voxi_actions_div">';
    play += '<button id="pause" class="btn_voxi_player" title="Mettre l\'écoute en pause">';
    play += '<img id="pause_img" class="img_btn_player" src="'+vocalisation.playerImgs.pause+'" alt="audio_pause"/>';
    play += '</button>';
    play += '<button id="stop" class="btn_voxi_player" title="Arrêter l\'écoute">';
    play += '<img id="stop_img" class="img_btn_player" src="'+vocalisation.playerImgs.stop+'" alt="audio_stop"/>';
    play += '</button>';
    play += '<div id="voxi_seekbar">';
    play += '<span id="voxi_loaded"></span>';
    play += '<span id="voxi_time_play"></span>';
    play += '</div>';
    play += '<button id="xvox_dl_mp" title="Télécharger le fichier mp3">';
    play += '<img id="xvox_dl_mp_img" src="https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/dlmpIcone.png" alt="Télécharger le fichier mp3"/>';
    play += '</button>';

    play += '<div id="xvox_dl_file_window">';
    play += '<p class="xvox_dl_window_p">Le fichier audio que vous êtes sur le point de télécharger est pour votre usage personnel uniquement.</p>';
    play += '<p class="xvox_dl_window_p">Vous ne pouvez pas le distribuer ou l\'utiliser à  d\'autre fins.</p>';
    //play += '<a href="javascript:void(0);" id="xvox_dl_mp_link" class="xvox_dl_class" role="button">Accepter et télécharger le fichier</a>';
    play += '<a href="'+(typeof vocalisation.player.source != "undefined" ? vocalisation.player.source.replace("/Clients", "/dl") : "")+'.mp3" id="xvox_dl_mp_link" class="xvox_dl_class" role="button">Accepter et télécharger le fichier</a>';
    play += '<a href="javascript:void(0);" role="button" class="xvox_dl_class" id="xvox_close_mp_link">&times;</a>';
    play += '</div>';

    play += '<button id="engine" title="Accéder aux paramètres">';
    play += '<img id="engine_img" src="https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/engine.png" alt="Accéder aux paramètres"/>';
    play += '</button>';
    play += '<button id="close_player" title="Fermer le lecteur">&times;</button>';
    play += '</div>';

    play += '<div id="voxi_menu_bg">';
    play += '<div id="voxi_menu">';
    play += '<a id="voxi_highlight_pop" href="javascript:void(0);" style="color: white;display: block;line-height: 1.5;padding-left: 5px;text-decoration: none;">Surbrillance</a>';
    play += '<a id="voxi_volume_pop" href="javascript:void(0);" style="color: white;display: block;line-height: 1.5;padding-left: 5px;text-decoration: none;">Volume</a>';
    play += '</div>';
    play += '<div id="voxi_highlight_managment">';

    play += '<div style="float:left;text-align:center;height:40px;margin-bottom:5px;">';
    play += '<span style="float: left;width: 100%;color: white;font-size: 12px;padding-top: 2px;padding-bottom: 2px;text-align:center;">Phrases</span>';
    play += '<div class="colorSurb" style="float:left;padding-left:1px;">';
    play += '<a href="javascript:void(0);" id="firstSurbColSe" title="Surbrillance Orange Foncé" class="selectedColor" onclick="selColor(\'darkorange\', \'sentence\', this);" style="display: block;width: 15px;height: 15px;background-color:darkorange;margin: 2px 3px 3px 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" title="Surbrillance Gris Clair" onclick="selColor(\'lightgrey\', \'sentence\', this);" style="display: block;width: 15px;height: 15px;background-color:lightgrey;margin: 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" title="Surbrillance Bleu Clair" onclick="selColor(\'rgb(164, 203, 255)\', \'sentence\', this);" style="display: block;width: 15px;height: 15px;background-color:rgb(164, 203, 255);margin: 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" title="Surbrillance Cyan Clair" onclick="selColor(\'lightcyan\', \'sentence\', this);" style="display: block;width: 15px;height: 15px;background-color:lightcyan;margin: 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" title="Surbrillance Jaune Clair" onclick="selColor(\'lightyellow\', \'sentence\', this);" style="display: block;width: 15px;height: 15px;background-color:lightyellow;margin: 3px;float: left;"></a>';
    play += '</div>';
    play += '</div>';
    play += '<img class="sep_menu_engine" src="https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/sep_menu_engine.png" alt="separateur_menu_engine">';

    play += '<div style="float:left;text-align:center;height:40px;margin-bottom:5px;">';
    play += '<span style="float: left;width: 100%;text-align: center;color: white;font-size: 12px;padding-top: 2px;padding-bottom: 2px;">Mots</span>';
    play += '<div class="colorSurb" style="float:left;padding-left:1px;">';
    play += '<a href="javascript:void(0);" title="Surbrillance Orange Foncé" onclick="selColor(\'darkorange\', \'word\', this);" style="display: block;width: 15px;height: 15px;background-color:darkorange;margin: 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" title="Surbrillance Gris Clair" onclick="selColor(\'lightgrey\', \'word\', this);" style="display: block;width: 15px;height: 15px;background-color:lightgrey;margin: 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" id="firstSurbColWo" title="Surbrillance Bleu Clair" class="selectedColor" onclick="selColor(\'rgb(164, 203, 255)\', \'word\', this);" style="display: block;width: 15px;height: 15px;background-color:rgb(164, 203, 255);margin: 2px 3px 3px 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" title="Surbrillance Cyan Clair" onclick="selColor(\'lightcyan\', \'word\', this);" style="display: block;width: 15px;height: 15px;background-color:lightcyan;margin: 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" title="Surbrillance Jaune Clair" onclick="selColor(\'lightyellow\', \'word\', this);" style="display: block;width: 15px;height: 15px;background-color:lightyellow;margin: 3px;float: left;"></a>';
    play += '</div>';
    play += '</div>';
    play += '<img class="sep_menu_engine" src="https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/sep_menu_engine.png" alt="separateur_menu_engine">';

    play += '<div style="float;left;width: 100%;padding-left: 1px;height:45px;overflow: hidden;margin-bottom:5px;">';
    play += '<div style="float:left;width:94%;overflow: hidden;">';
    play += '<span style="float: left;width: 50%;color: white;font-size: 12px;padding-top: 2px;padding-bottom: 2px;padding-left:3px;text-align:left;">Texte</span>';
    play += '<span class="colorSurb" style="float:right;padding-top: 6px;color:white;padding-left:3px;height: 16px;">';
    play += '<a href="javascript:void(0);" id="surbBoldElem" onclick="setOption(\'bold\')" title="Mettre le texte en gras" style="margin-right: 2px;display:block;float:left;height:14px;width:10px;"><img src="https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/bold.png" alt="Surbrillance_Bold" style="height:95%;width: auto;vertical-align: top;"/></a>';
    play += '<a href="javascript:void(0);" id="surbItalElem" onclick="setOption(\'italic\')" title="Mettre le texte en italique" style="margin-right: 2px;display:block;float:left;height:14px;width:10px;"><img src="https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/italic.png" alt="Surbrillance_Bold" style="height: 90%;width: auto;vertical-align: top;"/></a>';
    play += '<a href="javascript:void(0);" id="surbUnderElem" onclick="setOption(\'underline\')" title="Souligner le texte" style="display:block;float:left;height:14px;width:13px;"><img src="https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/underline.png" alt="Surbrillance_Bold" style="height: 95%;width: auto;vertical-align: top;"/></a>';
    play += '</span>';
    play += '</div>';
    play += '<div class="colorSurb" style="float:left;">';
    play += '<a href="javascript:void(0);" title="Surbrillance Orange Foncé" onclick="selColor(\'darkorange\', \'text\', this);" style="display: block;width: 15px;height: 15px;background-color:darkorange;margin: 3px 3px 3px 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" title="Surbrillance Gris Clair" onclick="selColor(\'lightgrey\', \'text\', this);" style="display: block;width: 15px;height: 15px;background-color:lightgrey;margin: 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" title="Surbrillance Bleu Clair" onclick="selColor(\'rgb(164, 203, 255)\', \'text\', this);" style="display: block;width: 15px;height: 15px;background-color:rgb(164, 203, 255);margin: 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" id="firstSurbColTe" title="Surbrillance Noir" class="selectedColor" onclick="selColor(\'black\', \'text\', this);" style="display: block;width: 15px;height: 15px;background-color:black;margin: 2px 3px 3px 3px;float: left;"></a>';
    play += '<a href="javascript:void(0);" title="Surbrillance Jaune Clair" onclick="selColor(\'lightyellow\', \'text\', this);" style="display: block;width: 15px;height: 15px;background-color:lightyellow;margin: 3px;float: left;"></a>';
    play += '</div>';
    play += '</div>';

    play += '</div>';
    play += '<div id="voxi_volume_managment">';
    play += '<div style="position: relative;height: 20px;width: 30px;margin: auto;">';
    play += '<a href="javascript:void(0);" title="Diminuer le son de 25%" id="voxi_less_lvl" class="voxi_manage_lvl" style="color: white;font-size:100%;">-</a>';
    play += '<a href="javascript:void(0);" title="Son à 25%" id="voxi_lvl1" class="voxi_lvl vol_down" style="color: white;font-size:100%;">&nbsp;</a>';
    play += '<a href="javascript:void(0);" title="Son à 50%" id="voxi_lvl2" class="voxi_lvl vol_down" style="color: white;font-size:100%;">&nbsp;</a>';
    play += '<a href="javascript:void(0);" title="Son à 75%" id="voxi_lvl3" class="voxi_lvl vol_down" style="color: white;font-size:100%;">&nbsp;</a>';
    play += '<a  href="javascript:void(0);" title="Son à 100%" id="voxi_lvl4" class="voxi_lvl vol_down" style="color: white;font-size:100%;">&nbsp;</a>';
    play += '<a href="javascript:void(0);" title="Augmenter le son de 25%" id="voxi_more_lvl" class="voxi_manage_lvl" style="color: white;font-size:100%;">+</a>';
    play += '</div>';
    play += '</div>';
    play += '</div>';
    play += '<span class="vocalised_by_voxi">Vocalisé par <a target="_blank" href="http://www.xvox.fr" style="color:darkorange;float: right;margin-left: 2px;text-decoration:none;background: none;">XVox</a></span>';
    document.getElementById("playerVoc").innerHTML = play;
}

function Vocalise()
{
    var srcPlaymp = document.getElementById("mp3_src");
    srcPlaymp.src = vocalisation.player.source+".mp3";
    var srcPlaywa = document.getElementById("wav_src");
    srcPlaywa.src = vocalisation.player.source+".wav";
    var playBtn = document.getElementById("play");
    playBtn.onclick = function(){
       Voxi_Audio_Play();
    }
    document.getElementById("player").load();
    Voxi_Audio_Play();
}

function xvox_vocalise_now(data) {
    vocalisation.indexWord = 0;
    vocalisation.indexNew = 0;
    vocalisation.player = data;
    vocalisation.currentTime = new Date();
    //console.log(vocalisation.player);
    vocalisation.player.source = vocalisation.player.source.replace("http://ns329423.ip-37-187-116.eu", "https://core.xvox.fr");
    vocalisation.tabPos["fem"] = vocalisation.player.silences;
    vocalisation.silences = vocalisation.player.silences;
    //console.log(vocalisation.silences);
    var srcPlaymp = document.getElementById("mp3_src");
    srcPlaymp.src = vocalisation.player.source+".mp3";
    var srcPlaywa = document.getElementById("wav_src");
    srcPlaywa.src = vocalisation.player.source+".wav";
    var playBtn = document.getElementById("play");
    document.getElementById("player").load();
    var pla = document.getElementById('playerVoc');
    pla.style.display = "block";
    if (vocalisation.st == true || (vocalisation.st == false && vocalisation.stat != "sent")) {
        Voxi_Audio_Play();
    }
    else {
        vocalisation.onPlay = true;
        document.getElementById('player').play();
    }
}


/* Highlight management */

function Vocalise_HL(player)
{
    var ndiv = document.getElementById("vhi");
    var pldiv = document.createElement("div");
    pldiv.setAttribute("id", "phldiv");
    ndiv.appendChild(pldiv);

    var vhl = '<a onclick="Voxi_Audio_Manage()" accesskey="L"></a>';
    vhl += '<audio id="playerHL">';
    vhl += '<source id="mp3HL_src" src="'+player.source+'.mp3" type="audio/mpeg">';
    vhl += '<source id="wavHL_src" src="'+player.source+'.wav" type="audio/wav">';
    vhl += '</audio>';
    vhl += '<div id="voxi_player_div_hl">';
    vhl += '<button id="playHL" onclick="Voxi_audio_HL_Play();">';
    vhl += '<img id="playHL_img" src="'+vocalisation.playerImgs.play+'" alt="audio_play">';
    vhl += '</button>';
    vhl += '</div>';
    vhl += '<div id="voxi_actions_div_hl">';
    vhl += '<button id="pauseHL" class="btn_voxi_player" onclick="Voxi_audio_HL_Pause();">';
    vhl += '<img id="pauseHL_img" src="'+vocalisation.playerImgs.pause+'" alt="audio_pause">';
    vhl += '</button>';
    vhl += '<button id="stopHL" class="btn_voxi_player" onclick="Voxi_audio_HL_Stop();">';
    vhl += '<img id="stopHL_img" src="'+vocalisation.playerImgs.stop+'" alt="audio_stop">';
    vhl += '</button>';
    vhl += '<div id="voxi_seekbar_HL">';
    vhl += '<span id="timePlayHL" style="width: 0%;">';
    vhl += '</span>';
    vhl += '</div>';
    vhl += '</div>';
    pldiv.innerHTML = vhl;

    var audioHL = document.getElementById('playerHL');
        audioHL.addEventListener("timeupdate", function() {
        document.getElementById('timePlayHL').style.width = audioHL.currentTime / audioHL.duration * 100+"%";
    });

    Voxi_audio_HL_Play();
}

/* Misc */

function escapeHtml(unsafe) {
  return unsafe
     .replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")
     .replace(/Ãƒâ€šÃ‚Â¢/g,"&cent;")
     .replace(/Ãƒâ€šÃ‚Â£/g,"&pound;")
     .replace(/ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬/g,"&euro;")
     .replace(/Ãƒâ€šÃ‚Â¥/g,"&yen;")
     .replace(/Ãƒâ€šÃ‚Â°/g,"&deg;")
     .replace(/Ãƒâ€šÃ‚Â¼/g,"&frac14;")
     .replace(/Ãƒâ€¦Ã¢â‚¬â„¢/g,"&OElig;")
     .replace(/Ãƒâ€šÃ‚Â½/g,"&frac12;")
     .replace(/Ãƒâ€¦Ã¢â‚¬Å“/g,"&oelig;")
     .replace(/Ãƒâ€šÃ‚Â¾/g,"&frac34;")
     .replace(/Ãƒâ€¦Ã‚Â¸/g,"&Yuml;")
     .replace(/Ãƒâ€šÃ‚Â¡/g,"&iexcl;")
     .replace(/Ãƒâ€šÃ‚Â«/g,"&laquo;")
     .replace(/Ãƒâ€šÃ‚Â»/g,"&raquo;")
     .replace(/Ãƒâ€šÃ‚Â¿/g,"&iquest;")
     .replace(/ÃƒÆ’Ã¢â€šÂ¬/g,"&Agrave;")
     .replace(/ÃƒÆ’Ã‚Â/g,"&Aacute;")
     .replace(/ÃƒÆ’Ã¢â‚¬Å¡/g,"&Acirc;")
     .replace(/ÃƒÆ’Ã†â€™/g,"&Atilde;")
     .replace(/ÃƒÆ’Ã¢â‚¬Å¾/g,"&Auml;")
     .replace(/ÃƒÆ’Ã¢â‚¬Â¦/g,"&Aring;")
     .replace(/ÃƒÆ’Ã¢â‚¬ /g,"&AElig;")
     .replace(/ÃƒÆ’Ã¢â‚¬Â¡/g,"&Ccedil;")
     .replace(/ÃƒÆ’Ã‹â€ /g,"&Egrave;")
     .replace(/ÃƒÆ’Ã¢â‚¬Â°/g,"&Eacute;")
     .replace(/ÃƒÆ’Ã… /g,"&Ecirc;")
     .replace(/ÃƒÆ’Ã¢â‚¬Â¹/g,"&Euml;")
     .replace(/ÃƒÆ’Ã…â€™/g,"&Igrave;")
     .replace(/ÃƒÆ’Ã‚Â/g,"&Iacute;")
     .replace(/ÃƒÆ’Ã…Â½/g,"&Icirc;")
     .replace(/ÃƒÆ’Ã‚Â/g,"&Iuml;")
     .replace(/ÃƒÆ’Ã‚Â/g,"&ETH;")
     .replace(/ÃƒÆ’Ã¢â‚¬Ëœ/g,"&Ntilde;")
     .replace(/ÃƒÆ’Ã¢â‚¬â„¢/g,"&Ograve;")
     .replace(/ÃƒÆ’Ã¢â‚¬Å“/g,"&Oacute;")
     .replace(/ÃƒÆ’Ã¢â‚¬Â/g,"&Ocirc;")
     .replace(/ÃƒÆ’Ã¢â‚¬Â¢/g,"&Otilde;")
     .replace(/ÃƒÆ’Ã¢â‚¬â€œ/g,"&Ouml;")
     .replace(/ÃƒÆ’Ã‹Å“/g,"&Oslash;")
     .replace(/ÃƒÆ’Ã¢â€žÂ¢/g,"&Ugrave;")
     .replace(/ÃƒÆ’Ã…Â¡/g,"&Uacute;")
     .replace(/ÃƒÆ’Ã¢â‚¬Âº/g,"&Ucirc;")
     .replace(/ÃƒÆ’Ã…â€œ/g,"&Uuml;")
     .replace(/ÃƒÆ’Ã‚Â/g,"&Yacute;")
     .replace(/ÃƒÆ’Ã…Â¾/g,"&THORN;")
     .replace(/ÃƒÆ’Ã…Â¸/g,"&szlig;")
     .replace(/ÃƒÆ’ /g,"&agrave;")
     .replace(/ÃƒÆ’Ã‚Â¡/g,"&aacute;")
     .replace(/ÃƒÆ’Ã‚Â¢/g,"&acirc;")
     .replace(/ÃƒÆ’Ã‚Â£/g,"&atilde;")
     .replace(/ÃƒÆ’Ã‚Â¤/g,"&auml;")
     .replace(/ÃƒÆ’Ã‚Â¥/g,"&aring;")
     .replace(/ÃƒÆ’Ã‚Â¦/g,"&aelig;")
     .replace(/ÃƒÆ’Ã‚Â§/g,"&ccedil;")
     .replace(/ÃƒÆ’Ã‚Â¨/g,"&egrave;")
     .replace(/ÃƒÂ©/g,"&eacute;")
     .replace(/ÃƒÆ’Ã‚Âª/g,"&ecirc;")
     .replace(/ÃƒÆ’Ã‚Â«/g,"&euml;")
     .replace(/ÃƒÆ’Ã‚Â¬/g,"&igrave;")
     .replace(/ÃƒÆ’Ã‚Â­/g,"&iacute;")
     .replace(/ÃƒÆ’Ã‚Â®/g,"&icirc;")
     .replace(/ÃƒÆ’Ã‚Â¯/g,"&iuml;")
     .replace(/ÃƒÆ’Ã‚Â°/g,"&eth;")
     .replace(/ÃƒÆ’Ã‚Â±/g,"&ntilde;")
     .replace(/ÃƒÆ’Ã‚Â²/g,"&ograve;")
     .replace(/ÃƒÆ’Ã‚Â³/g,"&oacute;")
     .replace(/ÃƒÆ’Ã‚Â´/g,"&ocirc;")
     .replace(/ÃƒÆ’Ã‚Âµ/g,"&otilde;")
     .replace(/ÃƒÆ’Ã‚Â¶/g,"&ouml;")
     .replace(/ÃƒÆ’Ã‚Â¸/g,"&oslash;")
     .replace(/ÃƒÆ’Ã‚Â¹/g,"&ugrave;")
     .replace(/ÃƒÆ’Ã‚Âº/g,"&uacute;")
     .replace(/ÃƒÆ’Ã‚Â»/g,"&ucirc;")
     .replace(/ÃƒÆ’Ã‚Â¼/g,"&uuml;")
     .replace(/ÃƒÆ’Ã‚Â½/g,"&yacute;")
     .replace(/ÃƒÆ’Ã‚Â¾/g,"&thorn;")
     .replace(/"/g, "&quot;")
     .replace(/'/g, "&#039;")
     .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢/g, "&#039;");
}

function createTabSurb(tabSWords, textNode) {
    var ctext = textNode;
    var indi = 0, indj = 0, cword = '', rsentence = '', bsentence = '';

    ctext = ctext.replace(/\xA0/g,' ');
    //console.log(encodeURIComponent(ctext));
    for (var ii = 0; ii < ctext.length; ii++) {
        //console.log("T :"+encodeURIComponent(ctext[ii])+": T");
        if (ctext[ii] == ' ' || ctext[ii] == '&nbsp;' || encodeURIComponent(ctext[ii]) == '%E2%80%89') {
            //console.log(ctext.substr(indj, (ii - indj)).trim());
            cword = ctext.substr(indj, (ii - indj));
            rsentence = ctext.substr(ii, ctext.length - ii);
            //console.log("//"+cword+"//");
            if (cword != "" && cword != " ") {
                //console.log("Word :"+cword);
                    if (indj == 0) {
                        var fwo = document.createElement("xv:SPAN");
                        fwo.style.backgroundColor = vocalisation.wordColor;
                        fwo.style.color = vocalisation.textColor;
                        (vocalisation.senOpts.fontWeight != null ? fwo.style.fontWeight = vocalisation.senOpts.fontWeight : '');
                        (vocalisation.senOpts.fontStyle != null ? fwo.style.fontStyle = vocalisation.senOpts.fontStyle : '');
                        (vocalisation.senOpts.textDecoration != null ? fwo.style.textDecoration = vocalisation.senOpts.textDecoration : '');
                        fwo.appendChild(document.createTextNode(cword));
                        var Swo = document.createElement("xv:SPAN");
                        //Swo.style.backgroundColor = vocalisation.wordColor;
                        Swo.appendChild(document.createTextNode(rsentence));
                        //console.log(fwo);
                        //console.log(Swo);
                        var test2 = document.createElement("xv:SPAN");
                        test2.style.backgroundColor = vocalisation.color;
                        test2.style.color = vocalisation.textColor;
                        (vocalisation.senOpts.fontWeight != null ? test2.style.fontWeight = vocalisation.senOpts.fontWeight : '');
                        (vocalisation.senOpts.fontStyle != null ? test2.style.fontStyle = vocalisation.senOpts.fontStyle : '');
                        (vocalisation.senOpts.textDecoration != null ? test2.style.textDecoration = vocalisation.senOpts.textDecoration : '');
                        test2.appendChild(fwo);
                        test2.appendChild(Swo);
                        tabSWords.push({"Node" : test2, "Word" : cword});
                    }
                    else {
                        bsentence = ctext.substr(0, indj);
                        rsentence = ctext.substr(ii, ctext.length - ii);
                        var fwo = document.createElement("xv:SPAN");
                        //fwo.style.backgroundColor = vocalisation.wordColor;
                        fwo.appendChild(document.createTextNode(bsentence));
                        var Swo = document.createElement("xv:SPAN");
                        Swo.style.backgroundColor = vocalisation.wordColor;
                        Swo.style.color = vocalisation.textColor;
                        (vocalisation.senOpts.fontWeight != null ? Swo.style.fontWeight = vocalisation.senOpts.fontWeight : '');
                        (vocalisation.senOpts.fontStyle != null ? Swo.style.fontStyle = vocalisation.senOpts.fontStyle : '');
                        (vocalisation.senOpts.textDecoration != null ? Swo.style.textDecoration = vocalisation.senOpts.textDecoration : '');
                        Swo.appendChild(document.createTextNode(cword));
                        var Two = document.createElement("xv:SPAN");
                        //Swo.style.backgroundColor = vocalisation.wordColor;
                        Two.appendChild(document.createTextNode(rsentence));
                        //console.log(fwo);
                        //console.log(Swo);
                        //console.log(Two);
                        var test3 = document.createElement("xv:SPAN");
                        test3.style.backgroundColor = vocalisation.color;
                        test3.style.color = vocalisation.textColor;
                        (vocalisation.senOpts.fontWeight != null ? test3.style.fontWeight = vocalisation.senOpts.fontWeight : '');
                        (vocalisation.senOpts.fontStyle != null ? test3.style.fontStyle = vocalisation.senOpts.fontStyle : '');
                        (vocalisation.senOpts.textDecoration != null ? test3.style.textDecoration = vocalisation.senOpts.textDecoration : '');
                        test3.appendChild(fwo);
                        test3.appendChild(Swo);
                        test3.appendChild(Two);
                        tabSWords.push({"Node" : test3, "Word" : cword});
                    }
                    indi++;
                    indj = ii+1;
            }
        }
    }
    bsentence = ctext.substr(0, indj);
    cword = ctext.substr(indj, (ii - indj));
    if (cword != "" && cword != " ") {
        //console.log("Word :"+cword);
        var fwo = document.createElement("xv:SPAN");
        //fwo.style.backgroundColor = vocalisation.wordColor;
        fwo.appendChild(document.createTextNode(bsentence));
        var Swo = document.createElement("xv:SPAN");
        Swo.style.backgroundColor = vocalisation.wordColor;
        Swo.style.color = vocalisation.textColor;
        (vocalisation.senOpts.fontWeight != null ? Swo.style.fontWeight = vocalisation.senOpts.fontWeight : '');
        (vocalisation.senOpts.fontStyle != null ? Swo.style.fontStyle = vocalisation.senOpts.fontStyle : '');
        (vocalisation.senOpts.textDecoration != null ? Swo.style.textDecoration = vocalisation.senOpts.textDecoration : '');
        Swo.appendChild(document.createTextNode(cword));
        //console.log(fwo);
        //console.log(Swo);
        var test4 = document.createElement("xv:SPAN");
        test4.style.backgroundColor = vocalisation.color;
        test4.style.color = vocalisation.textColor;
        (vocalisation.senOpts.fontWeight != null ? test4.style.fontWeight = vocalisation.senOpts.fontWeight : '');
        (vocalisation.senOpts.fontStyle != null ? test4.style.fontStyle = vocalisation.senOpts.fontStyle : '');
        (vocalisation.senOpts.textDecoration != null ? test4.style.textDecoration = vocalisation.senOpts.textDecoration : '');
        test4.appendChild(fwo);
        test4.appendChild(Swo);
        tabSWords.push({"Node" : test4, "Word" : cword});

        vocalisation.countW += tabSWords.length;
    }
    //console.log(tabSWords);
    return tabSWords;
}

function    classesExceptions(noeud) {
    var classList = ["liens-bas", "datedujour", "breadcrumb", "element-invisible", "contextual-links-wrapper", "tabs"];
    var hasCl = false;
    for (var i = 0; i < classList.length; i++) {
        if (noeud.className.indexOf(classList[i]) > -1) {
            hasCl = true;
            break ;
        }
    }
    return hasCl;
}

function    idExceptions(noeud) {
    var classList = ["bloc-315", "bloc-327", "bloc-311", "bloc-493", "overlay-disable-message"];
    var hasCl = false;
    for (var i = 0; i < classList.length; i++) {
        if (noeud.id == classList[i]) {
            hasCl = true;
            break ;
        }
    }
    return hasCl;
}

function    charExceptions(str) {
    var charExcs = [];
    var re = null;
    for (var i = 0; i < charExcs.length; i++) {
        re = new RegExp(charExcs[i], "g");
        str = str.replace(re, "-");
    }
    return str;
}

function find_nodes(noeud) {
    var node;
    var tabSWords = [];
    var co = 0;
    var sen = '';
    var whitespace = /^\s*$/;
    var fils = noeud.childNodes;
    var nbFils = fils.length;
    var match;
    var senTrim = '';
    var subStrings = [];
    var silent_letters = [":", "-", ","];
    var regex = new RegExp(".{0,}?(?:\\.|!|\\?)(?:(?=\\ [a-zA-Z0-9])|$)", "g");
    var cnode = noeud.nodeName;
    if (typeof cnode != "undefined" && cnode == "A") {
        var pdfPos = noeud.href.lastIndexOf('.pdf');
        if (pdfPos > -1 && pdfPos == (noeud.href.length - 4)) {
            if (vocalisation.pdfs.indexOf(encodeURIComponent(noeud.href)) == -1) {
                vocalisation.pdfs.push({"url" : encodeURIComponent(noeud.href), "node" : noeud});
            }
            var newSrc = "https://core.xvox.fr/readPDF/"+encodeURIComponent(noeud.href);
            //console.log(newSrc);
            var hrefDomain = noeud.href.substr(noeud.href.indexOf("://")+3, noeud.href.length - (noeud.href.indexOf("://")+3));
            hrefDomain = hrefDomain.substr(0, hrefDomain.indexOf("/"));
            //console.log(hrefDomain+" // "+window.location.hostname);
            if (hrefDomain == window.location.hostname) {
                //noeud.href = newSrc;
                noeud.target = "_blank";
            }
        }
    }
    if (((typeof noeud.className == "string" && classesExceptions(noeud) == false) || typeof noeud.className != "string") && (idExceptions(noeud) == false)) {
    if ((noeud.hasAttribute('type') && noeud.getAttribute('type') != "text/javascript") || (!noeud.hasAttribute('type') && noeud.tagName != "SCRIPT")) {
        for(var i = 0; i < nbFils; i++){
            if (fils[i].hasChildNodes()) {
              find_nodes(fils[i]);
            }
            else if (fils[i]){
                sen = fils[i].textContent || fils[i].innerText || '';
                if (!(whitespace.test(sen)) && fils[i].nodeType != 8) {
                    co = 0;
                    sen = sen.trim();
                    senTrim = sen;
                    subStrings = [];
                    while ((match = regex.exec(sen)) != null) {
                        if (match.index === regex.lastIndex) {
                            ++regex.lastIndex;
                        }
                        subStrings.push(match[0]);
                        //console.log("texte : "+senTrim);
                        senTrim = senTrim.substring(match[0].length);
                        co++;
                    }
                    if (senTrim.length > 0) {
                        //console.log("texte : "+senTrim);
                        if (senTrim != ".")
                            subStrings.push(senTrim);
                    }
                    if (co == 0) {
                        if (fils[i]) {
                            if (sen.trim().length < 2) {
                                if (silent_letters.indexOf(sen.trim()) == -1 && encodeURIComponent(sen.trim()) != "%E2%96%A0") {
                                    tabSWords = [];
                                    //console.log("Texte 1 : "+sen);
                                    tabSWords = createTabSurb(tabSWords, sen);

                                    vocalisation.sentences.push({"Node" : fils[i].parentNode, "Son" : fils[i], "Text" : sen, "ClonedNode" : fils[i].cloneNode(true), "Num" : i, "Words" : tabSWords});
                                    vocalisation.content += sen+"\n\n";
                                }
                            }
                            else {
                                if (sen != "**" && sen != "***") {
                                    //console.log("Texte 2 : "+sen);
                                    //sen = sen.trim();
                                    tabSWords = [];
                                    //console.log("Texte 2 : "+sen);
                                    tabSWords = createTabSurb(tabSWords, sen);

                                    vocalisation.sentences.push({"Node" : fils[i].parentNode, "Son" : fils[i], "Text" : sen, "ClonedNode" : fils[i].cloneNode(true), "Num" : i, "Words" : tabSWords});
                                    vocalisation.content += sen+"\n\n";
                                }
                            }
                        }
                    }
                    else {
                        if (subStrings.length == 1) {
                            tabSWords = [];
                            subStrings[0] = subStrings[0].replace(/\u00a0/g, "");
                            //console.log("Texte 3 : "+subStrings[0]);
                            tabSWords = createTabSurb(tabSWords, subStrings[0]);

                            vocalisation.sentences.push({"Node" : fils[i].parentNode, "Son" : fils[i], "Text" : subStrings[0], "ClonedNode" : fils[i].cloneNode(true), "Num" : 0, "Words" : tabSWords});
                            vocalisation.content += subStrings[0] +"\n\n";
                        }
                    else if (subStrings.length > 1) {
                        var ref = document.createElement("SPAN");
                        fils[i].parentNode.replaceChild(ref, fils[i]);
                        for (var j = 0;j < subStrings.length; j++) {
                            var nTextnode = document.createTextNode(subStrings[j]);
                            ref.appendChild(nTextnode);

                            tabSWords = [];
                            //console.log("Texte 4 : "+subStrings[j]);
                            tabSWords = createTabSurb(tabSWords, subStrings[j]);

                            vocalisation.sentences.push({"Node" : ref, "Son" : nTextnode, "Text" : subStrings[j], "ClonedNode" : nTextnode.cloneNode(true), "Num" : j, "Words" : tabSWords});
                            vocalisation.content += subStrings[j] +"\n\n";
                        }
                        //fils[i].parentNode.removeChild(fils[i]);
                    }
                    }
                }
            }
        }
    }
    }
}

function spliceText(text)
{
    var noeud = document.getElementById("content")
    var fils = noeud.childNodes;
    var nbFils = fils.length;
    for(var i = 0; i < nbFils; i++){
    if (fils[i] && fils[i].hasChildNodes())
        find_nodes(fils[i]);
  }
  vocalisation.content = charExceptions(vocalisation.content);
  var llen = vocalisation.sentences.length;
  var currentPacketSize = 0, packetSize = 100, indexTabPacket = 0;
  var tabPackets = [];
  tabPackets[indexTabPacket] = [];
  for (var j = 0; j < llen; j++) {
    if (typeof vocalisation.sentences[j].Text != "undefined") {
        if (currentPacketSize >= packetSize) {
        indexTabPacket++;
        tabPackets[indexTabPacket] = [];
    }
    tabPackets[indexTabPacket].push(vocalisation.sentences[j]);
    currentPacketSize += vocalisation.sentences[j].Text.length;
    }
  }
  vocalisation.liveVocTab = tabPackets;
}

function display_hl(data)
{
    var plh = document.getElementById("phldiv");
    if (plh == null)
        Vocalise_HL(data);
    else
    {
        document.getElementById("wavHL_src").src = data.source+".wav";
        document.getElementById("mp3HL_src").src = data.source+".mp3";
        if (document.getElementById("phldiv") != null)
            document.getElementById("phldiv").style.display = 'table';

        document.getElementById('playerHL').pause();
        document.getElementById('playerHL').currentTime=0;
        document.getElementById("playerHL").load();
        Voxi_audio_HL_Play();
    }
}

function xvox_get_audio_duration(data) {
    var element = document.createElement("audio");
    element.setAttribute("id", "XVOXaudioTMP");
    element.setAttribute("src", data.source.replace("http://ns329423.ip-37-187-116.eu", "https://core.xvox.fr")+".mp3");
    //console.log("GET THIS : "+data.source.replace("http://ns329423.ip-37-187-116.eu", "https://core.xvox.fr")+".mp3");
    document.getElementsByTagName("body")[0].appendChild(element);
    var audioTMP = document.getElementById("XVOXaudioTMP");
    audioTMP.addEventListener("loadedmetadata", function(_event) {
        vocalisation.totalSoundDurationReal += audioTMP.duration;
        if (vocalisation.totalSoundDurationReal > vocalisation.totalSoundDuration)
            vocalisation.totalSoundDuration = vocalisation.totalSoundDurationReal;
        //console.log("REAL DURATION -> "+vocalisation.totalSoundDurationReal);
        document.getElementsByTagName("body")[0].removeChild(audioTMP);
    });
}

function xvox_rec_live() {
    var llen = vocalisation.liveVocTab.length, lllen = 0;
    var contenu = null;
    lllen = vocalisation.liveVocTab[vocalisation.liveVocIndex].length;
    contenu = "";
    for (var j = 0; j < lllen; j++) {
        contenu += vocalisation.liveVocTab[vocalisation.liveVocIndex][j].Text+"\n\n";
    }
    //console.log("SEND -> "+contenu);
    var c_url = window.location.href;
    if (c_url.indexOf('http://www.') > -1)
        c_url = c_url.replace('http://www.','');
    else if (c_url.indexOf('http://') > -1)
        c_url = c_url.replace('http://','');
    else if (c_url.indexOf('www.') > -1)
        c_url = c_url.replace('www.','');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://core.xvox.fr/hl/'+window.location.host+"/"+encodeURIComponent(c_url), true);
    xhr.onload = function () {
       // console.log(JSON.parse(this.responseText));
        vocalisation.tabLives.push(JSON.parse(this.responseText));
        vocalisation.liveVocIndex++;
        if (vocalisation.liveVocIndex < llen) {
            xvox_rec_live();
        }
        xvox_get_audio_duration(JSON.parse(this.responseText));
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({"contenu" : contenu, "voice" : "Aurelie"}));
}

function xvox_live_voc() {
    var totalWords = 0;
    for (var ij = 0; ij < vocalisation.sentences.length; ij++) {
        totalWords += vocalisation.sentences[ij].Words.length;
    }
    vocalisation.totalSoundDuration = totalWords * 0.38415;
    //console.log(vocalisation.totalSoundDuration);
    var llen = vocalisation.liveVocTab.length, lllen = 0;
    var contenu = null;
    vocalisation.liveVocIndex = 0, vocalisation.tabLivesIndex = 0;
    vocalisation.tabLives = [],

    lllen = vocalisation.liveVocTab[vocalisation.liveVocIndex].length;
    contenu = "";
    for (var j = 0; j < lllen; j++) {
        contenu += vocalisation.liveVocTab[vocalisation.liveVocIndex][j].Text+"\n\n";
    }

    var c_url = window.location.href;
    if (c_url.indexOf('http://www.') > -1)
        c_url = c_url.replace('http://www.','');
    else if (c_url.indexOf('http://') > -1)
        c_url = c_url.replace('http://','');
    else if (c_url.indexOf('www.') > -1)
        c_url = c_url.replace('www.','');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://core.xvox.fr/hybvoc/'+window.location.host+"/"+encodeURIComponent(c_url), true);
    xhr.onload = function () {
        var currentObj = JSON.parse(this.responseText);
        console.log(currentObj);

        if (typeof currentObj != "undefined") {
            if (currentObj.hasOwnProperty("cacheVoc")) {
                vocalisation.cacheMode = true;
                var xvox_dl_mp = document.getElementById("xvox_dl_mp_link");
                xvox_dl_mp.href = (typeof currentObj.source != "undefined" ? currentObj.source.replace("/Clients", "/dl") : "")+'.mp3';
            }
        }

        vocalisation.player = currentObj;

        vocalisation.player.source = vocalisation.player.source.replace("http://ns329423.ip-37-187-116.eu", "https://core.xvox.fr");
        vocalisation.tabPos["fem"] = vocalisation.player.silences;
        vocalisation.silences = vocalisation.player.silences;

        document.getElementById("voxi_loaded").style.display = "none";

        if (!vocalisation.cacheMode) {
            vocalisation.tabLives.push(currentObj);
            vocalisation.tabLivesIndex++;
            //console.log(vocalisation.player);
            xvox_vocalise_now(currentObj);
            vocalisation.liveVocIndex++;
            if (vocalisation.liveVocIndex < llen) {
                xvox_rec_live();
            }
            xvox_get_audio_duration(JSON.parse(this.responseText));
        }
        else {
            vocalisation.currentTime = new Date();
            var srcPlaymp = document.getElementById("mp3_src");
            srcPlaymp.src = vocalisation.player.source+".mp3";
            var srcPlaywa = document.getElementById("wav_src");
            srcPlaywa.src = vocalisation.player.source+".wav";
            var playBtn = document.getElementById("play");
            document.getElementById("player").load();
            Voxi_Audio_Play();
        }
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({"contenu" : contenu, "fullContent" : vocalisation.content, "voice" : "Aurelie"}));
}

function vocHighlight(event)
{
    var x, y;
    var plh = document.getElementById("vhi");
    var pldiv = document.getElementById("phldiv");
    if (pldiv != null)
        pldiv.style.display = 'none';
    if ((plh != null && plh.style.display == "none") || plh == null)
    {
        x = event.clientX+"px";
        y = event.clientY-50+"px";
    }
    else if (plh != null)
    {
        x = plh.style.left;
        y = plh.style.top;
    }
    var userSelection;
    if (window.getSelection) {
        userSelection = window.getSelection();
    }
    else if (document.selection) {
        userSelection = document.selection.createRange();
    }

    var selectedText = userSelection;
    if (userSelection.text) selectedText = userSelection.text;
    if (selectedText != '') {
        if (plh == null)
        {
            var voc = document.getElementById("content");
            var ndiv=document.createElement("div");
            ndiv.setAttribute("id", "vhi");
            ndiv.style.cssText = 'position:fixed;top:'+y+';left:'+x+';z-index:2147483638;';
            document.body.appendChild(ndiv);

            var ndiv_content = '<div id="btn_voc_hig" style="float:left;">';
            ndiv_content += '<button id="vocHigh" title="Ecouter le texte" style="padding: 0px;background: none;border: none;">';
            ndiv_content += '<img src="https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/play.png" style="width: auto; height: 35px;">';
            ndiv_content += '</button>';
            ndiv_content += '</div>';
            ndiv.innerHTML = ndiv_content;

            var btn_hl = document.getElementById("vocHigh");
            btn_hl.onclick = function() {
                var c_url = window.location.href;
                if (c_url.indexOf('http://www.') > -1)
                    c_url = c_url.replace('http://www.','');
                else if (c_url.indexOf('http://') > -1)
                    c_url = c_url.replace('http://','');
                else if (c_url.indexOf('www.') > -1)
                    c_url = c_url.replace('www.','');
                 var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://core.xvox.fr/hl/'+window.location.host+"/"+encodeURIComponent(c_url), true);
                xhr.onload = function () {
                    //console.log(this.responseText);
                    display_hl(JSON.parse(this.responseText));
                    document.getElementById("btn_voc_hig").style.display = 'none';
                    document.getElementById("phldiv").style.display= 'block';
                };
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({"contenu" : selectedText.toString()}));
            }
        }
        else
        {
          plh.style.cssText = 'display:block;position:fixed;top:'+y+';left:'+x+';z-index:2147483638;';
          document.getElementById("btn_voc_hig").style.display = 'block';
        }
        //window.getSelection().removeAllRanges();
    }
    else
    {
        if (plh != null)
        {
            plh.style.display = 'none';
            if (pldiv != null)
                pldiv.style.display = 'none';
        }
    }
}

function send_stat() {
    var c_url = window.location.href;
    if (c_url.indexOf('http://www.') > -1)
        c_url = c_url.replace('http://www.','');
    else if (c_url.indexOf('http://') > -1)
        c_url = c_url.replace('http://','');
    else if (c_url.indexOf('www.') > -1)
        c_url = c_url.replace('www.','');
    var xhr = getXMLHttpRequest();
    xhr.open('POST', 'https://core.xvox.fr/stat/'+window.location.host+"/"+encodeURIComponent(c_url), true);
    xhr.onload = function () {
        if (this.responseText != "L'utilisateur n'existe pas!") {
            console.log('');
            //console.log(this.responseText);
        }
        else
            console.log(this.responseText);
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
}

function init_events() {
     var audio = document.getElementById('player');
     var vocal = document.getElementById("content");
    var indi = 0, indj = 0;
     vocalisation.savedNode = 0;

     vocalisation.audio = audio;

    vocalisation.wordNum = vocalisation.sentences[vocalisation.index_silence].Words.length;

    audio.addEventListener("ended", function() {
        if (!vocalisation.cacheMode) {
            if (vocalisation.tabLivesIndex < vocalisation.tabLives.length) {
                vocalisation.lastIndexSilence = vocalisation.index_silence;

                vocalisation.totalPause = 0;
                vocalisation.timePause = null;
                vocalisation.Resume = null;
                vocalisation.currentTime = null;

                vocalisation.ctime += audio.duration;
                vocalisation.onPlay = false;
                xvox_vocalise_now(vocalisation.tabLives[vocalisation.tabLivesIndex]);
                vocalisation.tabLivesIndex++;
            }
            else if (vocalisation.tabLivesIndex >= vocalisation.tabLives.length) {
                Voxi_Audio_Stop();
            }
        }
        else {
            Voxi_Audio_Stop();
        }
    });


    var btn_play = document.getElementById("play");
    var btn_pause = document.getElementById("pause");
    var btn_stop = document.getElementById("stop");
    var btn_dl_mp3 = document.getElementById("xvox_dl_mp");
    var btn_engine = document.getElementById("engine");
    var xvox_dl_win = document.getElementById("xvox_dl_file_window");
    var xvox_dl_btn = document.getElementById("xvox_dl_mp_link");
    var xvox_dl_close_btn = document.getElementById("xvox_close_mp_link");
    var btn_close_player = document.getElementById("close_player");
    //var btn_speed_pop = document.getElementById("voxi_speed_pop");
    var btn_highlight_managment = document.getElementById("voxi_highlight_pop");
    var btn_volume_managment = document.getElementById("voxi_volume_pop");
    var btn_volume_less = document.getElementById("voxi_less_lvl");
    var btn_volume_more = document.getElementById("voxi_more_lvl");
    var volumes_lvls = [0.25, 0.5, 0.75, 1];
    var cvolbut;
    var btn_lvl;
    for (var j = 0; j < 4; j++)
    {
        cvolbut =  document.getElementById("voxi_lvl"+(j+1));
        var div_volume;
        var volume_lvl = 1;
        cvolbut.onclick = function() {
            var clvl = this.id.replace('voxi_lvl','');
            volume_lvl = volumes_lvls[clvl-1];
            if (audio.volume < volume_lvl)
            {
                for (var i = 0; volumes_lvls[i] <= volume_lvl; i++)
                {
                    div_volume = document.getElementById("voxi_lvl"+(i+1));
                    if (hasClass(div_volume, 'vol_down'))
                        removeClassName(div_volume, 'vol_down');
                    if (!hasClass(div_volume, 'vol_up'))
                        div_volume.className += ' vol_up';
                }
            }
            else if (audio.volume > volume_lvl)
            {
                for (var i = volumes_lvls.length - 1; volumes_lvls[i] > volume_lvl; i--)
                {
                    div_volume = document.getElementById("voxi_lvl"+(i+1));
                    if (hasClass(div_volume, 'vol_up'))
                        removeClassName(div_volume, 'vol_up');
                    if (!hasClass(div_volume, 'vol_down'))
                        div_volume.className += ' vol_down';
                }
            }
            audio.volume = volume_lvl;
            //console.log(audio.volume);
        };
    }


    btn_play.onmouseover = function () {
        if (vocalisation.onPlay == false)
            document.getElementById("play_img").src = vocalisation.playerImgs.play_hover;
    };
    btn_play.onmouseout = function () {
        if (vocalisation.onPlay == false)
            document.getElementById("play_img").src = vocalisation.playerImgs.play
    };
    btn_play.onclick = function () {
        Voxi_Audio_Play();
    };

    btn_pause.onmouseover = function () {
        if (vocalisation.onPlay == false)
            document.getElementById("pause_img").src = vocalisation.playerImgs.pause_hover;
    };
    btn_pause.onmouseout = function () {
        if (vocalisation.onPlay == false)
            document.getElementById("pause_img").src = vocalisation.playerImgs.pause;
    };
    btn_pause.onclick = function () {
        Voxi_Audio_Pause();
    };


    btn_stop.onmouseover = function () {
        if (vocalisation.onPlay == false)
            document.getElementById("stop_img").src = vocalisation.playerImgs.stop_hover;
    };
    btn_stop.onmouseout = function () {
        if (vocalisation.onPlay == false)
            document.getElementById("stop_img").src = vocalisation.playerImgs.stop;
    };
    btn_stop.onclick = function () {
        Voxi_Audio_Stop();
    };

    btn_dl_mp3.onclick = function () {
        if (xvox_dl_win.style.display != "block")
            xvox_dl_win.style.display = "block";
        else
            xvox_dl_win.style.display = "none";
    }

    xvox_dl_close_btn.onclick = function () {
        xvox_dl_win.style.display = "none";
    }

    btn_engine.onmouseover = function () {
        document.getElementById("engine_img").src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/engine_hover.png";
    };
    btn_engine.onmouseout = function () {
        document.getElementById("engine_img").src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/engine.png";
    };
    btn_engine.onclick = function () {
        show_menu_player();
        document.getElementById("voxi_highlight_managment").style.display = 'none';
        document.getElementById("voxi_volume_managment").style.display = 'none';
    };

    btn_close_player.onclick = function () {
        Voxi_Audio_Stop();
        document.getElementById("playerVoc").style.visibility = 'hidden';
    };

    btn_highlight_managment.onmouseover = function () {
        document.getElementById("voxi_highlight_managment").style.display = 'block';
        document.getElementById("voxi_volume_managment").style.display = 'none';
    };

    btn_volume_managment.onmouseover = function () {
        document.getElementById("voxi_highlight_managment").style.display = 'none';
        document.getElementById("voxi_volume_managment").style.display = 'block';
    };

    btn_volume_less.onclick = function () {
        if (audio.volume > volumes_lvls[0])
        {
            var j;
            for (j = 0; volumes_lvls[j] < audio.volume; j++) ;
            var div_volume = document.getElementById("voxi_lvl"+(j+1));
            if (hasClass(div_volume, 'vol_up'))
                removeClassName(div_volume, 'vol_up');
            if (!hasClass(div_volume, 'vol_down'))
                div_volume.className += ' vol_down';
            audio.volume = volumes_lvls[j - 1];
        }
        //console.log(audio.volume);
    };

    btn_volume_more.onclick = function () {
        if (audio.volume < volumes_lvls[volumes_lvls.length-1])
        {
            var j;
            for (j = 0; volumes_lvls[j] < audio.volume; j++) ;
            var div_volume = document.getElementById("voxi_lvl"+(j+2));
            if (hasClass(div_volume, 'vol_down'))
                removeClassName(div_volume, 'vol_down');
            if (!hasClass(div_volume, 'vol_up'))
                div_volume.className += ' vol_up';
            audio.volume = volumes_lvls[j + 1];
        }
        //console.log(audio.volume);
    };

    var div_volume;
    var volumes_lvls = [0.25, 0.5, 0.75, 1];
    var volume_lvl = 1;
    for (var i = 0; i < volumes_lvls.length; i++)
        if (volume_lvl >= volumes_lvls[i])
        {
            div_volume = document.getElementById("voxi_lvl"+(i+1));
            removeClassName(div_volume, 'vol_down');
            div_volume.className += ' vol_up';
        }
}

function sendPDFRequest(i) {
    var xhr = getXMLHttpRequest();
    xhr.open('POST', 'https://core.xvox.fr/checkPdfVocalisation/'+window.location.host, true);
    xhr.onload = function () {
        //console.log(this.responseText);
        if (this.responseText != "Not Found") {
            var data = JSON.parse(this.responseText);
            if (typeof data.Error == "undefined") {
                //data.source = data.source.replace("http://ns329423.ip-37-187-116.eu", "https://core.xvox.fr");
                console.log("READY TO READ "+data.source+".wav");
                console.log(vocalisation.pdfs[i].node);
                var childGuest = document.createElement("a");
                childGuest.href = data.source+".wav";
                childGuest.target = "_blank";
                var childGuestImg = document.createElement("IMG");
                childGuestImg.src = "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/xvox/xvox.png";
                childGuestImg.style.width = "16px";
                childGuestImg.style.height = "16px";
                childGuest.appendChild(childGuestImg);
                childGuest.style.marginLeft = "2px";
                childGuest.style.width = "16px";
                childGuest.style.height = "16px";
                var parElem = vocalisation.pdfs[i].node;
                if (parElem.nextSibling) {
                  parElem.parentNode.insertBefore(childGuest, parElem.nextSibling);
                }
                else {
                  parElem.parentNode.appendChild(childGuest);
                }
            }
            else
                console.log(this.responseText);
        }
        console.log(i);
        console.log(vocalisation.pdfs[i].url);
        i++;
        if (i < vocalisation.pdfs.length) {
            sendPDFRequest(i);
        }
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({"pdfs" : vocalisation.pdfs[i].url, "voice" : "Aurelie", "compat" : true}));
}

function document_loaded() {
    vocalisation.vocal = document.getElementById("content");
    var vocal = document.getElementById("content");
    if (vocal != null) {
        var vocal_trim = document.createElement("div");
        spliceText();
        vocalisation.content = escapeHtml(vocalisation.content);
        init_player();
        init_events();
    }
    else
        document.getElementById("playerVoc").style.display = 'none';
}

function crossBrowserAddEvent(obj, evt, fnc) {
    if (obj.addEventListener) {
        obj.addEventListener(evt, fnc, false);
        return true;
    }
    else if (obj.attachEvent) {
        return obj.attachEvent('on' + evt, fnc);
    }
    return false;
}

var vocalisation = {"player" : "", playerImgs : {"play" : "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/play.png", "pause" : "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/pause.png", "stop" : "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/stop.png", "engine" : "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/xvox/engine.png", "narrow" : "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/xvox/narrow.png", "play_hover" : "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/play_hover.png", "pause_hover" : "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/pause_hover.png", "stop_hover" : "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/img/xvox/stop_hover.png", "engine_hover" : "https://www.saintsebastien.fr/sites/all/themes/basic/library/built/xvox/engine_hover.png"}, "content" : "", "sentences" : [], "index_silence" : 0, "tabPos" : [], "indexWord" : 0, "indexNew" : 0, "nextNode" : false, "wordColor" : "#A4CBFF", "vocal" : "", "stat" : "", "onPlay" : false, "speed" : "normal", "color" : "darkorange", "textColor" : "black", "countW" : 0, "wordNum" : 0, "savedNode" : 0, "st" : false, "voice" : "fem", "currentSenColored" : null, "currentWorColored" : null, "currentTexColored" : null, "senOpts" : {"fontWeight" : null, "fontStyle" : null, "textDecoration" : null}, "compatMode" : false, "IERequest" : false, "pdfs" : [], "audio" : null, "timeUpdate" : -1, "currentTime" : null, "inPause" : false, "timePause" : null, "Resume" : null, "totalPause" : 0, "liveVocTab" : [], "liveVocIndex" : 0, "tabLives" : [], "tabLivesIndex" : 0, "totalSoundDuration" : 0, "ctime" : 0, "totalSoundDurationReal" : 0, "lastIndexSilence" : 0, "cacheMode" : false};
crossBrowserAddEvent(window, "DOMContentLoaded", document_loaded);
//document.onmouseup = vocHighlight;
//if (!document.all) document.captureEvents(Event.MOUSEUP);