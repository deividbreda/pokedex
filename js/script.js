const pokemonName = document.querySelector('.pokemonName');
const pokemonId = document.querySelector('.pokemonId');
const pokemonImg = document.querySelector('.pokemonImg');
const pokemonType = document.querySelector('.pokemonType');

const pokemonHp = document.querySelector('.pokemonHp');
const pokemonAttack = document.querySelector('.pokemonAttack');
const pokemonDefense = document.querySelector('.pokemonDefense');
const pokemonSpecialA = document.querySelector('.pokemonSpecialA');
const pokemonSpecialD = document.querySelector('.pokemonSpecialD');
const pokemonSpeed = document.querySelector('.pokemonSpeed');

const formSearch = document.querySelector('.formSearch');
const inputSearch = document.querySelector('.inputSearch');

const bntPrev = document.querySelector('.bntPrev');
const btnNext = document.querySelector('.btnNext');

let searchPokemon = 1;

async function fetchPokemon(pokemon) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if(response.status === 200) {
        const data = await response.json();
        return data;
    }
}

async function renderPokemon(pokemon) {
    pokemonName.innerHTML = 'Carregando...';
    pokemonId.innerHTML = '';

    const data = await fetchPokemon(pokemon);
    
    if (data) {
        pokemonName.innerHTML = data.name;
        pokemonId.innerHTML = data.id;
        pokemonImg.src = data.sprites.versions['generation-v']['black-white'].animated.front_default
        pokemonType.innerHTML = data.types['0'].type.name.toUpperCase();

        pokemonHp.innerHTML = data.stats['0'].base_stat;
        pokemonAttack.innerHTML = data.stats['1'].base_stat;
        pokemonDefense.innerHTML = data.stats['2'].base_stat;
        pokemonSpecialA.innerHTML = data.stats['3'].base_stat;
        pokemonSpecialD.innerHTML = data.stats['4'].base_stat;
        pokemonSpeed.innerHTML = data.stats['5'].base_stat;

        switch(pokemonType.innerHTML){
            case 'FIRE':
                pokemonType.style.background = '#ff5656';
            break;
            case 'GRASS':
                pokemonType.style.background = '#2aa92e';
            break;
            case 'WATER':
                pokemonType.style.background = '#699bff';
            break;
            case 'BUG':
                pokemonType.style.background = '#bf58cf';
            break;
            case 'ELECTRIC':
                pokemonType.style.background = '#d39d03';
            break;
            case 'POISON':
                pokemonType.style.background = '#746ec7';
            break;
            case 'GROUND':
                pokemonType.style.background = '#533514';
            break;
            case 'NORMAL':
                pokemonType.style.background = '#afafaf';
            break;
            case 'FAIRY':
                pokemonType.style.background = '#eca0ff';
            break;
            case 'FIGHTING':
                pokemonType.style.background = '#111';
            break;
            case 'PSYCHIC':
                pokemonType.style.background = '#7a6fa3';
            break;
        }

        inputSearch.value = '';
        searchPokemon = data.id;
    } else {
        pokemonId.innerHTML = '';
        pokemonName.innerHTML = 'Não encontrado'
        pokemonImg.src = '';
        pokemonType.style.background = '#afafaf';
        pokemonType.innerHTML = '---';

        $('.qtd span').text('-');

        searchPokemon = 0;
        inputSearch.value = '';
    }
}

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    renderPokemon(inputSearch.value.toLowerCase());
});

bntPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

btnNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

renderPokemon(searchPokemon);


// Todos os pokemons
const pokemonsContainer = document.querySelector('.pokemons');

const btnMore = document.querySelector('.btnMore');

let pokemons_number = 16;
let pokemons_show = 1;

btnMore.addEventListener('click', () => {
    pokemons_number = pokemons_number + 16;
    pokemons_show = pokemons_show + 16;
    fetchAllPokemons(pokemons_show, pokemons_number);
});

const fetchAllPokemons = async (show, number) => {
    for(let i = show; i <= number; i++) {
        await getPokemon(i);
    }
}

const getPokemon = async id => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    createPokemonCard(pokemon);
}

fetchAllPokemons(pokemons_show, pokemons_number);

function createPokemonCard(pokemon) {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');

    const pokemonInnerHtml = `
        <a href="#pokedex">
            <button class="viewPokemon" onclick="viewPokemon(${pokemon.id})">
                <div class="pokemonsContent">
                    <img src="${pokemon.sprites.versions['generation-v']['black-white'].animated.front_default}" />
                </div>
            </button>
        </a>
    `;

    pokemonEl.innerHTML = pokemonInnerHtml;
    pokemonsContainer.appendChild(pokemonEl);
}

function viewPokemon(id){
    searchPokemon = id;
    renderPokemon(searchPokemon);
}

