///filter
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("product-list");
  const itemsPerPage = 32;
  let currentPage = 1;

  const sortSelect = document.getElementById("sort");
  const infoDiv = document.querySelector(".info p");
  const paginationContainer = document.querySelector(".next ul");
  const buttons = document.querySelectorAll(".buttons button");
  const priceRangeInput = document.getElementById("price-range");
  const priceDisplay = document.getElementById("price-display");
  const filterButton = document.getElementById("filter-button");

  let productsData = [];
  let filteredData = [];

  fetch("./Data/products.json")
    .then((response) => response.json())
    .then((data) => {
      productsData = data;
      filteredData = data;
      renderProducts(currentPage, filteredData);
      renderPagination(filteredData.length);
    })
    .catch((error) => console.error("Error fetching data:", error));


  const updateInfo = (page, totalItems) => {
    const startItem = (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalItems);
    infoDiv.textContent = `Showing ${startItem} - ${endItem} of ${totalItems} results`;
  };

  const renderProducts = (page, data) => {
    grid.classList.add("fade-out");

    setTimeout(() => {
      grid.innerHTML = "";

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const itemsToDisplay = data.slice(start, end);

      itemsToDisplay.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        const img = document.createElement("img");
        img.src = item.imgUrl;
        img.alt = item.name;

        const title = document.createElement("h4");
        title.textContent = item.name;

        const priceDiv = document.createElement("div");
        priceDiv.classList.add("price");

        const originalPrice = document.createElement("span");
        originalPrice.innerHTML = `<del>₹${item.price + 200}</del>`;
        priceDiv.appendChild(originalPrice);

        const salePrice = document.createElement("span");
        salePrice.textContent = `₹${item.price}`;
        priceDiv.appendChild(salePrice);

        const button = document.createElement("button");
        button.classList.add("btn");
        button.textContent = "Add to cart";

        button.addEventListener("click", () => {
          addToCart(item);
          alert(item.name+" has been added to the cart");
        });

        itemDiv.appendChild(img);
        itemDiv.appendChild(title);
        itemDiv.appendChild(priceDiv);
        itemDiv.appendChild(button);

        grid.appendChild(itemDiv);
      });

      grid.classList.remove("fade-out");
      grid.classList.add("fade-in");

      updateInfo(page, data.length);
      window.scrollTo({
        top: grid.offsetTop,
        behavior: "smooth",
      });
    }, 300);
  };
  const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationContainer.innerHTML = "";

    const prevButton = document.createElement("li");
    prevButton.innerHTML = `<button>&lt;</button>`;
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts(currentPage, filteredData);
        renderPagination(filteredData.length);
      }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("li");
      pageButton.innerHTML = `<button>${i}</button>`;
      if (i === currentPage) {
        pageButton.querySelector("button").classList.add("active");
      }
      pageButton.addEventListener("click", () => {
        currentPage = i;
        renderProducts(currentPage, filteredData);
        renderPagination(filteredData.length);
      });
      paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement("li");
    nextButton.innerHTML = `<button>&gt;</button>`;
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts(currentPage, filteredData);
        renderPagination(filteredData.length);
      }
    });
    paginationContainer.appendChild(nextButton);
  };

  const filterProducts = (category) => {
    document.querySelectorAll(".categories li").forEach((li) => {
      li.classList.remove("active");
    });
    document
      .querySelector(`[data-category="${category}"]`)
      .classList.add("active");

    filteredData =
      category === "all"
        ? productsData
        : productsData.filter((item) => item.category === category);
    currentPage = 1;
    renderProducts(currentPage, filteredData);
    renderPagination(filteredData.length);
  };

  document.querySelectorAll(".categories li").forEach((categoryItem) => {
    categoryItem.addEventListener("click", () => {
      const selectedCategory = categoryItem.getAttribute("data-category");
      filterProducts(selectedCategory);
    });
  });


  const updateLayout = (view) => {
    grid.classList.add("fade-out");

    setTimeout(() => {
      grid.classList.remove("grid-3", "grid-4", "grid-2", "fade-out");
      grid.classList.add(view);
      grid.classList.add("fade-in");

      setTimeout(() => {
        grid.classList.remove("fade-in");
      }, 300);
    }, 300);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.getAttribute("data-view");
      updateLayout(view);
    });
  });



  priceRangeInput.addEventListener("input", () => {
    const maxPrice = priceRangeInput.value;
    priceDisplay.textContent = `Price: ₹150 - ₹${maxPrice}`;
  });

  const filterByPrice = () => {
    const maxPrice = parseInt(priceRangeInput.value);
    filteredData = productsData.filter(
      (product) => product.price >= 150 && product.price <= maxPrice
    );
    renderProducts(1, filteredData);
    renderPagination(filteredData.length);
  };

  filterButton.addEventListener("click", filterByPrice);

  const sortProducts = (criteria) => {
    filteredData.sort((a, b) => {
      if (criteria === "alphabet") {
        return a.name.localeCompare(b.name);
      } else if (criteria === "price-low") {
        return a.price - b.price;
      } else if (criteria === "price-high") {
        return b.price - a.price;
      }
      return 0;
    });
    renderProducts(1, filteredData);
  };


  sortSelect.addEventListener("change", () => {
    const selectedSort = sortSelect.value;
    sortProducts(selectedSort);
  });

});

///cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  let cartModal = document.getElementById("cartModal");
  if (!cartModal) {
    cartModal = document.createElement("dialog");
    cartModal.id = "cartModal";
    cartModal.className = "cart-modal";
    document.body.appendChild(cartModal);
  }

  cartModal.addEventListener("click", (e) => {
    const dialogDimensions = cartModal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      cartModal.close();
    }
  });

  window.openModal = function () {
    if (cartModal) {
      updateCartModal();
      cartModal.showModal();
    }
  };

  window.closeModal = function () {
    if (cartModal) {
      cartModal.close();
    }
  };

  function updateCartModal() {
    if (!cartModal) return;

    const userName = localStorage.getItem("userName");

    if (!userName) {
      cartModal.innerHTML = `
                <h2>Please Log In</h2>
                <p>You need to be logged in to view your cart</p>
                <div class="modal-buttons">
                    <button onclick="window.location.href='login.html'" class="checkout-btn">Log In</button>
                    <button onclick="closeModal()" class="close-btn">Close</button>
                </div>
            `;
      return;
    }

    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    cartModal.innerHTML = `
            <h2>Welcome ${userName}!</h2>
            <div class="cart-items">
                <h3>Your Cart Items</h3>
                ${cart.length === 0 ? "<p>Your cart is empty 😔</p>" : ""}
                ${cart
                  .map(
                    (item) => `
                    <div class="cart-item">
                        <img src="${item.imgUrl}" alt="${
                      item.name
                    }" style="width: 50px; height: 50px; object-fit: cover;">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>₹${item.price} × ${item.quantity}</p>
                        </div>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity(${item.id}, ${
                      item.quantity - 1
                    })">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, ${
                      item.quantity + 1
                    })">+</button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${
                          item.id
                        })">×</button>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div class="cart-footer">
                <div class="cart-total">Total: ₹${totalAmount}</div>
                ${
                  cart.length > 0
                    ? '<a href="cart.html"><button class="checkout-btn">Checkout</a></button>'
                    : ""
                }
                <button onclick="closeModal()" class="close-btn">Close</button>
            </div>
        `;
  }

  // Cart functions
  window.addToCart = function (product) {
    const existingItem = cart.find((item) => item.name === product.name);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(product.name +" has been added to the cart")
    updateCartModal();
  };

  window.removeFromCart = function (productId) {
    const index = cart.findIndex((item) => item.id === productId);
    if (index !== -1) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartModal();
    }
  };

  window.updateQuantity = function (productId, newQuantity) {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find((item) => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartModal();
    }
  };
});
