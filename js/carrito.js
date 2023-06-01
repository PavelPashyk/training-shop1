const productosEnCarritoArrLocal = JSON.parse(
  localStorage.getItem("productos-en-carrito")
); // берем массив из локал
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function cargarProductosCarrito() {
  if (productosEnCarritoArrLocal && productosEnCarritoArrLocal.length > 0) {
    contenedorCarritoProductos.innerHTML = ""; //очищаем от всего

    // если в локал есть товары
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoComprado.classList.add("disabled");

    // создаем элемент на странице с отрисовкой из массива productosEnCarritoArrLocal
    productosEnCarritoArrLocal.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
                        <img class="carrito-producto-imagen" src="${
                          producto.imagen
                        }" alt="${producto.titulo}">
                        <div class="carrito-producto-titulo">
                            <small>Título</small>
                            <h3>${producto.titulo}</h3>
                        </div>
                        <div class="carrito-producto-cantidad">
                            <small>Cantidad</small>
                            <p>${producto.cantidad}</p>
                        </div>
                        <div class="carrito-producto-precio">
                            <small>Precio</small>
                            <p>$${producto.precio}</p>
                        </div>
                        <div class="carrito-producto-subtotal">
                            <small>Subtotal</small>
                            <p>$${producto.precio * producto.cantidad}</p>
                        </div>
                        <button class="carrito-producto-eliminar" id="${
                          producto.id
                        }"><i class="bi bi-trash-fill"></i></button>
                    `;

      contenedorCarritoProductos.append(div);
    });

    actualizarBotonesEliminar(); // вызов функция для получения кнопок delete, когда будет отрисовка
    actualizarTotal(); //вызов функция общей стоимости
  } else {
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
  }
}

cargarProductosCarrito(); //вызвали функцию отрисовки

// функция для получения кнопок удаления в карточе, т.к. их сразу нет и появляютсся они только после отрисовки
function actualizarBotonesEliminar() {
  botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
  });
}

// функция удаления из корзины, из локал, из счетчика корзины
function eliminarDelCarrito(e) {
  // нашли на что нажали
  const idBoton = e.currentTarget.id;
  // сравнили и нашли индекс нажатого элемента в массиве
  const index = productosEnCarritoArrLocal.findIndex(
    (producto) => producto.id === idBoton
  );
  // нашли нужный объект в массиве
  const objProducto = productosEnCarritoArrLocal.find(
    (producto) => producto.id === idBoton
  );

  // проверка для удаления
  if (objProducto.cantidad != 1) {
    productosEnCarritoArrLocal[index].cantidad--;
  } else {
    productosEnCarritoArrLocal.splice(index, 1);
  }

  cargarProductosCarrito(); //вызвали функцию отрисовки

  // обновили локал
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarritoArrLocal)
  );
}

//функция общей стоимости
function actualizarTotal() {
  const totalCalculado = productosEnCarritoArrLocal.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  contenedorTotal.innerText = `$${totalCalculado}`;
}

// клик по кнопке очистки корзины
botonVaciar.addEventListener("click", vaciarCarrito);

// функция очистки корзины
function vaciarCarrito() {
  productosEnCarritoArrLocal.length = 0; // очистили массив
  //обновили локал
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarritoArrLocal)
  );
  cargarProductosCarrito(); //вызвали функцию отрисовки
}

// клик по кнопке купить
botonComprar.addEventListener("click", comprarCarrito);

//функция купить
function comprarCarrito() {
  productosEnCarritoArrLocal.length = 0;
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarritoArrLocal)
  );

  contenedorCarritoVacio.classList.add("disabled");
  contenedorCarritoProductos.classList.add("disabled");
  contenedorCarritoAcciones.classList.add("disabled");
  contenedorCarritoComprado.classList.remove("disabled");
}
