// opakování na dny
// opakování každý měsíc, den, rok
// 
// 
// 

class Data{
    constructor(){
        this.itemList = [];
        this.id = 0;
        this.completed = [];
    }
}

function saveData(){
    localStorage.setItem("data", JSON.stringify(data)); 
}

function getData(){
    data = JSON.parse(localStorage.getItem("data"));
    if (data == null) {
        data = new Data();
    }
}

class Element{
    //form static
    static submit(){return _submit;}
    static title(){return _title;}
    static date(){return _date;}
    static timeRe(){return _timeRe;}
    static coment(){return _coment;}
    static star(){return _star}
}

class Utils{
    create(param1, param2){
        arguments
        const some = document.createElement(param1);
        param2.appendChild(some);
        some.className = arguments[2];
        return some;
    }

    time(time){
        var datetime = time.getHours() + ":" + ((time.getMinutes()<10?'0':'') + time.getMinutes());
        return datetime;
    }

    clearAllChildren(node){
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
}






class UI{
    constructor(){
        Notification.requestPermission();
        this.taskFormHide = document.getElementById("add-task-form-hide");
        this.container = document.getElementById("container")
        this.contentFlex = document.getElementById("content-flex");
        this.submitButton = document.getElementById("submit-button");
        this.deleteButton = document.getElementsByClassName("delete-button");
        this.contentFlex = document.getElementById("content-flex");
		this.toggleButton = document.getElementById("submit-button");
        this.toggled = true;
        this.completedToggle = true;
        this.importantToggle = true;
        this.utils = new Utils();
        this.important = false;
        this.createTaskForm();
    };

    createTaskForm(){
        // vytváření elementů
        const taskForm = this.utils.create("form", this.taskFormHide);
        Element.title = this.utils.create("input", taskForm, "form-input-text");
        Element.date = this.utils.create("input", taskForm, "set-date");
        Element.timeRe = this.utils.create("input", taskForm, "time-reminder");
        Element.coment = this.utils.create("input", taskForm, "coment-text");
        const _submit = this.utils.create("input", taskForm, "form-input-submit");
        Element.star = this.utils.create("button", this.taskFormHide, "form-important");

        //nastavování typ elementů
        Element.title.type = "text";
        Element.date.type = "datetime-local";
        Element.timeRe.type = "number";
        Element.coment.type = "text";
        _submit.type = "submit";

        //nastavení placeholderů
        Element.title.placeholder = "Enter task";
        Element.timeRe.placeholder = "-min";
        Element.coment.placeholder = "description";

        // star button
        Element.star.onclick=()=>{
            if (this.important) {
                this.important = false;
                Element.star.className = "form-important";
            }
            else if(!this.important){
                Element.star.className = "form-important-clicked";
                this.important = true;
            }
            saveData();
        }
        //submit
        taskForm.onsubmit =() =>{
            if (Element.title.value != "") {
                //nastavení hodnot
                var title = Element.title.value;
                var date = Element.date.value;
                var timeRe = Element.timeRe.value;
                var coment = Element.coment.value;

                //vytváření objekut
                var item ={
                    id: data.id,
                    taskName: title,
                    date: date,
                    timeRe: timeRe,
                    coment: coment,
                    checked: false,
                    reminded: true,
                    important: this.important
                };

                // inkrementace id, uložení do listu, vymazání, ulžení, vykreslení, zavření formu, spouštění upozornění
                data.id++;
                data.itemList.push(item);
                this.utils.clearAllChildren(this.contentFlex);
                saveData();
                this.render();
                this.toggleMethod();
                this.alertByDate();
            }
        }
    }
    
