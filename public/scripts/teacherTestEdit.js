var lastClicked = document.createElement('button');
lastClicked.style.background = 'green';

document.getElementById("create-ques").addEventListener('click', function (event) {
    //console.log(`create clicked ${event.target}`);
    //    lastClicked.click();
    createQn();
});

document.getElementById('queslist').addEventListener('click', function (event) {

    var quesID = event.target.id;
    //console.log(event.target);
    //console.log(event.target.nodeName);
    if (event.target.className == 'dot') {
        if (lastClicked.style.background === 'green') {
            lastClicked.style.background = '#c4bdbd';
            console.log(lastClicked.style.background + '$$$' + lastClicked.textContent);
            event.target.style.background = 'green';
            lastClicked = event.target;
            console.log(lastClicked.style.background + '$$$' + lastClicked.textContent);
        }
    }

    event.stopPropagation();
    //console.log(quesID);
    //event.preventDefault();
    viewQn(quesID);
});


window.onload = clickFirst();
function clickFirst() {

    var qns = document.getElementsByClassName('dot');
    //console.log(qns);

    for (var i = 0; i < qns.length; i++) {
        if (qns[i].textContent == 1) {
            qns[i].click();
        }
    }
}

function createQn() {
    var createQ = document.getElementById("create-ques");
    var quesList = document.getElementById("queslist");
    document.querySelector('#main').setAttribute('class', 'main2');
//    document.querySelector('#mains').setAttribute('class', 'main4');

    //console.log('i am here');
    // console.log(quesList.innerHTML);
    // console.log(createQ[0]);
    //console.log(createQ[0].value);
    var url = `/test/${createQ.name}/question/create`;
    //  console.log(url);

    fetch(url).then(function (res) {
        //  console.log(res);
        return res.json()
    }).then(function (ques) {
        var x = `<div class="col-xs-3 dot btn" id="" ></div>`;
        //console.log(x);
        quesList.innerHTML += `<div class="col-xs-3"><button class="dot" id="${ques._id}">${ques.position}</button></div>`;

        //console.log(ques);
    }).catch(function (err) {
        console.log(err);
    });
}

var currentOptions = ['option1', 'option2', 'option3', 'option4'];
var boolOptions = [false, false, false, false];
var currentImages = ['/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png'];

function setOptions() {
    document.getElementById('op1').checked = boolOptions[0];
    document.getElementById('op2').checked = boolOptions[1];
    document.getElementById('op3').checked = boolOptions[2];
    document.getElementById('op4').checked = boolOptions[3];
}

function viewQn(quesID) {
    //console.log(quesID);
    document.querySelector('#main').setAttribute('class', 'main2');
    var questionSpace = document.getElementById("main");
    var questionNo = document.querySelector("#main #question-no");
    var questionTitleType = document.querySelector("#main #question-type");
    var questionText = document.querySelector("#question-text");
    var questionType = document.getElementById('answer-type');
    var formElement = document.querySelector("#main form");
    formElement.name = quesID;

    var url = `/question/${quesID}/edit`;

    fetch(url).then(function (res) {
        return res.json();
    }).then(function (ques) {
        questionNo.textContent = "Question no: " + ques.position;
        questionText.value = ques.question;

        if (ques.type == 0) {
            questionType.value = ques.type;
            questionTitleType.textContent = 'Single Correct Type'
            currentOptions = ques.options;
            boolOptions = ques.correctAnswers;
            console.log(currentOptions);
            questionType.dispatchEvent(new Event('change'));

        } else if (ques.type == 1) {
            questionType.value = ques.type;
            questionTitleType.textContent = 'Multiple Correct Type'
            currentOptions = ques.options;
            boolOptions = ques.correctAnswers;
            console.log(currentOptions);
            questionType.dispatchEvent(new Event('change'));

        } else if (ques.type == 2) {
            questionType.value = ques.type;
            questionTitleType.textContent = 'Numerical';
            boolOptions = ques.correctAnswers;
            questionType.dispatchEvent(new Event('change'));

        } else if (ques.type == 3) {
            questionType.value = ques.type;
            boolOptions = ques.correctAnswers;
            currentImages = ques.files;
            questionTitleType.textContent = 'Single Correct Type'
            console.log(currentImages);
            questionType.dispatchEvent(new Event('change'));

        } else if (ques.type == 4) {
            questionType.value = ques.type;
            boolOptions = ques.correctAnswers;
            currentImages = ques.files;
            questionTitleType.textContent = 'Multiple Correct Type'
            console.log(currentImages);
            questionType.dispatchEvent(new Event('change'));

        } else {
            questionType.value = ques.type;
            questionTitleType.textContent = 'None';

            currentOptions = ['option1', 'option2', 'option3', 'option4'];
            boolOptions = [false, false, false, false];
            currentImages = ['/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png'];

            questionType.dispatchEvent(new Event('change'));
        }

    }).catch(function (err) {
        console.log(err);
    })
}
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

document.getElementById('answer-type').addEventListener('change', function (e) {
    var newOption = e.target.value;
    //    console.log(e.target);
    var parentID = e.target.parentNode;
    setAnswerType(newOption);
});

