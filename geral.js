document.addEventListener("DOMContentLoaded", function () {
    // Manipulação de eventos do formulário de Pesquisa
    document.getElementById("searchForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const searchTerm = document.getElementById("searchInput").value;
        // Chame a função de pesquisa com searchTerm
        performSearch(searchTerm);
    });

    // Manipulação de eventos do formulário de Categorias e Ordenação
    document.getElementById("categoryForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedOption = document.getElementById("categoryFilter").options[document.getElementById("categoryFilter").selectedIndex];
        const selectedCategory = selectedOption.value;
        const sortOrder = document.getElementById("sortOrder").value;

        // Display the selected category title with the first letter capitalized
        const selectedCategoryTitle = capitalizeFirstLetter(selectedCategory);
        document.getElementById("selectedCategoryTitle").innerText = selectedCategoryTitle;

        // Display the selected category icon
        const selectedCategoryIconContainer = document.getElementById("selectedCategoryIcon");
        selectedCategoryIconContainer.innerHTML = ""; // Clear previous icon
        const icon = document.createElement("i");
        icon.classList.add("fas", selectedOption.dataset.icon);
        selectedCategoryIconContainer.appendChild(icon);

        // Chame a função de aplicar filtros com selectedCategory e sortOrder
        applyFilters(selectedCategory, sortOrder);
    });

    // Adicione manipuladores de eventos para filtragem e ordenação aqui
});

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function performSearch(searchTerm, selectedCategory) {
    // Lógica para realizar a pesquisa e exibir resultados
    const apiUrl = "https://www.dnd5eapi.co/api/spells";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Filtra os resultados com base no termo de pesquisa
            const filteredResults = data.results.filter(spell => spell.name.toLowerCase().includes(searchTerm.toLowerCase()));

            // Atualize a seção de resultados com os dados filtrados da API
            const resultsContainer = document.getElementById("results");
            resultsContainer.innerHTML = "";

            if (filteredResults.length > 0) {
                filteredResults.forEach(spell => {
                    const spellElement = document.createElement("div");
                    spellElement.innerHTML = `<h3>${spell.name}</h3>`;
                    resultsContainer.appendChild(spellElement);
                });
            } else {
                resultsContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
            }
        })
        .catch(error => console.error('Erro ao chamar a API D&D 5e:', error));
}

function applyFilters(selectedCategory, sortOrder) {
    // Lógica para aplicar filtros e exibir resultados
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

            // Atualize a seção de resultados com os dados ordenados da API
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
