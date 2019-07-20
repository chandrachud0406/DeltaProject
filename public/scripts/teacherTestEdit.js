document.getElementById("create-ques").addEventListener('click', function (event) {
    //console.log(`create clicked ${event.target}`);
    createQn();
});

var lastClicked = document.querySelector('footer');
document.getElementById('queslist').addEventListener('click', function (event) {

    var quesID = event.target.id;
    //console.log(event.target);
    //console.log(event.target.nodeName);
    console.log('gjsdkbgsbdgdsbg1234');
    if (event.target.nodeName == 'BUTTON') {
        lastClicked.style = '#c4bdbd';
        event.target.style.background = 'green';
        lastClicked = event.target;
    }

    event.stopPropagation();
    //console.log(quesID);
    //event.preventDefault();
    viewQn(quesID);
});

function createQn() {
    var createQ = document.getElementById("create-ques");
    var quesList = document.getElementById("queslist");

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
var currentImages = ['/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png'];
function viewQn(quesID) {
    //console.log(quesID);
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
        questionNo.textContent = "Question no:" + ques.position;
        questionText.value = ques.question;

        if (ques.type == 0) {
            questionType.value = ques.type;
            questionTitleType.textContent = 'Single Correct Type'
            currentOptions = ques.options;
            console.log(currentOptions);
            questionType.dispatchEvent(new Event('change'));

        } else if (ques.type == 1) {
            questionType.value = ques.type;
            questionTitleType.textContent = 'Multiple Correct Type'
            currentOptions = ques.options;
            console.log(currentOptions);
            questionType.dispatchEvent(new Event('change'));

        } else if (ques.type == 2) {
            questionType.value = ques.type;
            questionTitleType.textContent = 'Numerical';
            questionType.dispatchEvent(new Event('change'));

        } else if (ques.type == 3) {
            questionType.value = ques.type;
            currentImages = ques.files;
            questionTitleType.textContent = 'Single Correct Type'

            console.log(currentImages);
            questionType.dispatchEvent(new Event('change'));

        } else if (ques.type == 4) {
            questionType.value = ques.type;
            currentImages = ques.files;
            questionTitleType.textContent = 'Multiple Correct Type'

            console.log(currentImages);
            questionType.dispatchEvent(new Event('change'));

        } else {
            questionType.value = ques.type;
            questionType.dispatchEvent(new Event('change'));
        }

    }).catch(function (err) {
        console.log(err);
    })
}


document.getElementById('answer-type').addEventListener('change', function (e) {
    var newOption = e.target.value;
    //    console.log(e.target);
    var parentID = e.target.parentNode;
    setAnswerType(newOption);
});

function setAnswerType(option) {

    var x = ``;
    if (option == "0") {
        //  console.log(option);
        x += `<p>A) </p><input type="radio" name="op" id="op1" >
        <input type="text" name="option1" value="${currentOptions[0]}" >
        <p>B) </p><input type="radio" name="op" id="op2" >
        <input type="text" name="option2" value="${currentOptions[1]}" >    
        <p>C) </p><input type="radio" name="op" id="op3" >
        <input type="text" name="option3" value="${currentOptions[2]}" >    
        <p>D) </p><input type="radio" name="op" id="op4" >
        <input type="text" name="option4" value="${currentOptions[3]}" >
        `;
    } else if (option == "1") {
        x += `<p>A) </p><input type="checkbox" id="op1" >
        <input type="text" name="option1" value="${currentOptions[0]}" >    
        <p>B) </p><input type="checkbox" id="op2" >
        <input type="text" name="option2" value="${currentOptions[1]}" >    
        <p>C) </p><input type="checkbox" id="op3" >
        <input type="text" name="option3" value="${currentOptions[2]}" >    
        <p>D) </p><input type="checkbox" id="op4" >
        <input type="text" name="option4" value="${currentOptions[3]}" >
        `;
    } else if (option == "2") {
        x += `<input type="number" id="op1">
        `;
     } else if (option == "3") {
        x += `<p>A) </p><input type="radio" name="op" id="op1" >
        <input type="file" />
        <img src="${currentImages[0]}" width="200" height="150">       
        <p>B) </p><input type="radio" name="op" id="op2" >
        <input type="file" />
        <img src="${currentImages[1]}" width="200" height="150">
        <p>C) </p><input type="radio" name="op" id="op3" >
        <input type="file" />
        <img src="${currentImages[2]}" width="200" height="150">
        <p>D) </p><input type="radio" name="op" id="op4" >
        <input type="file" />
        <img src="${currentImages[3]}" width="200" height="150">
        `;
    } else if (option == "4") {
        x += `<p>A) </p><input type="checkbox" id="op1" >
        <input type="file" />
        <img src="${currentImages[0]}" width="200" height="150">       
        <p>B) </p><input type="checkbox" id="op2" >
        <input type="file" />
        <img src="${currentImages[1]}" width="200" height="150">
        <p>C) </p><input type="checkbox" id="op3" >
        <input type="file" />
        <img src="${currentImages[2]}" width="200" height="150">
        <p>D) </p><input type="checkbox" id="op4" >
        <input type="file" />
        <img src="${currentImages[3]}" width="200" height="150">
    `;
    }
    document.getElementById('answers').innerHTML = x;
}


document.querySelector('#main form').addEventListener('submit', function (event) {
    var currentForm = document.querySelector("#main form");
    var quesID = currentForm.name;
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

    //console.log(formData.getAll('myFiles'));

    var quesData = {
        text: questionText,
        type: questionType,
        op1: option1,
        op2: option2,
        op3: option3,
        op4: option4
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
        .then(function(ques){
            console.log(lastClicked.style.background);
            lastClicked.click();
            console.log(ques)})
        .catch(err => console.log(err));

    event.preventDefault();

});

//document.getElementById('test-title').addEventListener('k')