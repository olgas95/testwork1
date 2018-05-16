"use strict";

// СТРУКТУРА ЭЛЕМЕНТА МЕНЮ
var options = [{
    title: "Контакты", // Название меню
    active: true,
    elemsHeader: ["ID","Имя","Фамилия","Телефон"],
    elems: [[1,"Иван","Иванов",88005553535],[2,"Петр","Петров",3151531513],[3,"Николай","Николаев",1351313531]]
},{
    title: "Информация",
    active: false,
    elemsHeader: ["ID","Баланс","Роль"],
    elems: [[1,100,"user"],[2,200,"manager"],[3,0,"user"]]
},
{
    title: "Переводы",
    active: false,
    elemsHeader: ["ID","Отправитель","Получатель","Сумма","Комментарий"],
    elems: [[1,2,1,10,"Привет"],[2,2,3,20,"Как дела"],[3,15,4,20,"Что нового"]]

}];



var container = document.getElementById("container");

createComponent(container, options);

function createComponent(parentElement, options){
    var state = options;
    var sortBy = -1; 
    var activeTable = 0; 
    var functionSortByField;
    var searchText = "";

    var sortIsEnabled = false;
    var menuRendered = false;
    var tableRendered = false;
    var searchRendered = false;
    var createDataFormRendered = false;
  
    firstRender();

    function firstRender(){
        createMenuElement(); // Меню, снизу динамично всё
        changeTable(0); // По умолчанию первый элемент активный
        
    }
 
//------------ВЕРХНЕЕ МЕНЮ ИЗ КНОПОК---------------//
    function createMenuElement(){
        if(menuRendered) return;
        
        var buttonRow = document.createElement("div"); 
        buttonRow.setAttribute("id","menu");

        state.forEach(function(element, buttonId){
            var topButton = document.createElement("span"); 
            topButton.classList.add("topButton");
            topButton.setAttribute("id","button" + buttonId);
            topButton.innerHTML = element.title; 
            topButton.addEventListener("click", buttonClick); 

            if(element.active){
                topButton.classList.add("action"); 
            }
            buttonRow.appendChild(topButton);  
        });

        parentElement.appendChild(buttonRow); 
        
        menuRendered = true;

        function buttonClick(Event){ 
            if(~Event.target.className.indexOf("action")) return;
            var number = parseInt(Event.target.id.replace("button",""),10);
            activeTable = number;
            return makeAction(number);
        }
        

        function makeAction(number){
            changeMenu(number); // Изменить активное меню
            changeTable(number); // Изменить активную таблицу
        }

        function changeMenu(activeNumber){
            var activeElement = buttonRow.querySelector(".action");
            var elemToMakeActive = document.getElementById("button" + activeNumber);
            activeElement.classList.remove("action");
            elemToMakeActive.classList.add("action");
            sortIsEnabled = false;
        }

        // Поисковая форма
        createSearchForm(); 
        function createSearchForm(){ 
            if(searchRendered) return;
            var form = document.createElement("form");
            form.setAttribute("type","text");
            form.setAttribute("onsubmit","return false;");
            
            var searchForm = document.createElement("input");
            searchForm.setAttribute("autocomplete","off");
            searchForm.setAttribute("id","search_id");
            searchForm.setAttribute("placeholder","Найти...");
            searchForm.addEventListener('input', TableSearch);
            
            form.appendChild(searchForm);
            buttonRow.appendChild(form);
            searchRendered = true;

            function TableSearch(Event){
                var valueSearch = Event.target.value;
                searchText = valueSearch.toLowerCase().trim();
                changeTable(activeTable);
            }
        }
 

    }

//------------ТАБЛИЦЫ---------------//
    function changeTable(numberOfTable){
        if(tableRendered) {
            removeOldTable();
        }

        var array = Object.assign({}, state[numberOfTable]); // копируем значения всех свойств из исходника в целевой объект
    
        //отбрасываем лишнее при поиске
        if(searchText){
            array.elems = array.elems.filter(function(rowFilter){
                var data = false;
                rowFilter.forEach(function(cellFilter){
                    var searchElement = cellFilter.toString().toLowerCase().indexOf(searchText); // возвращает первый индекс, по которому данный элемент может быть найден, или -1 - такого индекса нет.
                    if ( ~searchElement) data = true; 
                })
                return data;
            })  
        }
        
        
        var table = document.createElement("TABLE"); 
        table.setAttribute("id","mainTable");

        createHeaders(array.elemsHeader); // ссылаемся на функцию создания заголовков таблицы
        createTableElements(array.elems); // ссылаемся на функцию создания ячеек таблицы


        if(!tableRendered) {
            tableRendered = true;
        }
   
        
        function createHeaders(headersOfColums){ 
            var thead = document.createElement("THEAD");
            var tr = document.createElement("TR");
            
            headersOfColums.forEach(function(headerElement, id){ // функция перебора массива и создания заголовков
                var th = document.createElement("TH");
                if(id === (Math.abs(sortBy) - 1) && sortIsEnabled){
                    th.classList.add('thActive');
                    var arrow = (sortBy > 0) ? " &#9650;" : " &#9660;"; 
                    th.innerHTML = headerElement + arrow; 
                }else{
                    th.innerHTML = headerElement; 
                }
                th.setAttribute("id","cell" + id);
                th.addEventListener("click", sortByField); // повесили обработчик (сортировка)
                
                function sortByField(Event){
                    var number = parseInt(Event.target.id.replace("cell",""), 10);
                    sortByRow(number);
                };

                functionSortByField = sortByField;
                
                tr.appendChild(th); 
            });

            thead.appendChild(tr); 
            table.appendChild(thead); 
        }

        function sortByRow(number){ 
            sortIsEnabled = true;
            if(Math.abs(sortBy) !== number + 1){ 
                sortBy = number + 1; 
            }else{
                sortBy *= -1; 
            }
            changeTable(numberOfTable); 
        }

        
        function createTableElements(arrayOfRows){ // функция создания строк и ячеек 
            var tbody = document.createElement("TBODY");

            var smallerSort = (sortBy < 0) ? true : false; 
            var sortField = Math.abs(sortBy); 

            var sortedArray = arrayOfRows.sort(function(a, b){ 
                if(smallerSort){
                    return a[sortField - 1] > b[sortField - 1]; 
                }else{
                    return a[sortField - 1] < b[sortField - 1]; 
                }
            });

            var finalArraySortedOrNo = sortIsEnabled ? sortedArray : arrayOfRows;

            finalArraySortedOrNo.forEach(function(rowElem){
                var tr = document.createElement("TR");

                rowElem.forEach(function(cellElem){
                    var td = document.createElement("TD"); 
                    td.innerHTML = cellElem; 
                    
                    tr.appendChild(td); // добавляем ячейки
                });

                tbody.appendChild(tr); 
            });

            table.appendChild(tbody); 
            parentElement.appendChild(table); 
    }

     
        function removeOldTable(){ // функция удаления старой таблицы
            var headersOfTable = document.getElementsByTagName("th");
            for (var i = 0; i < headersOfTable.length; i++){ 
                headersOfTable[i].removeEventListener("click",functionSortByField);
            }
            var removableTable = document.getElementById("mainTable");
            removableTable.remove();
        }
    }


     // Форма для добавления строк 
     createDataForm();
     function createDataForm(){
         if(createDataFormRendered) return;
         
         var form = document.createElement("form");
         form.setAttribute("id","dataForm");

         var input = document.createElement("input");
         input.setAttribute("placeholder","Введите данные");
         input.setAttribute("autocomplete","off");

         var button = document.createElement("button");
         button.innerText = "Добавить";
         button.addEventListener("click", addDataRow);
         
         function addDataRow(Event){
             Event.preventDefault();
             //Считываем данные с формы
             var newRow = input.value;
             var arrData = newRow.split("|");
             if(state[activeTable].elemsHeader.length !== arrData.length){
                 alert("Некорректное заполнение!");
                 return;
             }
             if(state[activeTable].elemsHeader.length !== arrData.length){
                 alert("Некорректное заполнение!");
                 return;
             }
             state[activeTable].elems.push(arrData);
             changeTable(activeTable);
         }

         form.appendChild(input);
         form.appendChild(button);
         container.appendChild(form);

         createDataFormRendered = true;
     }
      

}