document.addEventListener("DOMContentLoaded", function () {
    // Manipulação de eventos do formulário
    document.getElementById("searchForm").addEventListener("submit", function (event) {
        event.preventDefault();

        // Obtenha o valor selecionado do filtro de categoria
        const selectedCategory = document.getElementById("categoryFilter").value;
        const sortOrder = document.getElementById("sortOrder").value;

        // Mapeamento de categorias para os endpoints da API D&D 5e
        const categoryEndpoints = {
            classes: "https://www.dnd5eapi.co/api/classes",
            spells: "https://www.dnd5eapi.co/api/spells",
            equipment: "https://www.dnd5eapi.co/api/equipment",
            monsters: "https://www.dnd5eapi.co/api/monsters",
            backgrounds: "https://www.dnd5eapi.co/api/backgrounds"
        };

        // Exemplo básico de como usar fetch para obter dados da API D&D 5e
        fetch(categoryEndpoints[selectedCategory])
            .then(response => response.json())
            .then(data => {
                // Atualize a seção de resultados com os dados recebidos da API
                const resultsContainer = document.getElementById("results");
                resultsContainer.innerHTML = "";

                if (data.results && data.results.length > 0) {
                    // Ordenar os resultados com base na opção de ordenação escolhida
                    let sortedResults;
                    if (sortOrder === "alphabetical_asc") {
                        sortedResults = data.results.sort((a, b) => a.name.localeCompare(b.name));
                    } else if (sortOrder === "alphabetical_desc") {
                        sortedResults = data.results.sort((a, b) => b.name.localeCompare(a.name));
                    }
                    // Adicione mais lógica para outras opções de ordenação, se necessário
                    // ...

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
    });

    // Adicione manipuladores de eventos para filtragem e ordenação aqui
});
v