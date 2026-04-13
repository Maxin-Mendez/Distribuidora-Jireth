// Animacion del Carrusel
const track = document.querySelector(".carrusel-track");
const slides = Array.from(document.querySelectorAll(".carrusel-content"));
const nextButton = document.querySelector(".carrusel-button.right");
const prevButton = document.querySelector(".carrusel-button.left");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function updateCarousel(index) {
  const slideWidth = slides[0].offsetWidth;
  track.style.transform = `translateX(-${slideWidth * index}px)`;

  dots.forEach((dot) => dot.classList.remove("active"));
  if (dots[index]) dots[index].classList.add("active");
}

nextButton.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel(currentIndex);
});

prevButton.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel(currentIndex);
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    updateCarousel(currentIndex);
  });
});

// Responsive, actualizar al cambiar tamaño
window.addEventListener("resize", () => updateCarousel(currentIndex));

// --- Autoavance cada 5 segundos ---
setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel(currentIndex);
}, 7000); // 5000 milisegundos = 5 segundos

// FILTRAR POR LA BARRA DE BUSQUEDA LOS PRODUCTOS Y CARRITO DE COMPRAS
document.addEventListener("DOMContentLoaded", () => {
  // Filtro de productos por texto
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", () => {
    const texto = searchInput.value.toLowerCase().replace("c$", "").trim();

    productos.forEach((producto) => {
      const nombre = producto
        .querySelector(".nombre")
        .textContent.toLowerCase();
      const precio = producto
        .querySelector(".precio")
        .textContent.toLowerCase()
        .replace("c$", "")
        .trim();

      const coincideNombre = nombre.includes(texto);
      const coincidePrecio = precio.includes(texto);

      if (coincideNombre || coincidePrecio) {
        producto.classList.remove("oculto");
      } else {
        producto.classList.add("oculto");
      }
    });
  });

  const productos = document.querySelectorAll(".producto");
  const carritoLista = document.getElementById("carrito-lista");
  const carritoIcon = document.getElementById("carrito-icon");
  const carritoPopup = document.getElementById("carrito-popup");

  let carrito = [];

  // Cargar carrito desde localStorage si existe
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarritoUI();
  }

  productos.forEach((producto) => {
    producto.addEventListener("click", () => {
      const nombre = producto.querySelector(".nombre").textContent;
      const imagenSrc = producto.querySelector("img").getAttribute("src");

      const productoExistente = carrito.find((p) => p.nombre === nombre);

      if (productoExistente) {
        productoExistente.cantidad += 1;
      } else {
        carrito.push({ nombre, imagenSrc, cantidad: 1 });
        mostrarMensaje(`"${nombre}" fue agregado al carrito`);
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarritoUI();
    });
  });

  carritoIcon.addEventListener("click", () => {
    carritoPopup.classList.toggle("oculto");
  });

  function actualizarCarritoUI() {
    carritoLista.innerHTML = "";

    carrito.forEach((item, index) => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.marginBottom = "10px";
      li.style.justifyContent = "space-between";

      const left = document.createElement("div");
      left.style.display = "flex";
      left.style.alignItems = "center";

      const img = document.createElement("img");
      img.src = item.imagenSrc;
      img.style.width = "40px";
      img.style.height = "40px";
      img.style.marginRight = "10px";
      img.style.borderRadius = "6px";

      const nombre = document.createElement("span");
      nombre.textContent = item.nombre;

      left.appendChild(img);
      left.appendChild(nombre);

      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.value = item.cantidad;
      input.style.width = "50px";
      input.style.marginLeft = "10px";

      input.addEventListener("change", () => {
        const nuevaCantidad = parseInt(input.value);
        if (nuevaCantidad > 0) {
          carrito[index].cantidad = nuevaCantidad;
          localStorage.setItem("carrito", JSON.stringify(carrito));
        } else {
          // Si ponen 0 o menos, eliminar producto
          carrito.splice(index, 1);
          localStorage.setItem("carrito", JSON.stringify(carrito));
          actualizarCarritoUI();
        }
      });

      // Botón eliminar
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.style.marginLeft = "10px";
      btnEliminar.style.background = "#ff4d4d";
      btnEliminar.style.color = "white";
      btnEliminar.style.border = "none";
      btnEliminar.style.borderRadius = "4px";
      btnEliminar.style.padding = "4px 8px";
      btnEliminar.style.cursor = "pointer";

      btnEliminar.addEventListener("click", () => {
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarritoUI();
      });

      li.appendChild(left);
      li.appendChild(input);
      li.appendChild(btnEliminar);

      carritoLista.appendChild(li);
    });
  }
  //Favoritos
  // Referencias para favoritos
  const favoritosIcon = document.getElementById("favoritos-icon");
  const favoritosPopup = document.getElementById("favoritos-popup");
  const favoritosLista = document.getElementById("favoritos-lista");

  let favoritos = [];

  // Cargar favoritos del localStorage
  const favoritosGuardados = localStorage.getItem("favoritos");
  if (favoritosGuardados) {
    favoritos = JSON.parse(favoritosGuardados);
    actualizarFavoritosUI();
  }

  // Toggle de mostrar/ocultar popup
  favoritosIcon.addEventListener("click", () => {
    favoritosPopup.classList.toggle("oculto");
  });

  // Función para actualizar UI de favoritos
  function actualizarFavoritosUI() {
    favoritosLista.innerHTML = "";

    favoritos.forEach((item, index) => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.marginBottom = "10px";
      li.style.justifyContent = "space-between";

      const left = document.createElement("div");
      left.style.display = "flex";
      left.style.alignItems = "center";

      const img = document.createElement("img");
      img.src = item.imgSrc;
      img.style.width = "40px";
      img.style.height = "40px";
      img.style.marginRight = "10px";
      img.style.borderRadius = "6px";

      const nombre = document.createElement("span");
      nombre.textContent = item.nombre;

      left.appendChild(img);
      left.appendChild(nombre);

      li.appendChild(left);

      favoritosLista.appendChild(li);
    });
  }

  // Función para verificar si un producto está en favoritos
  function esFavorito(nombre) {
    return favoritos.some((p) => p.nombre === nombre);
  }

  // Función para alternar favoritos
  function toggleFavorito(producto) {
    const index = favoritos.findIndex((p) => p.nombre === producto.nombre);
    if (index !== -1) {
      favoritos.splice(index, 1);
    } else {
      favoritos.push(producto);
    }
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    actualizarFavoritosUI();
  }

  // Agregar botones de corazón a los productos
  productos.forEach((producto) => {
    const nombre = producto.querySelector(".nombre")?.textContent;
    const imgSrc = producto.querySelector("img")?.getAttribute("src");

    const btnFav = document.createElement("button");
    btnFav.classList.add("btn-fav");
    btnFav.style.position = "absolute";
    btnFav.style.top = "5px";
    btnFav.style.right = "5px";
    btnFav.style.fontSize = "18px";
    btnFav.style.background = "transparent";
    btnFav.style.border = "none";
    btnFav.style.cursor = "pointer";

    function actualizarCorazon() {
      btnFav.textContent = esFavorito(nombre) ? "❤️" : "🤍";
    }

    actualizarCorazon();

    btnFav.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita que agregue al carrito
      toggleFavorito({ nombre, imgSrc });
      actualizarCorazon();
    });

    producto.style.position = "relative";
    producto.appendChild(btnFav);
  });
});

