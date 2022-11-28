//! TODOS - список дел, прочитать, удалить, изменить, сделать
/**
 * GET - получить данные
 * PATCH - частичное изменение
 * PUT - полная заменая данных
 * POST - добавление данных
 * DELETE - удаление данных
 * CRUD - Create(post-request) Read(GET-request) Update(PUT/PATCH) Delete(delete)
 * db.json - локальный\ фейковый бэкэнд
 */

//? API - APLPLICATION PROGRAMMING INTERFACE

const API = "http://localhost:8000/todos";
let inpAdd = document.querySelector("#inp-add");
let btnAdd = document.querySelector("#btn-add");
// console.log(inpAdd, btnAdd)

let inpSearch = document.querySelector("#inp-search");
// console.log(inp)
// ! CREATE
btnAdd.addEventListener("click", () => {
  let newTodo = {
    todo: inpAdd.value,
  };
  console.log(newTodo);
  if (newTodo.todo.trim() === "") {
    alert("заполните поле");
    return;
  }
  fetch(API, {
    method: "POST",
    body: JSON.stringify(newTodo),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });

  inpAdd.value = "";
  getTodos();
});

// !READ
// ! SEARCH
inpSearch.addEventListener("input", () => {
  // console.log("INPUT");
  getTodos();
});
// !pogination
let pagination = document.querySelector("#pagination");
// console.log(pogination)
let page = 1;
let limit = 3
getTodos();
let list = document.querySelector("#list");
// console.log(list)
async function getTodos() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${page}&_limit=${limit}`
  ).then((response) => response.json()); //переводим в json формат
  //   console.log(response);

  let allTodos = await fetch(API)
    .then((res) => res.json())
    .catch((e) => console.log(e));
  // console.log(allTodos)

  let lastPage = Math.ceil(allTodos.length / 2);
  console.log(lastPage);

  list.innerHTML = "";
  response.forEach((item) => {
    let newElem = document.createElement("div");
    newElem.id = item.id;
    newElem.innerHTML = `
    <span>${item.todo}</span>
    <button class="btn-delete">Delete</button>
    <button class="btn-edit">Edit</button>
    `; //добавили тег спан и в него будут отображаться данные с локального бека
    list.append(newElem);
    // console.log(newElem);
  });

  // добавляем пагинацию
  pagination.innerHTML = `<button ${
    page === 1 ? "disabled" : ""
  } id="btn-prev">Previous</button>
  <span>${page}</span>
  <button ${page === lastPage ? "disabled" : ""} id="btn-next">Next</button>
  `;
}
//async - возвращает  promise/ async & await - возвращает ответ сервера response

// ! delete
document.addEventListener("click", async (event) => {
  if (event.target.className === "btn-delete") {
    let id = event.target.parentNode.id; //выходят id
    console.log(id);
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    getTodos();
  }
  //!   update

  if (event.target.className === "btn-edit") {
    modalEdit.style.display = "flex"; //block ставит в самый край. flex - по центру
    let id = event.target.parentNode.id;

    let response = await fetch(`${API}/${id}`)
      .then((response) => response.json())
      .catch((err) => console.log(err));
    //   console.log(response)
    inpEditTodo.value = response.todo;
    inpEditTodo.className = response.id;
  }
  // ! pagination
  if (event.target.id === "btn-next") {
    page++;
    getTodos();
  }
  if (event.target.id === "btn-prev") {
    page--;
    getTodos();
  }
});

// ! update - изменения
let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");
let inpEditTodo = document.getElementById("inp-edit-todo");
let btnSaveEdit = document.getElementById("btn-save-edit");
// console.log(modalEdit, modalEditClose, inpEditTodo, btnSaveEdit)
modalEditClose.addEventListener("click", function () {
  modalEdit.style.display = "none";
}); //закрыть модальное окно

btnSaveEdit.addEventListener("click", async () => {
  let editedTodo = {
    todo: inpEditTodo.value,
  };
  let id = inpEditTodo.className;
  console.log(id);
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedTodo),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  modalEdit.style.display = "none";
  getTodos();
});
