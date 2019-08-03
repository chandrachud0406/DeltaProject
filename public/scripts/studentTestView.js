var lastClicked;

document.getElementById('queslist').addEventListener('click', function (event) {

    console.log(event.target.textContent);
    var quesID = event.target.id;
    //console.log(event.target);
    //console.log(event.targe.nodeName);
    if (event.target.className == 'dot') {
        lastClicked = event.target;
        //        console.log(event.target.style.background);
        if (event.target.style.background !== 'rgb(41, 185, 153)' && event.target.style.background !== 'rgb(240, 223, 77)' && event.target.style.background !== 'rgb(86, 95, 184)') {
            event.target.style.background = '#ED6060';
        }
    }

    event.stopPropagation();
    //console.log(quesID);
    event.preventDefault();
    viewQn(quesID);
});

window.onload = clickFirst();
function clickFirst() {
    console.log('you clicked me first');
    var qns = document.getElementsByClassName('dot');
    //console.log(qns);

    for (var i = 0; i < qns.length; i++) {
        if (qns[i].textContent == 1) {
            qns[i].click();
        }
    }
}

window.addEventListener('beforeunload', function (e) {
    e.returnValue = 'Changes that you made may not be saved.';
});

// window.onload = function () {
//     var qns = document.getElementsByClassName('dot');
//     //console.log(qns);

//     for (var i = 0; i < qns.length; i++) {
//         qns[i].click();
//         document.getElementById('clear-selec').click();
//         $(`${qns[i].id}`).css({background: '#c4bdbd'});
//     }
//  //   clickFirst();
// }

var currentOptions = ['option1', 'option2', 'option3', 'option4'];
var boolOptions = [false, false, false, false];
var currentImages = ['/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png'];
var currentType = '-1';

function viewQn(quesID) {
    //console.log(quesID);
    var questionSpace = document.getElementById("main");
    var questionNo = document.querySelector("#main #question-no");
    var questionTitleType = document.querySelector("#main #question-type");
    var questionText = document.querySelector("#question-text");
    var formElement = document.querySelector("#main form");
    formElement.name = quesID;
    var startTime = document.getElementById('demo').textContent;

    var url = `/question/${quesID}/view/${startTime}`;

    fetch(url).then(function (res) {
        return res.json();
    }).then(function (obj) {
        var ques = obj.qns;
        //console.log(ques);
        var answerArray;
        questionNo.textContent = "Question no : " + ques.position;
        questionText.textContent = ques.question;

        if (ques.type == 0) {
            questionTitleType.textContent = 'Single Correct Type'
            currentOptions = ques.options;
            if (obj.ans != null) {
                answerArray = obj.ans.answerContent;
                boolOptions = answerArray;
            }
            //            console.log(currentOptions);
            console.log(boolOptions);
            currentType = ques.type;
            setAnswerType(ques.type);

        } else if (ques.type == 1) {
            questionTitleType.textContent = 'Multiple Correct Type'
            currentOptions = ques.options;
            if (obj.ans != null) {
                answerArray = obj.ans.answerContent;
                boolOptions = answerArray;
            }
            //          console.log(currentOptions);
            console.log(boolOptions);
            currentType = ques.type;
            setAnswerType(ques.type);

        } else if (ques.type == 2) {
            questionTitleType.textContent = 'Numerical';
            if (obj.ans != null) {
                answerArray = obj.ans.answerContent;
                boolOptions = answerArray;
            }
            console.log(boolOptions);
            currentType = ques.type;
            setAnswerType(ques.type);

        } else if (ques.type == 3) {
            questionTitleType.textContent = 'Single Correct Type';
            currentImages = ques.files;
            if (obj.ans != null) {
                answerArray = obj.ans.answerContent;
                boolOptions = answerArray;
            }
            console.log(boolOptions);
            currentType = ques.type;
            setAnswerType(ques.type);

        } else if (ques.type == 4) {
            questionTitleType.textContent = 'Multiple Correct Type';
            currentImages = ques.files;
            if (obj.ans != null) {
                answerArray = obj.ans.answerContent;
                boolOptions = answerArray;
            }
            console.log(boolOptions);
            //console.log(currentImages);
            currentType = ques.type;
            setAnswerType(ques.type);

        } else {
            questionTitleType.textContent = 'None';

            currentOptions = ['option1', 'option2', 'option3', 'option4'];
            boolOptions = [false, false, false, false];
            currentImages = ['/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png'];
            currentType = ques.type;
            setAnswerType(ques.type);
        }

    }).catch(function (err) {
        console.log(err);
    })
}

function setOptions() {
    //    console.log(boolOptions);
    document.getElementById('op1').checked = boolOptions[0];
    document.getElementById('op2').checked = boolOptions[1];
    document.getElementById('op3').checked = boolOptions[2];
    document.getElementById('op4').checked = boolOptions[3];
}

