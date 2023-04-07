let arrayCarrito = [];
let productos = [];
const botonVaciar = document.getElementById('vaciar-carrito');
const precioTotal = document.querySelector('#precio-total');
const carritoContainer = document.getElementById('carrito-container');
const comprar = document.getElementById('btn-comprar');
const badge = document.getElementById("badge");
const cardsContainer = document.querySelector(".cards-container");


// eventos

// evento boton de compra
comprar.addEventListener('click',() => {
    alert('tu compra fue exitosa')
    arrayCarrito.length = 0;
    badge.innerText = 0;
    precioTotal.innerText = 0;
    renderizarCarrito()
})
// haciendo que con la function DOMContentLoaded al cargar al APP, se ejecute la data, y la renderizacion de los productos.
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  boxProductCreate()
});



// funciones 

// function para traer la data desde el archivo externo con FETCH.
async function fetchData() {
  const res = await fetch("/js/data.json");
  const data = await res.json();
  productos = data;
  boxProductCreate()
}


// creamos la cart en el DOM
function boxProductCreate() {
  productos.forEach((producto) => {
  const div = document.createElement("div");
  div.classList.add('product-card')
  div.innerHTML = `
  <div>
  <img src="${producto.image}" alt="prenda de ropa">
  <h4>$${producto.price}</h4>
  <h5 class="titulo">${producto.name}</h5>
  <p>Stock: ${producto.stock}</p>
  <a class="agregar__carrito" id="button${producto.id}"><img src="./icons/icon_shopping_cart.svg" alt="shopping cart"  class="img-cart"/></a>
  </div>
  `
  cardsContainer.appendChild(div);
  const agregar = document.getElementById(`button${producto.id}`);
  agregar.addEventListener('click',() => {
      alert('se agrego el producto al carrito')
      pushearCarrito(`${producto.id}`);
  });
  })
  
}

// pushear producto al carro
function pushearCarrito(id) {
  const producto = productos.find(prod => prod.id === parseInt(id)); // buscar el producto por id
  if (producto) {
    const existe = arrayCarrito.some((prod) => prod.id === parseInt(id));
    if (existe) {
      arrayCarrito.map((prod) => {
        if (prod.id === parseInt(id)) {
          prod.cantidad++;
        }
        return prod;
      });
    } else {
      arrayCarrito.push({ ...producto, cantidad: 1 });
    }
    const cantidadCarrito = arrayCarrito.reduce((total, prod) => {
      if (prod.id === parseInt(id)) {
        total += prod.cantidad;
      }
      return total;
    }, 0);
    const productoStock = document.querySelector(`#button${id}`).parentNode.querySelector('p');
    const stockActualizado = producto.stock - cantidadCarrito;
    if (stockActualizado >= 0) {
      productoStock.innerText = `Stock: ${stockActualizado}`;
    } else {
      alert('Stock insuficiente');
      arrayCarrito.forEach((prod, index) => {
        if (prod.id === parseInt(id)) {
          prod.cantidad--;
          if (prod.cantidad === 0 || prod.cantidad < 1) {
            arrayCarrito.splice(index, 1);
          }
        }
      });
    }
  }
  renderizarCarrito();
}

// eliminar prod del carrito
function eliminarDelCarrito(id) {
  const existe = arrayCarrito.some(prod => prod.id === id);
  if (existe) {
    let cantidadEliminada = 0; // cantidad de productos eliminados
    arrayCarrito.forEach((prod, index) => {
      if (prod.id === id) {
        cantidadEliminada = prod.cantidad; // se guarda la cantidad de productos eliminados
        prod.cantidad--;
        if (prod.cantidad === 0 || prod.cantidad < 1) {
          arrayCarrito.splice(index, 1);
        }
      }
    });
    const productoStock = document.querySelector(`#button${id}`).parentNode.querySelector('p');
    productos.forEach((producto) => {
      if (producto.id === id) {
        producto.stock += 1 // se incrementa el stock del producto
        productoStock.innerText = `Stock: ${producto.stock}`; // actualiza el stock en la lista de productos
      }
    });
  }
  badge.innerText = arrayCarrito.length;
  precioTotal.innerText = arrayCarrito.reduce((acc, producto) => acc + producto.cantidad * producto.price, 0);
  renderizarCarrito();
}



// Funcion para renderizarCarrito  
function renderizarCarrito(){
  carritoContainer.innerHTML = "";
   if(arrayCarrito.length < 1){
        return;}
   arrayCarrito.forEach(function renderizarProducto(producto){
       let productoContainer = document.createElement('div');
       productoContainer.classList.add('product-card')
       productoContainer.id = producto.id
       productoContainer.innerHTML = `
       <img src="${producto.image}" alt="prenda de ropa">
       <h4 class="price">$${producto.price}</h4>
       <h5 class="titulo">${producto.name}:</h5>
       <a class="cantidad">Cantidad:${producto.cantidad}</a>
       <button class="agregar__carrito agregar__carrito--2" id="eliminar${producto.id}">Retirar</button>`
       carritoContainer.appendChild(productoContainer);
       const eliminar = document.getElementById(`eliminar${producto.id}`)
       eliminar.addEventListener('click', (id) => {
           eliminarDelCarrito(producto.id)
       })
       badge.innerText = arrayCarrito.length
       precioTotal.innerText = arrayCarrito.reduce((acc,producto) => acc + producto.price, 0);
       precioTotal.innerText = arrayCarrito.reduce((acc,producto) => acc + producto.cantidad * producto.price, 0);
   })
}