function setAnswerType(option) {
    if (arraysEqual(currentOptions, ['option1', 'option2', 'option3', 'option4']) == false) {

    }
    var x = ``;
    if (option == "0") {
        //  console.log(option);
        x += `<div class="optionsWay"> <input type="radio" name="op" id="op1" > A) <input type="text" name="option1" value="${currentOptions[0]}" ></div>
        <div class="optionsWay"> <input type="radio" name="op" id="op2" > B) <input type="text" name="option2" value="${currentOptions[1]}" ></div>    
        <div class="optionsWay"> <input type="radio" name="op" id="op3" > C) <input type="text" name="option3" value="${currentOptions[2]}" ></div>    
        <div class="optionsWay"> <input type="radio" name="op" id="op4" > D) <input type="text" name="option4" value="${currentOptions[3]}" ></div>
        `;
    } else if (option == "1") {
        x += `<div class="optionsWay"> <input type="checkbox" name="op" id="op1" > A) <input type="text" name="option1" value="${currentOptions[0]}" ></div>
        <div class="optionsWay"> <input type="checkbox" name="op" id="op2" > B) <input type="text" name="option2" value="${currentOptions[1]}" ></div>    
        <div class="optionsWay"> <input type="checkbox" name="op" id="op3" > C) <input type="text" name="option3" value="${currentOptions[2]}" ></div>    
        <div class="optionsWay"> <input type="checkbox" name="op" id="op4" > D) <input type="text" name="option4" value="${currentOptions[3]}" ></div>
        `;
    } else if (option == "2") {
        x += `<p> Numerical </p>
        <input type="number" id="op1" value=${boolOptions[0]}>
        `;
    } else if (option == "3") {
        x += `<div class="optionsWay"> <input type="radio" name="op" id="op1" > A)  <input type="file" class="imgfile" required/> <img src="${currentImages[0]}" width="200" height="150"> </div>
        <div class="optionsWay"> <input type="radio" name="op" id="op2" > B)  <input type="file" class="imgfile" required/> <img src="${currentImages[1]}" width="200" height="150"> </div>    
        <div class="optionsWay"> <input type="radio" name="op" id="op3" > C)  <input type="file" class="imgfile" required/> <img src="${currentImages[2]}" width="200" height="150"> </div>    
        <div class="optionsWay"> <input type="radio" name="op" id="op4" > D)  <input type="file" class="imgfile" required/> <img src="${currentImages[3]}" width="200" height="150"> </div>
        `;

    } else if (option == "4") {
        x += `<div class="optionsWay"> <input type="checkbox" name="op" id="op1" > A)  <input type="file" class="imgfile" required/> <img src="${currentImages[0]}" width="200" height="150"> </div>
        <div class="optionsWay"> <input type="checkbox" name="op" id="op2" > B)  <input type="file" class="imgfile" required/> <img src="${currentImages[1]}" width="200" height="150"> </div>    
        <div class="optionsWay"> <input type="checkbox" name="op" id="op3" > C)  <input type="file" class="imgfile" required/> <img src="${currentImages[2]}" width="200" height="150"> </div>    
        <div class="optionsWay"> <input type="checkbox" name="op" id="op4" > D)  <input type="file" class="imgfile" required/> <img src="${currentImages[3]}" width="200" height="150"> </div>
        `;
    }
    document.getElementById('answers').innerHTML = x;
    setOptions();
}


document.querySelector('#main form').addEventListener('submit', function (event) {

    var currentForm = document.querySelector("#main form");
    var quesID = currentForm.name;
    $('.toast').toast('show');
    var questionText = document.querySelector("#question-text").value;
    var questionType = document.querySelector("#answer-type").value;
    var images = document.querySelectorAll('input[type="file"]');
    //console.log(images);
    if (questionType == 0 || questionType == 1) {
        var option1 = document.getElementsByName("option1")[0].value;
        var option2 = document.getElementsByName("option2")[0].value;
        var option3 = document.getElementsByName("option3")[0].value;
        var option4 = document.getElementsByName("option4")[0].value;
    }

    var formData = new FormData();
    if (questionType == 3 || questionType == 4) {

        for (var i = 0; i < images.length; i++) {
            formData.append('myFiles', images[i].files[0]);
        }
    }

    if (questionType != 2) {
        var boolOp1 = document.getElementById('op1').checked;
        var boolOp2 = document.getElementById('op2').checked;
        var boolOp3 = document.getElementById('op3').checked;
        var boolOp4 = document.getElementById('op4').checked;
        var boolArray = [boolOp1, boolOp2, boolOp3, boolOp4];
    }
    //console.log(formData.getAll('myFiles'));
    if (questionType == 2) {
        var boolOp1 = document.getElementById('op1').value;
        var boolArray = [boolOp1, false, false, false];
    }

    var quesData = {
        text: questionText,
        type: questionType,
        op1: option1,
        op2: option2,
        op3: option3,
        op4: option4,
        boolArray: boolArray
    }

    formData.append('ques', JSON.stringify(quesData));
    //console.log(quesData);
    var url = `/question/${quesID}/edit/save`;

    //console.log(url);
    //console.log(formData.getAll('myFiles'));

    var options = {
        method: 'POST',
        body: formData,
    };

    if (options && options.headers) {
        delete options.headers['Content-Type'];
    }

    fetch(url, options)
        .then(res => res.json())
        .then(function (ques) {
            console.log(lastClicked.style.background);
            lastClicked.click();
            console.log(ques)
        })
        .catch(err => console.log(err));

    event.preventDefault();

});