// MOSTRAR MENSAJE DE PRODUCTO AGREGADO AL CARRITO
function mostrarMensaje(texto) {
  const toast = document.getElementById("mensaje-toast");
  toast.textContent = texto;
  toast.classList.remove("oculto");
  toast.classList.add("mostrar");

  setTimeout(() => {
    toast.classList.remove("mostrar");
    toast.classList.add("oculto");
  }, 3000);
}

// LOADER (PANTALLA DE CARGA)
function navegarConLoader(url) {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.remove("oculto");

  setTimeout(() => {
    window.location.href = url;
  }, 550);
}

document.querySelectorAll("a[href]").forEach((enlace) => {
  enlace.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Evita activar si es ancla interna, JavaScript:void, o link que abre en otra pestaña
    if (
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      this.target === "_blank"
    ) {
      return;
    }

    e.preventDefault(); // Prevenir navegación inmediata
    document.getElementById("loader").classList.remove("oculto"); // Mostrar loader

    // Espera un poco antes de redirigir
    setTimeout(() => {
      window.location.href = href;
    }, 400); // Le da tiempo a mostrar la animación
  });
});

// AGREGAR FAVORITOS
// Cargar y agregar botones de favoritos a cada producto
document.querySelectorAll(".producto").forEach((producto) => {
  const botonFav = document.createElement("button");
  botonFav.classList.add("btn-fav");
  botonFav.style.position = "absolute";
  botonFav.style.top = "5px";
  botonFav.style.right = "5px";
  botonFav.style.fontSize = "18px";
  botonFav.style.background = "transparent";
  botonFav.style.border = "none";
  botonFav.style.cursor = "pointer";

  const nombre = producto.querySelector(".nombre")?.textContent;
  const precio = producto.querySelector(".precio")?.textContent;
  const imgSrc = producto.querySelector("img")?.getAttribute("src");
  const productoInfo = { nombre, imgSrc };

  // Establecer ícono inicial
  botonFav.textContent = esFavorito(nombre) ? "❤️" : "🤍";

  botonFav.addEventListener("click", () => {
    toggleFavorito(productoInfo);
    // Cambiar ícono después del clic
    botonFav.textContent = esFavorito(nombre) ? "❤️" : "🤍";
  });

  producto.style.position = "relative";
  producto.appendChild(botonFav);
});

