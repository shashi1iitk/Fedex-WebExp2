var isMobileDevice = navigator.userAgent.match(/iPad|iPhone|iPod/i) != null || screen.width <= 480;

var elem = document.documentElement;
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
    // document.documentElement.style.cursor = 'none';
    var timeout;
    document.onmousemove = function(){
    clearTimeout(timeout);
    document.documentElement.style.cursor = 'auto';
    timeout = setTimeout(function(){document.documentElement.style.cursor = 'none';}, 5000);
    }
}



var curTrial = 0,
    totalPractice = 5,     //Number of practice cases
    totalTrial = 10,        //Number of Trail cases
    trialStage = 'slides',
    slideNum = 1,
    totemIdx = -1,

    dataCSV = 'Totem,Correct Side,User Side,React Time,React Answer\n',
    data = {},

    Cside, Uside, ResTime, time1, time2,
    picPath = 'slides/',
    totems = ['pic6.jpg', 'pic7.jpg', 'pic8.jpg', 'pic9.jpg', 'pic10.jpg', 'pic11.jpg', 'pic12.jpg', 'pic18.jpg', 'pic19.jpg', 'pic20.jpg',
        'pic1.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg', 'pic5.jpg', 'pic13.jpg', 'pic14.jpg', 'pic15.jpg', 'pic16.jpg', 'pic17.jpg',
        'pic1r.jpg', 'pic2r.jpg', 'pic3r.jpg', 'pic4r.jpg', 'pic5r.jpg', 'pic13r.jpg', 'pic14r.jpg', 'pic15r.jpg', 'pic16r.jpg', 'pic17r.jpg',
        'pic6r.jpg', 'pic7r.jpg', 'pic8r.jpg', 'pic9r.jpg', 'pic10r.jpg', 'pic11r.jpg', 'pic12r.jpg', 'pic18r.jpg', 'pic19r.jpg', 'pic20r.jpg',
        'npic1.jpg', 'npic2.jpg', 'npic3.jpg', 'npic4.jpg', 'npic5.jpg', 'npic6.jpg', 'npic7.jpg', 'npic8.jpg', 'npic9.jpg', 'npic10.jpg',
        'npic1r.jpg', 'npic2r.jpg', 'npic3r.jpg', 'npic4r.jpg', 'npic5r.jpg', 'npic6r.jpg', 'npic7r.jpg', 'npic8r.jpg', 'npic9r.jpg', 'npic10r.jpg'
    ],

    images = [],
    phase = 'none';


