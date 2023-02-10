const todoList = document.querySelector('.todo-list');
const todoTitle = document.querySelector('.todo-title');
const todoAddInput = document.querySelector('.todo-add-input');
const filterTodoDone = document.querySelector('.todo-filter-add-button');
let todoListArr = (localStorage.getItem('todoListArr') !== null) ? JSON.parse(localStorage.getItem('todoListArr')) : [];
let filterTodoDoneInd = (localStorage.getItem('filterTodoDoneInd') !== null) ? JSON.parse(localStorage.getItem('filterTodoDoneInd')) : 0;

todoAddInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') createTodoListItem() });
filterTodoDone.addEventListener('click', () => {
  filterTodoDoneInd++;
  if (filterTodoDoneInd > 2) filterTodoDoneInd = 0;

  filterTodos();
});

filterTodos();

function filterTodos() {
  if (filterTodoDoneInd === 0) filterTodoDone.classList = 'todo-filter-add-button';
  if (filterTodoDoneInd === 1) filterTodoDone.classList = 'todo-filter-add-button todo-filter-add-button-active';
  if (filterTodoDoneInd === 2) filterTodoDone.classList = 'todo-filter-add-button todo-filter-add-button-not-active';

  todoList.innerHTML = '';
  createAllTodos();
}

function createAllTodos() {
  todoListArr.forEach((item, ind) => createTodoListItem(item, ind));
}

function createTodoListItem(itemObj = 'undefined', ind = 'undefined') {
  if ((todoAddInput.value !== '' || ind !== 'undefined')
     && ((filterTodoDoneInd === 1 && itemObj.isDone)
        || (filterTodoDoneInd === 2 && !itemObj.isDone)
        || (filterTodoDoneInd === 0))) {

    const item = document.createElement('li');
    const titleContainer = document.createElement('div');
    const itemTitle = document.createElement('h3');
    const textareaTitle = document.createElement('textarea');
    const controlsContainer = document.createElement('div');
    const editButton = document.createElement('button');
    const doneButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    
    if (itemObj === 'undefined') {
      itemObj = {};
      itemObj.title = todoAddInput.value;
      itemObj.isDone = false;
    }
    item.value = (ind === 'undefined') ? todoListArr.length : ind;

    itemTitle.textContent = itemObj.title;
    textareaTitle.value = itemObj.title;
    textareaTitle.style.display = 'none';

    if (ind === 'undefined') todoListArr.push(itemObj);

    item.classList = 'todo-list-item';
    titleContainer.classList = 'todo-title-container';
    itemTitle.classList = 'todo-list-item-title';
    textareaTitle.classList = 'todo-list-item-title-textarea';
    controlsContainer.classList = 'todo-list-item-controls';
    editButton.classList = 'todo-list-item-button todo-edit';
    doneButton.classList = 'todo-list-item-button todo-done';
    deleteButton.classList = 'todo-list-item-button todo-delete';

    if (itemObj.isDone) {
      doneButton.classList.add('todo-done-active');
      item.classList.add('todo-list-item-done');
    }

    controlsContainer.append(editButton);
    controlsContainer.append(doneButton);
    controlsContainer.append(deleteButton);
    titleContainer.append(itemTitle);
    titleContainer.append(textareaTitle);
    item.append(titleContainer);
    item.append(controlsContainer);

    doneButton.addEventListener('click', () => {
      const todoItemObj = todoListArr[parseInt(item.value)];
      doneButton.classList.toggle('todo-done-active');
      item.classList.toggle('todo-list-item-done');
      todoItemObj.isDone = !todoItemObj.isDone;
    });

    editButton.addEventListener('click', () => {
      if (textareaTitle.style.display === 'none') {
        textareaTitle.style.display = 'block';
        itemTitle.style.display = 'none';
        editButton.classList.add('todo-edit-active');
      } else {
        const todoItemObj = todoListArr[parseInt(item.value)];
        todoItemObj.title = textareaTitle.value;

        itemTitle.textContent = todoItemObj.title;
        textareaTitle.style.display = 'none';
        itemTitle.style.display = 'block';
        editButton.classList.remove('todo-edit-active');
      }
    });

    textareaTitle.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const todoItemObj = todoListArr[parseInt(item.value)];
        todoItemObj.title = textareaTitle.value;

        itemTitle.textContent = todoItemObj.title;
        textareaTitle.style.display = 'none';
        itemTitle.style.display = 'block';
        editButton.classList.remove('todo-edit-active');
      }
    });

    deleteButton.addEventListener('click', () => {
      todoList.innerHTML = '';
      todoListArr.splice(parseInt(item.value), 1);
      createAllTodos();
    });

    todoList.append(item);
  }
}