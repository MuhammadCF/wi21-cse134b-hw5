import {signIn, retrieveArticles, uploadArticles, modifyArticles, removeArticles} from "./firebase.js"

const addBtn = document.getElementById("addBtn");
const entries = document.getElementById("entries");

const addDialog = document.getElementById("addDialog");
const editDialog = document.getElementById("editDialog");
const deleteDialog = document.getElementById("deleteDialog");
const signoutDialog = document.getElementById("signoutDialog")
const signinDialog = document.getElementById("signinDialog")
const signBtn =  document.querySelector("#signin button");

let storage = {};

let fire;

window.addEventListener("DOMContentLoaded", () => {
    fire  = localStorage.getItem("fire");
    
    storage = retrieveArticles();
    prepopulate();

    if(fire){
        fire = JSON.parse(fire);
        signBtn.textContent = "signOut";
        addBtn.style.display = "inline";
        


        signBtn.addEventListener("click", () => {

            if (typeof editDialog.showModal === "function"){
                
        
                signoutDialog.showModal();
            }
            else{
                alert("this browser does not support <dialog>")
            }
        })
    }
    else{
        signBtn.textContent = "signIn";
        addBtn.style.display = "none";
        
        signBtn.addEventListener("click", () => {

            if (typeof editDialog.showModal === "function"){
                
        

                signinDialog.showModal();
                
            }
            else{
                alert("this browser does not support <dialog>")
            }
        })

    }


})


// storage[0] = {
//     title: "10 best noodle recipes",
//     date: "1/3/2021",
//     body: "curated collection of recipes for noodles from different cultures"
// }

// storage[1] = {
//     title: "10 best operating systems",
//     date: "1/3/2021",
//     body: "curated collection of highly popular OS"
// }
//let activeId = 2;
let editId = 0;
let deleteId = 0;


addBtn.addEventListener('click', () => {
    if (typeof addDialog.showModal === "function"){
        

        addDialog.showModal();
    }
    else{
        alert("this browser does not support <dialog>")
    }
})

function prepopulate(){

    Object.entries(storage).forEach((data) => {

        let entry = createNewEntry(data[1].title,data[1].date,data[1].body,data[0]);
        entries.appendChild(entry);
        bindEntry(entry);
    })



}

function addLogic(dialog){

    dialog.addEventListener('close', () => {
    
        let title = document.querySelector('#addDialog .title')
        const date = document.querySelector('#addDialog .date')
        let summary = document.querySelector('#addDialog .summary')
        let answer = dialog.returnValue;

        if(answer == ""){
            
        }
        else{
            title = getCleanInput(title.value);
            summary = getCleanInput(summary.value);

            addEntry(title,date.value,summary);
            //<b onmouseover="alert('
        }
        
    })

}

function editLogic(dialog){

    dialog.addEventListener('close', () => {
    
        let title = document.querySelector('#editDialog .title')
        const date = document.querySelector('#editDialog .date')
        let summary = document.querySelector('#editDialog .summary')
        let answer = dialog.returnValue;

        if(answer == ""){
            
        }
        else{
            title = getCleanInput(title.value);
            summary = getCleanInput(summary.value);

            editEntry(title,date.value,summary);
            //<b onmouseover="alert('
        }
        
    })

}

function deleteLogic(dialog){

    dialog.addEventListener('close', () => {
    
        
        let answer = dialog.returnValue;

        if(answer == ""){
            
        }
        else{
            
            deleteEntry();
            //<b onmouseover="alert('
        }
        
    })

}
function signoutLogic(dialog){

    dialog.addEventListener('close', () => {
    
        
        let answer = dialog.returnValue;

        if(answer == ""){
            
        }
        else{

            localStorage.removeItem("fire");
            location.reload();
            //deleteEntry();
            //<b onmouseover="alert('
        }
        
    })

}
function signinLogic(dialog){

    dialog.addEventListener('close', () => {
    
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        let answer = dialog.returnValue;

        if(answer == ""){
            
        }
        else{

            signIn(email.value, password.value);
            
            //deleteEntry();
            //<b onmouseover="alert('
        }
        
    })

}




//New Task List Item
var createNewEntry = function (title, date, body, id) {
    
    var listItem = document.createElement("li");
    //listItem.setAttribute("id", idCounter);

    var content = document.createElement("span");

    //input (text)
    var editButton = document.createElement("button"); 

    //button.delete
    var deleteButton = document.createElement("button");


    editButton.classList.add("editBtn");
    editButton.classList.add("icon-pencil");
    editButton.textContent = "Edit";

    deleteButton.classList.add("deleteBtn");
    deleteButton.classList.add("icon-trash");
    deleteButton.textContent = "Delete";

    content.classList.add("content");


    listItem.appendChild(content);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    listItem.id = id;
    
    var text = `${title}-${date}-${body}`;
    var content = listItem.querySelector('span.content');
    content.textContent = text;



    return listItem;
};




//Add a new task
var addEntry = function (title, date, body) {



    let uid = fire.user.uid;
    
    
    activeId = uploadArticles(title, body, date, uid);
    
    var entry = createNewEntry(title,date,body,activeId);
    

    //Append new entry to the list
    entries.appendChild(entry);


    bindEntry(entry);


    storage[activeId] = {
        "title": title,
        "date": date,
        "body": body,
        "user_id": uid
    }

    //uploadArticles(title, date, body, uid);
    //storeTask(taskInput.value);
    //delete the item
    //activeId++;

}

var editEntry = function (title, date, body) {

    var entry = document.getElementById(`${editId}`);
    //Modify listItem
    var text = `${title}-${date}-${body}`;
    var content = entry.querySelector('span.content');
    content.textContent = text;


    storage[editId] = {
        "title": title,
        "date": date,
        "body": body,
        "user_id": fire.user.uid
    };
    modifyArticles(editId, title, body, date, fire.user.id);


    //editTask(taskInput.value);
    //delete the item

}

var deleteEntry = function () {

    var entry = document.getElementById(`${deleteId}`);

    entries.removeChild(entry);

    //storage[deleteId] = null;
    delete storage[deleteId];
    removeArticles(deleteId);
}


var bindEntry = function (entryItem) {


    var deleteButton = entryItem.querySelector("button.deleteBtn");
    var editButton = entryItem.querySelector("button.editBtn");
    //var content = entryItem.querySelector("span.content");
    var id = entryItem.id;


    editButton.addEventListener('click', () => {
        if (typeof editDialog.showModal === "function"){
            
    
            if(!fire){
                alert("not signed in, sign in first to edit")
            }
            else if(storage[id].user_id != fire.user.uid){
                alert("wrong account, you have no permission")
            }
            else{

                editDialog.showModal();
                editId = id;
            }
        }
        else{
            alert("this browser does not support <dialog>")
        }
    })

    //bind deleteTask to delete button
    deleteButton.addEventListener('click', () => {
        if (typeof deleteDialog.showModal === "function"){
            
    
            if(!fire){
                alert("not signed in, sign in first to remove")
            }
            else if(storage[id].user_id != fire.user.uid){
                alert("wrong account, you have no permission")
            }else{
                deleteDialog.showModal();
                deleteId = id;

            }
        }
        else{
            alert("this browser does not support <dialog>")
        }
    })


};

addLogic(addDialog);
editLogic(editDialog);
deleteLogic(deleteDialog);
signoutLogic(signoutDialog);
signinLogic(signinDialog);