$(document).ready(function () {

    if (isMobileDevice) {
        alert("The experminet is only supported on PC screen");
        $("html").empty();
        $("html").append("The experminet is only supported on PC screen");

    }else{

        StartExperiment();

        $('#formContinue').click(async function () {

            var formWarning = '';
            var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i;
             if(!regex.test($('#email').val()))
                formWarning = '<p id="warning" style="color:red;">Please enter valid email address.</p>'; //Checking email
            else if($('#age').val() === '' || Number.isNaN(Number($('#age').val())) || Number.parseInt($('#age').val()) > 105 || Number.parseInt($('#age').val()) <= 0) {
                formWarning = '<p id="warning" style="color:red;">Please enter valid age.</p>';     //Checking age
            } else if (!$('input[name="gender"]').is(':checked') || !$('input[name="handedness"]').is(':checked')) {
                formWarning = '<p id="warning" style="color:red;">You must choose a option of ' +
                    ($('input[name="gender"]').is(':checked') ? 'handedness' : 'gender') + '.</p>';      //Checking gender and handedness
            }
            if (formWarning !== '')
                document.getElementById('formContinue').insertAdjacentHTML('beforebegin', formWarning);
            else {
                openFullscreen();
                slideNum = 1;
                $('#instructions').attr('src', picPath + slideNum + '.jpg');
                $('#questions').hide();
                $('#instructions').css('display', 'block');
                $('#startExp').show();
            }
        });

        $(document).keypress(async function (e) {
            var x = e.which || e.keyCode;
            console.log('Key pressed: ' + x);

            if (x == 13)
                e.preventDefault();
            else if (x == 118 || x == 109) {

                if (trialStage == 'slides') {
                    if (x == 118) {
                        if (slideNum > 1)
                            $('#instructions').attr('src', picPath + (--slideNum) + '.jpg');
                        if (slideNum == 1)
                            $('#startExp').html('Press <kbd class="button">M</kbd> for next slide.');
                        else if (slideNum == 21)
                            $('#startExp').html('Press <kbd class="button">V</kbd> for previous slide, and <kbd class="button">M</kbd> for next.');
                    } else if (x == 109) {
                        if (slideNum == 21) {
                            //start the practice trials
                            curTrial = 0;
                            trialStage = 'practice';
                            iTrials();
                        } else {
                            $('#instructions').attr('src', picPath + (++slideNum) + '.jpg');
                            if (slideNum == 21)
                                $('#startExp').html('Press <kbd class="button">V</kbd> for previous slide, and <kbd class="button">M</kbd> to start practice trials.');
                            else if (slideNum == 2)
                                $('#startExp').html('Press <kbd class="button">V</kbd> for previous slide, and <kbd class="button">M</kbd> for next.');
                        }
                    }

                }

                else if (trialStage == 'practice' && phase == 'input') {

                    $('#totem').css('display', 'none');
                    phase = 'none';

                    if (x == 118) Uside = 'L';
                    else Uside = 'R';

                    if (Cside == Uside) console.log("Correct");
                    else console.log("Incorrect");

                    console.log(curTrial);
                    time2 = new Date();
                    console.log(time2 - time1);

                    await sleep(2000);

                    if (curTrial == totalPractice) { //Number of practice cases
                        // $('#count').hide();
                        trialStage = 'trial';
                        curTrial = 0;
                        $('#count').html("");
                        // alert("Now we are entering into the Trial stage.");


                        var t = 5;

                        var z = setInterval(function () {

                            t--;
                            $('#countdown').show();
                            $('#countdown').html("Practice Complete. Starting Trials in " + t + " Second");

                            console.log(t);
                            if (t < 0) {
                                clearInterval(z);
                                $('#countdown').hide();
                                iTrials();
                            }
                        }, 1000);

                    } else
                        iTrials();

                }
                else if (trialStage == 'trial' && phase == 'input') {

                    $('#totem').css('display', 'none');
                    phase = 'none';

                    time2 = new Date();
                    ResTime = time2 - time1;

                    if (x == 118) Uside = 'L';
                    else Uside = 'R';

                    //logging and counting
                    var response;
                    if (Cside == Uside) response = "Correct";
                    else response = "Incorrect";
                    console.log(ResTime);

                    dataCSV += totems[totemIdx] + ',' + Cside + ',' + Uside + ',' + ResTime + ',' + response + '\n';

                    console.log(dataCSV);

                    await sleep(2000);

                    if (curTrial == totalTrial) { //Number of Trail cases
                        trialStage = 'done';
                        curTrial = 0;
                        // iTrials();
                        console.log("Trials Complete");
                        alert("Trials Complete");
                        $('#count').hide();
                        $('#done').show();
                        document.documentElement.style.cursor = 'auto';
                    } else
                        iTrials();
                }

            }
        });
 }
});


function StartExperiment() {

    totems.forEach(function (element) {
        preload("totems/" + element)
    });
    for (var i = 1; i <= 21; ++i)
        preload("slides/" + i + '.jpg');
    $('#loading').hide();
    trialStage = 'slides';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function iTrials() {
    curTrial++;

    if (trialStage == 'practice') {
        $('#count').show();
        $('#count').html("Practice " + curTrial + " of " + totalPractice);
    }

    if (trialStage == 'trial') {
        $('#count').show();
        $('#count').html("Trial " + curTrial + " of " + totalTrial);
    }

    $('#instructions').hide();
    $('#startExp').hide();
    $('#targetBox').show();
    await sleep(500);

    totemIdx = Math.floor(Math.random() * Math.floor(60));

    $('#totem').attr('src', "totems/" + totems[totemIdx]);
    $('#targetBox').hide();
    $('#totem').css('display', 'block');

    await sleep(300);

    var rn = Math.floor(Math.random() * Math.floor(2));

    if (rn == 0) {
        $('#LeMark').show();
        Cside = 'L';
    }
    else {
        $('#ReMark').show();
        Cside = 'R';
    }

    await sleep(18);

    $('#LeMark').hide();
    $('#ReMark').hide();
    time1 = new Date();
    phase = 'input';

}

function preload() {
    for (var i = 0; i < arguments.length; ++i) {
        images.push(new Image())
        images[images.length - 1].src = preload.arguments[i];
    }
}

function genCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

