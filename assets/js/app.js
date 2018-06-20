"use strict";

(function(window, document) {

    // Please read me! https://stackoverflow.com/a/8835458
    window.addEventListener('load', function() {
        
        
        var count = 0;
        var bttAdd = document.getElementById('bttAdd');
        var divList = document.getElementById('divList');
        var bttRmv = document.getElementById('bttRmv');
        var bttCnc = document.getElementById('bttCnc');
        var txtB = document.getElementById('txtBox');

        var checkedText;

        var list = document.createElement('div');
        list.setAttribute('id', 'todolist');
        
        divList.append(list);

        window.app.Store.getTodos(printTodo);

        function searchIdToModify (json, txt, m)
        {
            var model;
            for(var i=0; i< json.data.docs.length; i++)
            {
                var flag=0;
                //console.log(json.data.docs[i].content);
                if (json.data.docs[i].content == txt)
                {
                    console.log('trovato!');
                    flag=1;
                    switch (m)
                    {
                        case 'E' :
                            window.app.Store.deleteTodo(json.data.docs[i]._id, getControl);
                            break;
                        case 'D' :
                            model = {
                                "data": {
                                    "done": true
                                }
                            };
                            console.log("setta true");
                            window.app.Store.updateTodo(json.data.docs[i]._id, model,controlPost);
                            break;
                        case 'ND' :
                            model = {
                                "data": {
                                    "done": false
                                }
                            };
                            console.log("setta false");
                            window.app.Store.updateTodo(json.data.docs[i]._id, model,controlPost);
                            break;
                        defalut:
                            console.log('searchIdtoModify: azione non definita correttamente');
                    }

                }
                if(flag==1)
                {
                    break;
                }

            }
            
        }

        function createP(txt, ckd) {
            count++;
            var pdiv = document.createElement('div');
            var todo = document.createElement('p');
            pdiv.setAttribute('id','pdiv' + count);
            pdiv.className = 'pdiv';
            todo.setAttribute('id','p' + count);
            todo.className = 'list';
            var tdl = document.getElementById('todolist');
            todo.textContent = count + ')' + ' ' + txt;
            
            var chkbox = document.createElement('input');
            chkbox.setAttribute('id','ckb'+ count);
            chkbox.setAttribute('type', 'checkbox');
            chkbox.className = 'checkbox';
            if(ckd==1) {
                chkbox.setAttribute('checked', 'checked');
            }
            pdiv.append(chkbox);
            pdiv.append(todo);
            tdl.append(pdiv);

            todo.addEventListener('click', function(e){
                var str = todo.textContent;
                //console.log(str);
                var n = str.search(" ");
                txtB.value = str.substring(n+1);
            })

            chkbox.addEventListener('change', function(e){
                //console.log('il valore della checkbox' + chkbox.value);
                
                if (chkbox.checked == true)
                {
                    checkedText = txt;
                    console.log('bru bru');
                    window.app.Store.getTodos(getToDone);
                }
                else 
                {
                    checkedText = txt;
                    console.log('fri fri');
                    window.app.Store.getTodos(getToUndone);
                }
            })
            
        }

        function printTodo(response){
            var json = JSON.parse(response);
            var ckd = 0;
            console.log(json);

            if (json.data.docs != 0){
                    for (var i=0; i< json.data.docs.length; i++)
                    {
                        if(json.data.docs[i].deleted == false){
                            if (json.data.docs[i].done == true) {
                                ckd = 1;
                            }
                            else {ckd = 0;}
                            createP(json.data.docs[i].content, ckd);
                        }
                    }
            }
            else {
                var tdl = document.getElementById('todolist');
                var p = document.createElement('p');
                p.setAttribute('id','empty');
                p.textContent = 'Lista vuota';
                tdl.append(p);
            }
        }

        function controlPost(response) {
            var json = JSON.parse(response);
            //console.log(json);
            console.log(response);
        }

        function getControl(){
            count=0;
            divList.innerHTML = '<div id="todolist"></div>';
            window.app.Store.getTodos(printTodo);
        }

        

        function getToUndone(response){
            var json = JSON.parse(response);
            //console.log('undone');
            searchIdToModify(json, checkedText, 'ND');
        }

        function getToDone(response){
            var json = JSON.parse(response);
            console.log(checkedText);
            searchIdToModify(json, checkedText, 'D');
        }

        function getToDelete(response){
            var json = JSON.parse(response);
            //console.log(txtB.value);
            searchIdToModify(json, txtB.value, 'E');
        }

        bttAdd.addEventListener('click', function (e){
            //count++;
            var txtB = document.getElementById('txtBox');
            var txt = txtB.value;
            if(document.getElementById('empty'))
            {
                
                var empty = document.getElementById('empty');
                //console.log(empty);
                empty.remove();
            }
            createP(txt);
            var todo = {
                "data": {
                    "uuid": "",
                    "content": txt,
                    "done": false
                }
            };
            window.app.Store.createTodo(todo, controlPost);
            txtB.value = "";
        });

        bttCnc.addEventListener('click', function(e){
            txtB.value = "";
        })

        bttRmv.addEventListener('click', function (e){
            //count--;
            
            window.app.Store.getTodos(getToDelete);
            

        })
     });
})(window, document);
