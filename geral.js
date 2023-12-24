document.addEventListener('DOMContentLoaded', function () {
    const apiEndpoint = 'https://gutendex.com/books';

    // Function to fetch fox data from the API
    async function fetchFoxes() {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao consultar a API:', error);
        }
    }

    // Function to display foxes in the results container
    function displayFoxes(foxes) {
        const resultsContainer = document.getElementById('apiResults');
        resultsContainer.innerHTML = '';

        foxes.forEach(fox => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `<img src="${fox.image}" alt="Fox">`;
            resultsContainer.appendChild(resultItem);
        });
    }

    // Function to perform search, filter, and sort operations
    async function searchFoxes() {
        const name = document.getElementById('nameInput').value;
        const category = document.getElementById('categoryFilter').value;

        // Fetch foxes from the API
        const foxes = await fetchFoxes();

        // Filter by name
        const filteredFoxes = name
            ? foxes.filter(fox => fox.name.toLowerCase().includes(name.toLowerCase()))
            : foxes;

        // Filter by category
        const finalFoxes = category
            ? filteredFoxes.filter(fox => fox.category.toLowerCase() === category.toLowerCase())
            : filteredFoxes;

        // Display the results
        displayFoxes(finalFoxes);
    }

    // Assign the search function to the button click event
    document.getElementById('apiForm').addEventListener('submit', function (event) {
        event.preventDefault();
        searchFoxes();
    });

    // Initial load
    searchFoxes();
});
