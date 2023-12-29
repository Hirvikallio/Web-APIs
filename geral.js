document.addEventListener("DOMContentLoaded", function () {
    // Manipulação de eventos do formulário de Pesquisa
    document.getElementById("searchForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedOption = document.getElementById("categoryFilter").options[document.getElementById("categoryFilter").selectedIndex];
        const selectedCategory = selectedOption.value;
        const searchTerm = document.getElementById("searchInput").value;

        // Chamar a função de pesquisa com selectedCategory e searchTerm
        if (selectedCategory === "search") {
            // Pesquisa em todas as categorias
            performSearchAcrossCategories(searchTerm);
        } else {
            // Pesquisa específica para a categoria selecionada
            performSearch(selectedCategory, searchTerm);
        }
    });

    // Manipulação de eventos do formulário de Categorias e Ordenação
    document.getElementById("categoryForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedOption = document.getElementById("categoryFilter").options[document.getElementById("categoryFilter").selectedIndex];
        const selectedCategory = selectedOption.value;
        const sortOrder = document.getElementById("sortOrder").value;

        // Titulo da categoria selecionada
        const selectedCategoryTitle = capitalizeFirstLetter(selectedCategory);
        document.getElementById("selectedCategoryTitle").innerText = selectedCategoryTitle;

        // Icon da categoria selecionada
        const selectedCategoryIconContainer = document.getElementById("selectedCategoryIcon");
        selectedCategoryIconContainer.innerHTML = "";
        const icon = document.createElement("i");
        icon.classList.add("fas", selectedOption.dataset.icon);
        selectedCategoryIconContainer.appendChild(icon);

        applyFilters(selectedCategory, sortOrder);
    });


    document.getElementById("results").addEventListener("click", function (event) {
        const clickedItem = event.target.closest("div");
        if (clickedItem) {
            const itemName = clickedItem.textContent.trim();
            const selectedCategory = document.getElementById("categoryFilter").value;
            fetchItemDetails(selectedCategory, itemName);
        }
    });
});

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function fetchItemDetails(category, itemName) {
    const apiUrl = `https://www.dnd5eapi.co/api/${category}/${itemName.replace(/\s+/g, '-').toLowerCase()}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(itemDetails => {

            const detailsContainer = document.getElementById("results");
            detailsContainer.innerHTML = `<h2>${itemDetails.name}</h2>`;

            if (category === "spells") {
                // Spell details
                detailsContainer.innerHTML += `<p>Casting Time: ${itemDetails.casting_time}</p>`;
                detailsContainer.innerHTML += `<p>Range: ${itemDetails.range}</p>`;
                detailsContainer.innerHTML += `<p>Components: ${itemDetails.components.join(", ")}</p>`;
                detailsContainer.innerHTML += `<p>Description: ${itemDetails.desc}</p>`;
            } else if (category === "monsters") {
                // Monster details
                detailsContainer.innerHTML += `<p>Hit Points: ${itemDetails.hit_points}</p>`;
                detailsContainer.innerHTML += `<p>Armor Class: ${itemDetails.armor_class}</p>`;
            } else if (category === "traits") {
                // Trait details
                detailsContainer.innerHTML += `<p>Type: ${itemDetails.type}</p>`;
                detailsContainer.innerHTML += `<p>Description: ${itemDetails.desc}</p>`;

            }

        })
        .catch(error => console.error(`Erro ao obter detalhes do item ${itemName} na categoria ${category}:`, error));
}


function performSearch(selectedCategory, searchTerm) {

    const apiUrl = `https://www.dnd5eapi.co/api/${selectedCategory}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Filtra os resultados com base no termo de pesquisa
            const filteredResults = data.results.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

            // Atualiza a seção de resultados com os dados filtrados da API
            const resultsContainer = document.getElementById("results");
            resultsContainer.innerHTML = "";

            if (filteredResults.length > 0) {
                filteredResults.forEach(item => {
                    const itemElement = document.createElement("div");
                    itemElement.innerHTML = `<h3>${item.name}</h3>`;
                    resultsContainer.appendChild(itemElement);
                });
            } else {
                resultsContainer.innerHTML = `<p>Nenhum resultado encontrado para a categoria ${selectedCategory}.</p>`;
            }
        })
        .catch(error => console.error(`Erro ao chamar a API D&D 5e para a categoria ${selectedCategory}:`, error));
}

function performSearchAcrossCategories(searchTerm) {
    // Array de nomes das categorias para realizar a pesquisa
    const categories = [
        "classes", "subclasses", "features", "races", "subraces",
        "spells", "monsters", "conditions", "languages", "skills", "traits"
    ];

    // Pesquisa parqa cada categoria
    categories.forEach(category => {
        fetch(`https://www.dnd5eapi.co/api/${category}`)
            .then(response => response.json())
            .then(data => {
                // Filtra os resultados com base no termo de pesquisa
                const filteredResults = data.results.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

                // Atualiza a seção de resultados com os dados filtrados da API
                const resultsContainer = document.getElementById("results");
                resultsContainer.innerHTML = "";

                if (filteredResults.length > 0) {
                    filteredResults.forEach(item => {
                        const itemElement = document.createElement("div");
                        itemElement.innerHTML = `<h3>${item.name}</h3>`;
                        resultsContainer.appendChild(itemElement);
                    });
                } else {
                    resultsContainer.innerHTML += `<p>Nenhum resultado encontrado para a categoria ${category}.</p>`;
                }
            })
            .catch(error => console.error(`Erro ao chamar a API D&D 5e para a categoria ${category}:`, error));
    });
}


function applyFilters(selectedCategory, sortOrder) {
    const apiUrl = `https://www.dnd5eapi.co/api/${selectedCategory}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Ordena os resultados com base na opção de ordenação escolhida
            let sortedResults;

            if (sortOrder === "alphabetical_asc") {
                sortedResults = data.results.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortOrder === "alphabetical_desc") {
                sortedResults = data.results.sort((a, b) => b.name.localeCompare(a.name));
            }


            const resultsContainer = document.getElementById("results");
            resultsContainer.innerHTML = "";

            if (sortedResults && sortedResults.length > 0) {
                sortedResults.forEach(item => {
                    const itemElement = document.createElement("div");
                    itemElement.innerHTML = `<h3>${item.name}</h3>`;
                    resultsContainer.appendChild(itemElement);
                });
            } else {
                resultsContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
            }
        })
        .catch(error => console.error('Erro ao chamar a API D&D 5e:', error));
}