    render(list){
        list = list || data.itemList;

		this.container.style.backgroundColor = "white";
		
            list.map(item =>{ 
                const toDoContainer = this.utils.create("div", this.contentFlex, "to-do-container");
                const toDoItem = this.utils.create("div", toDoContainer, "to-do-item");
                const checkboxButton = this.utils.create("button", toDoItem, "to-do-checkbox");
				const label = this.utils.create("label", toDoItem);
                const buttonTrash = this.utils.create("button", toDoItem, "delete-button");
                
				label.innerHTML = item.taskName;
				if (item.coment !="" || item.date != "") {
				const coment = this.utils.create("div", toDoContainer, "to-do-coment");
				
				var datetime = this.utils.time(new Date(item.date));
				if (item.date != "") {
					coment.innerHTML = datetime + `<pre>` + item.coment;
				}
				else if (item.coment !=""){
					coment.innerHTML = `<pre>` + item.coment;
				}
				
				label.onmouseover = () =>{
					var delay = setTimeout(()=>{coment.style.display = "flex"},1000);
					label.onmouseout = () =>{
						coment.style.display = "none";
						clearTimeout(delay);
						};
				}
				}

				if (list == data.itemList) {
					label.style.cursor = "pointer";
					checkboxButton.style.cursor = "pointer";
                    buttonTrash.style.cursor = "pointer";
                    
                    label.onclick = () => {
                        let id = parseInt(item.id);
                        Element.title.value = item.taskName;
                        Element.date.value = item.date;
                        Element.timeRe.value = item.timeRe;
                        Element.coment.value = item.coment;
                        
                        this.toggleMethod();
                        let tempList = data.itemList.filter(function(item){
                        return item.id !== id;
                        })
                        data.itemList = tempList;
                        saveData();
                    };
				
                    checkboxButton.onclick = () =>{
                        if (item.checked) {
                            let id = parseInt(item.id);
                            if (item.id == id && item.checked == true && data.completed != null) {
                                data.completed.pop();
                            }
                            
                            label.style.textDecoration = "initial";
                            checkboxButton.className = "to-do-checkbox";
                            
                            item.checked = false;
                            saveData();
                        }
                        else if (!item.checked) {
                            label.style.textDecoration = "line-through";
                            checkboxButton.className = "to-do-checkbox-unchecked";

                            let id = parseInt(item.id);
                                if (item.id == id && item.checked == false) {
                                    data.completed.push(item);
                                }

                            item.checked = true;
                            saveData();
                        }
                    };
                    
                    buttonTrash.onclick = () => {
                        let id = parseInt(item.id);
                        toDoContainer.remove(this);
                        let tempList = data.itemList.filter(function(i){
                        return i.id !== id;
                        });
                        data.itemList = tempList;
                        saveData();
                    };
				}

				if (list != data.itemList) {
					buttonTrash.style.background = "none";
				}

                if (item.checked) {
                    label.style.textDecoration = "line-through";
                    checkboxButton.className = "to-do-checkbox-unchecked";
                }
                else if (!item.checked) {
                    label.style.textDecoration = "initial";
                    checkboxButton.className = "to-do-checkbox";
                }
            });
    };

    toggleMethod(){
        if (!this.toggled) {
            this.toggled = true;
            addTaskForm.style.display = 'none';
        }
        else if(this.toggled){
            this.toggled = false;
            addTaskForm.style.display = 'flex';
        }
    };

    alertByDate(){
		var interval = setInterval(() => {

			data.itemList.map(item=>{

				if (item.reminded) {

				let dataTime = new Date(item.date);
				let time = new Date();
				let minusTime = item.timeRe * 60000;

				var stamp = new Date(dataTime - minusTime);

					if (dataTime - minusTime <= time  &&!item.checked) {

						if (!("Notification" in window)) {
							alert("This browser does not support notifications");
						}
						else if (Notification.permission === "granted") {
							var datetime = this.utils.time(dataTime);
							var noti = new Notification(item.taskName,{
								icon: "./icons/checkboxUn.png", 
								body: datetime,
								timestamp: stamp
							});

							noti.onclick = () =>{
								window.open("/");
							}

							item.reminded = false;
							clearInterval(interval);
							saveData();
						}
						else if (Notification.permission !== "denied") {
							Notification.requestPermission(permission =>{
								if (permission === "granted") {
									this.alertByDate();
								}
							});
						}
					}
				}
			});
		}, 5000);
}

    createImporantPanel(){
        //vyfiltrování itemů označené jako important
        var importantList = data.itemList.filter((i)=>{
            return i.important == true;
        });
        //tlačítko important v menu, vymazání childs
        const aButton = document.getElementById("important");
        this.utils.clearAllChildren(this.contentFlex);

        //toggle
        if (this.importantToggle) {
            //vykreslení list důležitě označených itemů, změna barvy pozadí a nastavení togglu na false
            this.render(importantList);
            this.container.style.backgroundColor = "#E9EBEE";
            aButton.style = "filter: invert(100%)";
            
            this.importantToggle = false;
        }
        else if (!this.importantToggle) {
            //vrácení do normálu a nastavení togglu na true
            this.render();
            aButton.style = "filter: invert(0%)";
            
            this.importantToggle = true;
        }
    }

    createCompletePanel(){
		const cButton = document.getElementById("completed");
        this.utils.clearAllChildren(this.contentFlex);
        
        if (this.completedToggle) {
			this.render(data.completed);
			this.container.style.backgroundColor = "#E9EBEE";
			cButton.style = "filter: invert(100%)";
			
			this.completedToggle = false;
        }
        else if(!this.completedToggle){
			this.render();
			cButton.style = "filter: invert(0%)";
			this.completedToggle = true;
        }
    }
}

function eventListeners(){
    const ui = new UI();
    this.toggleButton = document.getElementById("submit-button");
    this.addTaskForm = document.getElementById("add-task-form-hide");
    this.completeButton = document.getElementById("completed");
    this.starButton = document.getElementById("important");


    toggleButton.addEventListener("click", function(){
		ui.toggleMethod();
    });

    starButton.addEventListener("click", ()=>{
        ui.createImporantPanel();
    });

    completeButton.addEventListener("click", ()=>{
        ui.createCompletePanel();
    });
    window.onload = ()=>{
        Data.itemList = getData();
        Data.id = getData();
        Data.completed = getData();
        ui.render();
        ui.alertByDate();
    }
    
};

document.addEventListener("DOMContentLoaded", function(){
    eventListeners();
});