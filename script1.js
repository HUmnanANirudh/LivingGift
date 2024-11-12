document.addEventListener("DOMContentLoaded", () => {
  const articlesContainer = document.querySelectorAll(".main .container");
  const viewMoreButtons = document.querySelectorAll(".main .btn4");

  let articlesData = {};

  const fetchArticles = async () => {

      const response = await fetch("./Data/articles.json");
      const data = await response.json();

      data.forEach((article) => {
        if (!articlesData[article.category]) {
          articlesData[article.category] = [];
        }
        articlesData[article.category].push(article);
      });

      renderInitialArticles();

  };

  const renderInitialArticles = () => {
    articlesContainer.forEach((container, index) => {
      const category = container
        .closest(".main")
        .querySelector(".heading")
        .textContent.trim();
      const articles = articlesData[category] || [];

      renderArticles(container, articles.slice(0, 4));
    });
  };

  const renderArticles = (container, articles) => {
    container.innerHTML = "";

    articles.forEach((article) => {
      const articleDiv = document.createElement("div");

      const img = document.createElement("img");
      img.src = article.imgUrl;
      img.alt = "Plant Image";

      const title = document.createElement("h4");
      title.textContent = article.title;

      const excerpt = document.createElement("p");
      excerpt.textContent = article.excerpt;

      articleDiv.addEventListener("click", () => {
        window.open(article.linkUrl, "_blank");
      });

      articleDiv.appendChild(img);
      articleDiv.appendChild(title);
      articleDiv.appendChild(excerpt);

      container.appendChild(articleDiv);
    });
  };

  const handleViewMore = (button, container) => {
    const category = container
      .closest(".main")
      .querySelector(".heading")
      .textContent.trim();
    const articles = articlesData[category] || [];

    renderArticles(container, articles);
    button.style.display = "none";
  };

  viewMoreButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      handleViewMore(button, articlesContainer[index]);
    });
  });

  fetchArticles();
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const suggestionsContainer = document.getElementById("suggestionsContainer");
  let articlesData = [];

  const fetchArticles = async () => {
    try {
      const response = await fetch("./Data/articles.json");
      articlesData = await response.json();
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const escapeRegex = (text) =>
    text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

  const displaySuggestions = (query) => {
    suggestionsContainer.innerHTML = "";

    if (query.trim() === "") {
      suggestionsContainer.style.display = "none";
      return;
    }

    const regex = new RegExp(escapeRegex(query), "i");

    const filteredArticles = articlesData.filter((article) =>
      regex.test(article.title)
    );

    if (filteredArticles.length > 0) {
      suggestionsContainer.style.display = "block";

      filteredArticles.forEach((article) => {
        const suggestionDiv = document.createElement("div");
        suggestionDiv.classList.add("suggestion-item", "bounce");
        suggestionDiv.innerHTML = `<span>${article.title}</span>`;

        suggestionDiv.addEventListener("click", () => {
          window.open(article.linkUrl, "_blank");
        });

        suggestionsContainer.appendChild(suggestionDiv);
      });
    } else {
      suggestionsContainer.style.display = "none";
    }
  };

  searchInput.addEventListener("input", () => {
    const query = searchInput.value;
    displaySuggestions(query);
  });

  fetchArticles();
});