botonVaciar.addEventListener('click', () => {
  alert('Tu carrito se vació con Éxito')
  arrayCarrito.length = 0;
  badge.innerText = 0;
  precioTotal.innerText = arrayCarrito.reduce((acc,producto) => acc - producto.price, 0);
  renderizarCarrito();
})


// const aumentarCantidad = (product) => {
//   product.cantidad++;
//   product.stock--;
//   if (product.cantidad > 0) {
//     btnDisminuir.disabled = false;
//   }
//   if (product.stock === 0) {
//     btnAumentar.disabled = true;
//   }
//   totalProductsCart(carro);
//   cantidadCounter.innerText = product.cantidad;
// };

// function disminuirCantidad(product) {
//   product.cantidad--;
//   product.stock++;
//   if (product.stock > 0) {
//     btnAumentar.disabled = false;
//   }
//   product.cantidad === 0 ? (btnDisminuir.disabled = true) : false;
//   totalProductsCart(carro);
//   cantidadCounter.innerText = product.cantidad;
// }




// function toggleProductDetail(product) {
//   productDetail.classList.remove("inactive");
//   productDetail.innerHTML = "";
//   const encontrado = productsList.find(
//     (findProduct) => findProduct.id === product.id
//   );
//   console.log(encontrado);
//   const divDetClose = document.createElement("div");
//   divDetClose.classList.add("product-detail-close");

//   const iconDetClose = document.createElement("img");
//   iconDetClose.setAttribute("src", "./icons/icon_close.png");

//   divDetClose.appendChild(iconDetClose);
//   divDetClose.addEventListener("click", () => {
//     productDetail.classList.add("inactive");
//   });

//   const imgProDetail = document.createElement("img");
//   imgProDetail.setAttribute("id", "imgProductDetail");
//   imgProDetail.setAttribute("src", encontrado.image);

//   const divProInfo = document.createElement("div");
//   divProInfo.classList.add("product-info");
//   const pDetail1 = document.createElement("p");
//   pDetail1.innerText = encontrado.price;
//   const pDetail2 = document.createElement("p");
//   pDetail2.innerText = encontrado.name;
//   const pDetail3 = document.createElement("p");
//   pDetail3.innerText =
//     "With its practical position, this bike also fulfills a decorative function, add your hall or workspace.";

//   const btnAddDetCart = document.createElement("button");
//   btnAddDetCart.classList.add("primary-button", "add-to-cart-button");
//   const imgAddDetCart = document.createElement("img");
//   imgAddDetCart.setAttribute("src", "./icons/bt_add_to_cart.svg");
//   btnAddDetCart.appendChild(imgAddDetCart);
//   btnAddDetCart.addEventListener("click", () => agregarAlCarrito(product));

//   divProInfo.append(pDetail1, pDetail2, pDetail3, btnAddDetCart);

//   productDetail.append(divDetClose, imgProDetail, divProInfo);
// }

// function renderProduct() {
//   productos.forEach((product) => {
//     const productCard = document.createElement("div");
//     productCard.classList.add("product-card");

//     const productImg = document.createElement("img");
//     productImg.setAttribute("src", product.image);
//     productImg.addEventListener("click", () => toggleProductDetail(product));
//     const productInfo = document.createElement("div");
//     productInfo.classList.add("product-info");

//     const productInfoDiv = document.createElement("div");
//     const productPrice = document.createElement("p");
//     productPrice.innerText = "$" + product.price;
//     const productName = document.createElement("p");
//     productName.innerText = product.name;
//     productInfoDiv.append(productPrice, productName);
//     const productInfoFigure = document.createElement("figure");
//     const btnImg = document.createElement("button");
//     btnImg.classList.add("btnImg");
//     const productImgCart = document.createElement("img");
//     productImgCart.setAttribute("src", "./icons/bt_add_to_cart.svg");
//     btnImg.appendChild(productImgCart);
//     productInfoFigure.appendChild(btnImg);
//     btnImg.addEventListener("click", () => agregarAlCarrito(product));
//     productInfo.appendChild(productInfoDiv);
//     productInfo.appendChild(productInfoFigure);
//     productCard.appendChild(productImg);
//     productCard.appendChild(productInfo);
//     cardsContainer.appendChild(productCard);
//   });
// }


// renderProduct(productos);






// codigo que utilizaste que cambie, pero lo dejo adjuntado para posteriormente unirlo


// function toggleDesktopMenu() {
//   console.log("click");
//   productDetail.classList.add("inactive");
//   desktopMenu.classList.toggle("inactive");
//   asideCar.classList.add("inactive");
// }
// function toggleMobileMenu() {
//   console.log("click2");
//   productDetail.classList.add("inactive");
//   mobileMenu.classList.toggle("inactive");
//   asideCar.classList.add("inactive");
// }
// function totalProductsCart(arr) {
//   counterCart.innerText = arr.reduce(
//     (acc, product) => acc + product.cantidad,
//     0
//   );
// }