// Verifica si un producto está en favoritos
function esFavorito(nombre) {
  const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
  return favoritos.some((prod) => prod.nombre === nombre);
}

// Agrega o elimina de favoritos
function toggleFavorito(producto) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

  const index = favoritos.findIndex((p) => p.nombre === producto.nombre);

  if (index === -1) {
    favoritos.push(producto);
    mostrarMensaje(`${producto.nombre} agregado a favoritos`);
  } else {
    favoritos.splice(index, 1);
    mostrarMensaje(`${producto.nombre} eliminado de favoritos`);
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  renderizarFavoritos();
}

// Muestra los productos guardados como favoritos en el popup
function renderizarFavoritos() {
  const lista = document.getElementById("favoritos-lista");
  lista.innerHTML = "";

  const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

  favoritos.forEach((producto) => {
    const li = document.createElement("li");
    li.classList.add("favorito-item");

    const img = document.createElement("img");
    img.src = producto.imgSrc;
    img.alt = producto.nombre;
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.marginRight = "10px";

    const texto = document.createElement("span");
    texto.textContent = producto.nombre;

    li.appendChild(img);
    li.appendChild(texto);
    lista.appendChild(li);
  });
}

// Abrir/cerrar popup favoritos
document.getElementById("favoritos-icon").addEventListener("click", () => {
  const popup = document.getElementById("favoritos-popup");
  popup.classList.toggle("oculto");
  renderizarFavoritos();
});
document.addEventListener("DOMContentLoaded", () => {
  const favoritosPopup = document.getElementById("favoritos-popup");
  const favoritosIcon = document.getElementById("favoritos-icon");

  favoritosIcon.addEventListener("click", () => {
    favoritosPopup.classList.toggle("oculto");
  });
});

// MOSTRAR USUARIO LOGUEADO
const usuarioIcono = document.getElementById("usuario-icono");
const usuarioInfo = document.getElementById("usuario-info");
const usuarioTexto = document.getElementById("usuario-texto");
const cerrarBtn = document.getElementById("cerrar-usuario-info");

usuarioIcono.addEventListener("click", () => {
  const usuario = localStorage.getItem("usuarioLogueado");

  if (usuario) {
    usuarioTexto.textContent = `¡Hola, ${usuario}!`;
  } else {
    usuarioTexto.textContent = "No has iniciado sesión.";
  }

  usuarioInfo.classList.toggle("oculto");
});

cerrarBtn.addEventListener("click", () => {
  usuarioInfo.classList.add("oculto");
});
