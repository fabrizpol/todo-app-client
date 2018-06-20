"use strict";

(function(window, session) {
    var sessionUuid = session.get();
    var srvUrl = 'http://192.168.20.173:7000';

    function ajaxCall (method, url, data, callbackFunction){
        var xhr = new XMLHttpRequest();

        xhr.open(method, url, true);

        

        xhr.addEventListener('progress', function (x) {
            //console.log(x);
        });


        xhr.addEventListener('error', function (x) {
            //callbackFunction(x);
        });

        xhr.addEventListener('abort', function (x) {
            //callbackFunction(x);
        });

        switch  (method){
            case 'GET':
            {
                xhr.addEventListener('load', function (x) {
                    callbackFunction(x.target.response);
                });
                xhr.send();
                break;
            }
            case 'POST': {
                xhr.addEventListener('load', function (x) {
                    callbackFunction(x.target.response);
                });
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                var json = JSON.stringify(data);
                xhr.send(json);
                break;
                }
            case 'PUT':
            {

                xhr.addEventListener('load', function (x) {
                    callbackFunction(x.target.response);
                });
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                var json = JSON.stringify(data);
                xhr.send(json);
                break;
            }
            case 'DELETE':
            {
                xhr.addEventListener('load', function (x) {
                    callbackFunction(x.target.response);
                });
                xhr.send();
                break;
            }
        }
    }

    function updateTodo(id, todoModel, callbackFunction) {
        // ajax call to patch method
        var url = srvUrl + '/todos/'+ id;
        console.log(url);
        ajaxCall('PUT', url, todoModel, callbackFunction);
    }

    function createTodo(todoModel, callbackFunction) {
        todoModel.data.uuid = sessionUuid;
        var url = srvUrl + '/todos';
        ajaxCall('POST', url, todoModel, callbackFunction);
    }

    function getTodos(callbackFunction) {
        var url = srvUrl + '/todos?uuid=' + sessionUuid;
        ajaxCall('GET', url, null, callbackFunction);
    }

    function deleteTodo(id, callbackFunction) {
        var url = srvUrl + '/todos/'+ id;
        ajaxCall('DELETE', url, null, callbackFunction);
    }

    // Export to window
    window.app = window.app || {};
    window.app.Store = {
        updateTodo: updateTodo,
        createTodo: createTodo,
        getTodos: getTodos,
        deleteTodo: deleteTodo
    };
})(window, window.app.Session);
