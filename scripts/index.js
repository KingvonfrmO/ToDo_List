document.addEventListener('DOMContentLoaded', function(){
    let taskArray = [];
    const taskContainer = document.querySelector('.task-container');
    const addButton = document.querySelector('.add-btn');
    const allBtn = document.querySelector('.all-btn');
    const activeBtn = document.querySelector('.active-btn');
    const completedBtn = document.querySelector('.completed-btn');
    const loadedTasks = localStorage.getItem('tasks');

    if (loadedTasks){
        taskArray = JSON.parse(loadedTasks);
        createTask();
    }

    addButton.addEventListener('click', function(){
        const taskInput = document.getElementById('task-input').value.trim();
        if (taskInput === ''){
            return;
        }
        taskArray.push({
            text: taskInput, 
            completed: false,
        });
        save();
        createTask(taskArray);
        document.getElementById('task-input').value = '';
    });

    allBtn.addEventListener('click', function(){
        const all_tasks = localStorage.getItem('tasks');
        if (all_tasks){
            taskArray = JSON.parse(all_tasks);
            createTask();
        }
    });

    activeBtn.addEventListener('click', function(){
        const activeTasks = taskArray.filter(task => task.completed === false);
        createTask(activeTasks);  
    });

    completedBtn.addEventListener('click', function(){
        const completedTasks = taskArray.filter(task => task.completed === true);
        createTask(completedTasks);
    });

    function createTask(filterd_tasks = taskArray){
        taskContainer.innerHTML = '';
        filterd_tasks.forEach((tasks, index) => {
            const task = document.createElement('div');
            task.className = 'task';
            task.innerHTML = `
                <input type="checkbox" id="checkbox-${index}">
                <p>${tasks.text}</p>
                <div class="buttons">
                    <button class="edit-btn">Edit<img src="static/images/pencil.png" alt="edit-icon"></button>
                    <button class="delete-btn">Delete<img src="static/images/delete.png" alt="delete-icon"></button>
                </div>
            `;

            const editBtn = task.querySelector('.edit-btn');
            editBtn.addEventListener('click', function(){
                edit(task, index);
            });
            
            const deleteButton = task.querySelector(".delete-btn");
            deleteButton.addEventListener('click', function(){
                taskArray.splice(index, 1);
                save();
                createTask(taskArray);
            });

            const checkbox = task.querySelector(`#checkbox-${index}`);
            checkbox.checked = tasks.completed || false;
            if (checkbox.checked){
                task.querySelector('p').style.textDecoration = 'line-through';
            }
            checkbox.addEventListener('change', function(e){
                taskArray[index].completed = e.target.checked;
                if (e.target.checked) {
                    task.querySelector('p').style.textDecoration = 'line-through';
                } else {
                    task.querySelector('p').style.textDecoration = 'none';
                }
                save();
            });
            taskContainer.appendChild(task);
        });      
    }

    function edit(task, index){
        task.innerHTML = `
            <input type="checkbox" id="checkbox-${index}">
            <input type="text" id="edited-text">
            <div class="buttons">
                <button class="save-btn">Save</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        ` ;
        const saveBtn = task.querySelector('.save-btn');
        saveBtn.addEventListener('click', function(){
            const editedText = task.querySelector('#edited-text').value.trim();
            if (editedText !== ''){
                taskArray[index].text = editedText;
                save();
                createTask(taskArray);
            }
        });

        const cancelBtn = task.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            createTask(taskArray);
        });

        const checkbox = task.querySelector(`#checkbox-${index}`);
        checkbox.addEventListener('change', function (e) {
            taskArray[index].completed = e.target.checked;
            save();
        });
    }

    function save(){
        localStorage.setItem('tasks', JSON.stringify(taskArray));
    }
});