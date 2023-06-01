let productosArr = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productosArr = data;
        cargarProductos(productosArr);//вызвали функцию отрисовки и передали наш массив
    })

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

// функция отрисовки
function cargarProductos(ELEMENTproductosElegidos) {
  contenedorProductos.innerHTML = ""; //очищаем от всего

  // создаем элемент на странице с отрисовкой
  ELEMENTproductosElegidos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
                    <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                    <div class="producto-detalles">
                        <h3 class="producto-titulo">${producto.titulo}</h3>
                        <p class="producto-precio">$${producto.precio}</p>
                        <button class="producto-agregar" id="${producto.id}">Agregar</button>
                    </div>
                `;

    contenedorProductos.append(div);
  });

  actualizarBotonesAgregar(); // вызов функция для получения кнопок в карточе, на каждой выбраннойц секции будет своя отрисовка
}

// cargarProductos(productosArr); //вызвали функцию отрисовки и передали наш массив\ её вызвали в fetch для json-файла

//отрисовка карточек при нажатии кнопки
botonesCategorias.forEach((boton) =>
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((btn) => btn.classList.remove("active")); //сразу удаляем у всех active

    e.currentTarget.classList.add("active"); // добавляем на нажатом класс active

    // фильтруем в соответствии с выбранной кнопкой
    if (e.currentTarget.id != "todos") {
      const productosBotonArrNew = productosArr.filter(
        (producto) => producto.categoria.id === e.currentTarget.id
      );

      // возвращает значение первого найденного в массиве элемента и в нем берем название
      const productoCategoriaArrNew = productosArr.find(
        (producto) => producto.categoria.id === e.currentTarget.id
      );
      tituloPrincipal.innerText = productoCategoriaArrNew.categoria.nombre; // меняем название

      cargarProductos(productosBotonArrNew); //вызвали функцию отрисовки и передали наш массив
    } else {
      tituloPrincipal.innerHTML = "Todos los productos"; // меняем название
      cargarProductos(productosArr); //вызвали функцию отрисовки и передали наш массив
    }
  })
);

// функция для получения кнопок в карточе, т.к. их сразу нет и появляютсся они только после отрисовки
function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

let productosEnCarritoArr;// массив для корзины

// проверка на наличие в локал
const productosEnCarritoArrLocalStorage = JSON.parse(
    localStorage.getItem("productos-en-carrito")
  );// берем массив из локал
if (productosEnCarritoArrLocalStorage) {
    productosEnCarritoArr = productosEnCarritoArrLocalStorage;
    actualizarNumerito()// вызов функция числа корзины чтобы обновился если чтото есть в локал
} else {
    productosEnCarritoArr = [];
}


// это уже сама функция для кнопки для добавления в корзину
function agregarAlCarrito(e) {

    const idBoton = e.currentTarget.id;// находим кнопку на которую нажали по id
    const productoAgregadoArrNew = productosArr.find(producto => producto.id === idBoton);// находим элемент по нажатой кнопке

    // проверка на наличие похожего продукта в массиве корзины productosEnCarritoArr
    if(productosEnCarritoArr.some(producto => producto.id === idBoton)) {
        // если такой товар есть
        const index = productosEnCarritoArr.findIndex(producto => producto.id === idBoton);// находим индекс добавленного элемента по id
        productosEnCarritoArr[index].cantidad++;// и увеличиваем cantidad на 1
    } else {
        // если нет
        productoAgregadoArrNew.cantidad = 1;//  добавляем новое свойство в массиве найденного элемента productoAgregadoArrNew
        productosEnCarritoArr.push(productoAgregadoArrNew);// пушим найденый элемент productoAgregadoArrNew в наш массив корзины productosEnCarritoArr
    }

    actualizarNumerito()// вызов функция числа корзины

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarritoArr));
}

// функция числа корзины
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarritoArr.reduce((acc, producto) => acc + producto.cantidad, 0);// получаем число
    numerito.innerText = nuevoNumerito;// меняем число в корзине
}
