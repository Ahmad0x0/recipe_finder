/**
 * An array of predefined recipes with their details.
 * Each recipe has an id, name, list of ingredients, description, and an image URL.
 */
const recipes = [
    {
        id: 1,
        name: "Margherita Pizza",
        ingredients: ["tomato", "mozzarella", "basil"],
        description: "A classic Italian pizza with fresh ingredients.",
        image: "marg_pizza.jpeg?height=200&width=300",
    },
    {
        id: 2,
        name: "Caprese Salad",
        ingredients: ["tomato", "mozzarella", "basil", "olive oil"],
        description: "A simple and delicious salad from Capri.",
        image: "/caprese_salad.jpeg?height=200&width=300",
    },
    {
        id: 3,
        name: "Grilled Cheese Sandwich",
        ingredients: ["bread", "cheese", "butter"],
        description: "A comforting classic sandwich.",
        image: "/cheese.jpeg?height=200&width=300",
    },
    {
        id: 4,
        name: "Tomato Soup",
        ingredients: ["tomato", "onion", "garlic", "cream"],
        description: "A warm and creamy soup perfect for any day.",
        image: "/tomato.jpeg?height=200&width=300",
    },
    {
        id: 5,
        name: "Vegetable Stir Fry",
        ingredients: ["broccoli", "carrot", "bell pepper", "soy sauce", "garlic"],
        description: "A quick and healthy vegetable stir fry with Asian flavors.",
        image: "/stir.jpeg?height=200&width=300"
    },
    {
        id: 6,
        name: "Chocolate Chip Cookies",
        ingredients: ["flour", "butter", "sugar", "chocolate chips", "eggs"],
        description: "Classic homemade chocolate chip cookies, soft and chewy.",
        image: "/choco_cookie.jpeg?height=200&width=300"
    },
    {
        id: 7,
        name: "Greek Salad",
        ingredients: ["cucumber", "tomato", "red onion", "feta cheese", "olives"],
        description: "A refreshing Mediterranean salad with tangy feta cheese.",
        image: "/greek_salad.jpeg?height=200&width=300"
    },
    {
        id: 8,
        name: "Mushroom Risotto",
        ingredients: ["rice", "mushrooms", "onion", "garlic", "parmesan"],
        description: "Creamy Italian rice dish with savory mushrooms and parmesan.",
        image: "/mush.jpeg?height=200&width=300"
    },
    {
        id: 9,
        name: "Avocado Toast",
        ingredients: ["bread", "avocado", "lemon juice", "salt", "red pepper flakes"],
        description: "A trendy and nutritious breakfast or snack with creamy avocado on toasted bread.",
        image: "/avo.jpeg?height=200&width=300"
    }
];

// Get references to important HTML elements
const ingredientsInput = document.getElementById("ingredients");
const searchBtn = document.getElementById("search-btn");
const resultsContainer = document.getElementById("results");
const favoritesContainer = document.getElementById("favorites-container");

// Load favorites from localStorage (if any), or initialize an empty array
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

/**
 * Displays the list of recipes on the page.
 * If no recipes are passed, it displays all recipes by default.
 *
 * @param {Array} recipesToShow - An array of recipes to display.
 */
function displayRecipes(recipesToShow = recipes) {
    resultsContainer.innerHTML = ""; // Clear previous results

    if (recipesToShow.length === 0) {
        resultsContainer.innerHTML = "<p>No recipes found. Try different ingredients!</p>";
        return;
    }

    recipesToShow.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        const isFavorite = favorites.includes(recipe.id);

        // Create the recipe card
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <div class="recipe-info">
                <h3 class="recipe-name">${recipe.name}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <button class="favorite-btn" data-id="${recipe.id}">
                    ${isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </button>
            </div>
        `;

        resultsContainer.appendChild(recipeCard);
    });

    // Add event listeners to favorite buttons
    document.querySelectorAll(".favorite-btn").forEach((btn) => {
        btn.addEventListener("click", toggleFavorite);
    });
}

/**
 * Displays the list of favorite recipes in the favorites section.
 */
function displayFavorites() {
    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No favorite recipes yet.</p>";
        return;
    }

    favorites.forEach((favId) => {
        const recipe = recipes.find(r => r.id === favId);
        if (!recipe) return;

        const favCard = document.createElement("div");
        favCard.classList.add("favorite-card");

        favCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <div class="recipe-info">
                <h3 class="recipe-name">${recipe.name}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <button class="remove-btn" data-id="${recipe.id}">❌ Remove</button>
            </div>
        `;

        favoritesContainer.appendChild(favCard);
    });

    // Add event listeners to remove buttons in the favorites section
    document.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.addEventListener("click", removeFromFavorites);
    });
}

/**
 * Searches for recipes that match the ingredients entered by the user.
 * Filters recipes where all entered ingredients are included.
 */
function searchRecipes() {
    const ingredients = ingredientsInput.value
        .toLowerCase()
        .split(",")
        .map((item) => item.trim());

    if (ingredientsInput.value.trim() === "") {
        displayRecipes(recipes); // Show all recipes if input is empty
        return;
    }

    const matchedRecipes = recipes.filter((recipe) =>
        ingredients.every((ingredient) => recipe.ingredients.includes(ingredient))
    );

    displayRecipes(matchedRecipes);
}

/**
 * Toggles a recipe as a favorite.
 * Adds or removes the recipe from the favorites list in localStorage.
 *
 * @param {Event} e - The event object.
 */
function toggleFavorite(e) {
    const recipeId = Number.parseInt(e.target.getAttribute("data-id"));
    const index = favorites.indexOf(recipeId);

    if (index === -1) {
        favorites.push(recipeId);
        e.target.textContent = "Remove from Favorites";
    } else {
        favorites.splice(index, 1);
        e.target.textContent = "Add to Favorites";
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

/**
 * Removes a recipe from the favorites list.
 *
 * @param {Event} e - The event object.
 */
function removeFromFavorites(e) {
    const recipeId = Number.parseInt(e.target.getAttribute("data-id"));
    const index = favorites.indexOf(recipeId);

    if (index !== -1) {
        favorites.splice(index, 1);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

// Event listeners for search functionality
searchBtn.addEventListener("click", searchRecipes);
ingredientsInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchRecipes();
    }
});

// Initial page load: display all recipes and favorites
displayRecipes(); 
displayFavorites();