function setAnswerType(option) {
    var x = ``;
    if (option == "0") {
        //  console.log(option);
        x += `    <div id="checkbox">
        <input type="radio" name="op" id="op1"> 
        <label for="op1" class="whatever optionsLine"> <span class="dot3">A</span> ${currentOptions[0]} </label>
        <input type="radio" name="op" id="op2">
        <label for="op2"  class="whatever optionsLine"> <span class="dot3">B</span> ${currentOptions[1]} </label>
        <input type="radio" name="op" id="op3">
        <label for="op3"  class="whatever optionsLine"> <span class="dot3">C</span> ${currentOptions[2]} </label>
        <input type="radio" name="op" id="op4">
        <label for="op4"  class="whatever optionsLine"> <span class="dot3">D</span> ${currentOptions[3]} </label>
    </div>
    `;
    } else if (option == "1") {
        x += `    <div id="checkbox">
        <input type="checkbox" name="op" id="op1"> 
        <label for="op1" class="whatever optionsLine"> <span class="dot3">A</span> ${currentOptions[0]} </label>
        <input type="checkbox" name="op" id="op2">
        <label for="op2"  class="whatever optionsLine"> <span class="dot3">B</span> ${currentOptions[1]} </label>
        <input type="checkbox" name="op" id="op3">
        <label for="op3"  class="whatever optionsLine"> <span class="dot3">C</span> ${currentOptions[2]} </label>
        <input type="checkbox" name="op" id="op4">
        <label for="op4"  class="whatever optionsLine"> <span class="dot3">D</span> ${currentOptions[3]} </label>
    </div>
    `;
    } else if (option == "2") {
        x += `<input type="number" value=${boolOptions[0]} id="op11" >
            `;
    } else if (option == "3") {
        x += `<div id="checkbox">
        <input type="radio" name="op" id="op1"> 
        <label for="op1" class="whatever optionsLine"> <span class="dot3">A</span><img src="${currentImages[0]}" width="200" height="150"></label>
        <input type="radio" name="op" id="op2">
        <label for="op2"  class="whatever optionsLine"> <span class="dot3">B</span><img src="${currentImages[1]}" width="200" height="150"></label>
        <input type="radio" name="op" id="op3">
        <label for="op3"  class="whatever optionsLine"> <span class="dot3">C</span><img src="${currentImages[2]}" width="200" height="150"></label>
        <input type="radio" name="op" id="op4">
        <label for="op4"  class="whatever optionsLine"> <span class="dot3">D</span><img src="${currentImages[3]}" width="200" height="150"></label>
    </div>`;

    } else if (option == "4") {
        x += `<div id="checkbox">
        <input type="checkbox" name="op" id="op1"> 
        <label for="op1" class="whatever optionsLine"> <span class="dot3">A</span><img src="${currentImages[0]}" width="200" height="150"></label>
        <input type="checkbox" name="op" id="op2">
        <label for="op2"  class="whatever optionsLine"> <span class="dot3">B</span><img src="${currentImages[1]}" width="200" height="150"></label>
        <input type="checkbox" name="op" id="op3">
        <label for="op3"  class="whatever optionsLine"> <span class="dot3">C</span><img src="${currentImages[2]}" width="200" height="150"></label>
        <input type="checkbox" name="op" id="op4">
        <label for="op4"  class="whatever optionsLine"> <span class="dot3">D</span><img src="${currentImages[3]}" width="200" height="150"></label>
    </div>`;
    }
    document.getElementById('answers').innerHTML = x;

    if (option === "2") {
        document.getElementById('op11').value = boolOptions[0];
    } else if (option == "0" || option == "1" || option == "3" || option == "4") {
        console.log(`%%%%%%%${boolOptions}`);
        setOptions();
        myBlues();
    }
}

function arraysEqual(arr1, arr2) {

    if (arr1.length !== arr2.length) return false;

    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    return true;
}


