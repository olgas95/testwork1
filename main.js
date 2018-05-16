
//Объявляем переменные для кнопок
var clickButtonOne = document.getElementById('topButtonOne');
var clickButtonTwo = document.getElementById('topButtonTwo');
var clickButtonThree = document.getElementById('topButtonThree');
var tableOne = document.getElementById("tableOne");
var tableTwo = document.getElementById("tableTwo");
var tableThree = document.getElementById("tableThree");
//функции отоброжения таблиц


function topButtonClick(numberOfButton){
        switch(numberOfButton){
        case 0:
            clickButtonOne.classList.add('action');
            clickButtonTwo.classList.remove('action');
            clickButtonThree.classList.remove('action');
            tableOne.style.display = "block";
            tableTwo.style.display = "none";
            tableThree.style.display = "none";
            break;

        case 1:
            clickButtonOne.classList.remove('action');
            clickButtonTwo.classList.add('action');
            clickButtonThree.classList.remove('action');
            tableOne.style.display = "none";
            tableTwo.style.display = "block";
            tableThree.style.display = "none";
            break;

        case 2:
            clickButtonOne.classList.remove('action');
            clickButtonTwo.classList.remove('action');
            clickButtonThree.classList.add('action');
            tableOne.style.display = "none";
            tableTwo.style.display = "none";
            tableThree.style.display = "block";
            break;
        default:
            alert("Нет кейса")
    };
}