document.querySelector('#main form').addEventListener('submit', function (event) {
    var currentForm = document.querySelector("#main form");
    var quesID = currentForm.name;
    //console.log(images);

    if (currentType !== 2) {
        var boolOp1 = document.getElementById('op1').checked;
        var boolOp2 = document.getElementById('op2').checked;
        var boolOp3 = document.getElementById('op3').checked;
        var boolOp4 = document.getElementById('op4').checked;
        var boolArray = [boolOp1, boolOp2, boolOp3, boolOp4];
    } if (currentType == 2) {
        var boolOp1 = document.getElementById('op11').value;
        var boolArray = [boolOp1, false, false, false];
    }

    console.log(boolArray);
    var quesData = {
        boolArray: boolArray
    }

    var url = `/question/${quesID}/view/save`;

    var options = {
        method: 'POST',
        body: JSON.stringify(quesData),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(function (ans) {
            var $nextQn = $(`#${quesID}`).parent().next('div');

            //console.log($nextQn.length);
            if ($nextQn.length > 0) {
                $nextQn.find('.dot').click();
            } else {
                //                document.getElementById('test-finish').click();
                clickFirst();
            }

            if (!arraysEqual(ans.answerContent, [false, false, false, false])) {
                $(`#${quesID}`).css({ background: '#29B999' });
            }
        })
        .catch(err => console.log(err));

    event.preventDefault();

});

document.getElementById('review-later').addEventListener('click', function () {
    var currentForm = document.querySelector("#main form");
    var quesID = currentForm.name;
    //console.log(images);

    if (currentType !== 2) {
        var boolOp1 = document.getElementById('op1').checked;
        var boolOp2 = document.getElementById('op2').checked;
        var boolOp3 = document.getElementById('op3').checked;
        var boolOp4 = document.getElementById('op4').checked;
        var boolArray = [boolOp1, boolOp2, boolOp3, boolOp4];
    }
    //console.log(formData.getAll('myFiles'));
    if (currentType == 2) {
        var boolOp1 = document.getElementById('op11').value;
        var boolArray = [boolOp1, false, false, false];
    }

    var quesData = {
        boolArray: boolArray
    }

    //console.log(quesData);
    var url = `/question/${quesID}/view/review`;

    //console.log(url);
    //console.log(formData.getAll('myFiles'));

    var options = {
        method: 'POST',
        body: JSON.stringify(quesData),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(function (ans) {
            var $nextQn = $(`#${quesID}`).parent().next('div');

            if ($nextQn.length > 0) {
                $nextQn.find('.dot').click();
            } else {
                //                document.getElementById('test-finish').click();
                clickFirst();
            }

            if (!arraysEqual(ans.answerContent, [false, false, false, false])) {
                $(`#${quesID}`).css({ background: '#f0df4d' });
            } else {
                $(`#${quesID}`).css({ background: '#565FB8' });
            }
        })
        .catch(err => console.log(err));

    event.preventDefault();
});

document.getElementById('clear-selec').addEventListener('click', function () {
    var currentForm = document.querySelector("#main form");
    var quesID = currentForm.name;
    //console.log(images);

    if (currentType != 2) {
        var boolArray = [false, false, false, false];
    }
    //console.log(formData.getAll('myFiles'));
    if (currentType == 2) {
        var boolOp1 = '';
        var boolArray = [boolOp1, false, false, false];
    }

    var quesData = {
        boolArray: boolArray
    }

    //console.log(quesData);
    var url = `/question/${quesID}/view/clear`;

    //console.log(url);
    //console.log(formData.getAll('myFiles'));

    var options = {
        method: 'POST',
        body: JSON.stringify(quesData),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(function (ans) {
            $(`#${quesID}`).click();

            $(`#${quesID}`).css({ background: '#ED6060' });
        })
        .catch(err => console.log(err));

    event.preventDefault();
});

document.getElementById('test-finish').addEventListener('click', function () {
    var allQns = document.getElementsByClassName('dot');
    //console.log(allQns);
    var a = 0;
    var b = 0;
    var c = 0;

    for (var i = 0; i < allQns.length; i++) {
        var x = allQns[i];
        if (x.style.background === 'rgb(41, 185, 153)') {
            a += 1;
        } else if (x.style.background === 'rgb(237, 96, 96)') {
            b += 1;
        } else if (x.style.background === 'rgb(86, 95, 184)' || x.style.background === 'rgb(240, 223, 77)') {
            c += 1;
        }
    }


    document.getElementById('attempted-qn').textContent = a;
    document.getElementById('unattempted-qn').textContent = b;
    document.getElementById('marked-qn').textContent = c;
    document.getElementById('notattempted-qn').textContent = allQns.length - (a + b + c);

});

document.getElementById('submit-test').addEventListener('click', function () {

    var finishButton = document.getElementById('finish-button');
    var startTime = document.getElementById('demo').textContent;

    finishButton.href += `/${startTime}`;
    console.log(finishButton.href);
    finishButton.click();
});



//Timer clock to count down time
function timeToSeconds(timeArray) {
    var hours = timeArray[0] * 1;
    var minutes = (timeArray[1] * 1);
    var seconds = (hours * 3600) + (minutes * 60) + (timeArray[2] * 1);
    return seconds;
}

function secondsToTime(secs) {
    var hours = Math.floor(secs / (60 * 60));
    hours = hours < 10 ? '0' + hours : hours;

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
}

function countdown() {
    var time = document.getElementById('demo').innerHTML;
    time += ':00';
    var timeArray = time.split(':');
    var seconds = timeToSeconds(timeArray);

    if (seconds == '') {
        temp = document.getElementById('demo');
        temp.innerHTML = "00:00";

        return;
    }
    seconds--;
    temp = document.getElementById('demo');
    temp.innerHTML = secondsToTime(seconds);
    timeoutMyOswego = setTimeout(countdown, 1000);
}

var timeBefore = document.getElementById('demo').innerHTML;
timeBefore += ':00';


// function myBlues() {
//     var allBlues = document.getElementsByClassName('optionsLine');
//     console.log(allBlues);
//     var option = [];

//     for (var i = 0; i < allBlues.length; i++) {
//         option = allBlues[i].firstElementChild;
//         allBlues[i].addEventListener('click', function () {
//             option[i].click();
//         });
//     }
// }



// $('.optionsLine').on( 'click', function(){
//     console.log('clicke bitch');
//     //$(this).parent().css({ background: '#bef5ff'});
// });

// $('.optionsLine').click
countdown();