let searchPokemon = 1;

async function fetchPokemon(pokemon) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if(response.status === 200) {
        const data = await response.json();
        return data;
    }
}

async function renderPokemon(pokemon) {
    $('.pokemonName').text('Carregando...')
    $('.pokemonId').text('')

    const data = await fetchPokemon(pokemon);
    
    if (data) {
        $('.pokemonId').html(data.id)
        $('.pokemonName').html(data.name)
        $('.pokemonType').html(data.types['0'].type.name.toUpperCase())
        $('.pokemonImg').prop('src', data.sprites.versions['generation-v']['black-white'].animated.front_default)
 
        $('.qtd .pokemonHp').html(data.stats['0'].base_stat)
        $('.qtd .pokemonAttack').html( data.stats['1'].base_stat)
        $('.qtd .pokemonDefense').html( data.stats['2'].base_stat)
        $('.qtd .pokemonSpecialA').html( data.stats['3'].base_stat)
        $('.qtd .pokemonSpecialD').html( data.stats['4'].base_stat)
        $('.qtd .pokemonSpeed').html( data.stats['5'].base_stat)

        switch($('.pokemonType').html()){
            case 'FIRE':
                $('.pokemonType').css({"background": "#ff5656"})
            break;
            case 'GRASS':
                $('.pokemonType').css({"background": "#2aa92e"})
            break;
            case 'WATER':
                $('.pokemonType').css({"background": "#699bff"})
            break;
            case 'BUG':
                $('.pokemonType').css({"background": "#bf58cf"})
            break;
            case 'ELECTRIC':
                $('.pokemonType').css({"background": "#d39d03"})
            break;
            case 'POISON':
                $('.pokemonType').css({"background": "#746ec7"})
            break;
            case 'GROUND':
                $('.pokemonType').css({"background": "#533514"})
            break;
            case 'NORMAL':
                $('.pokemonType').css({"background": "#afafaf"})
            break;
            case 'FAIRY':
                $('.pokemonType').css({"background": "#eca0ff"})
            break;
            case 'FIGHTING':
                $('.pokemonType').css({"background": "#111"})
            break;
            case 'PSYCHIC':
                $('.pokemonType').css({"background": "#7a6fa3"})
            break;
        }

        $('.formSearch').each(function(){
            this.reset();
        });

        searchPokemon = data.id;
    } else {
        $('.pokemonId').text('')
        $('.pokemonName').text('Não encontrado')
        $('.pokemonImg').prop('src', '')
        $('.pokemonType').css({"background": "#afafaf"})
        $('.pokemonType').text('---')

        $('.qtd span').text('-');

        searchPokemon = 0;
        
        $('.formSearch').each(function(){
            this.reset();
        });
    }
}

$('.formSearch').submit(function(event) {
    event.preventDefault();

    renderPokemon($('.inputSearch').val().toLowerCase());
})

$('.btnPrev').click(function(){
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
})

$('.btnNext').click(function(){
    searchPokemon += 1;
    renderPokemon(searchPokemon);
})

renderPokemon(searchPokemon);

let pokemons_number = 16;
let pokemons_show = 1;

$('.btnMore').click(function(){
    pokemons_number += 16;
    pokemons_show += 16;
    fetchAllPokemons(pokemons_show, pokemons_number);
})

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
    $(`
        <div class="pokemon">
            <a href="#pokedex">
                <button class="viewPokemon" onclick="viewPokemon(${pokemon.id})">
                    <div class="pokemonsContent">
                        <img src="${pokemon.sprites.versions['generation-v']['black-white'].animated.front_default}" />
                    </div>
                </button>
            </a>
        </div>
    `).appendTo('.pokemons') 
}

function viewPokemon(id){
    searchPokemon = id;
    renderPokemon(searchPokemon);
}

$('.formCompare').submit(async function(event) {
    event.preventDefault();

    const first = await fetch(`https://pokeapi.co/api/v2/pokemon/${$('.firstPokemon').val().toLowerCase()}`)
    const last = await fetch(`https://pokeapi.co/api/v2/pokemon/${$('.secondPokemon').val().toLowerCase()}`)

    $('.formCompare').each(function(){
        this.reset();
    });

    if(first.status === 200 && last.status === 200){
        $('.notFound').remove();
        const firstPokemon = await first.json();
        const secondPokemon = await last.json();
        createChart(firstPokemon, secondPokemon);
    } else {
        $('.notFound').remove();
        $('.names').prepend(`
            <div class="notFound">
                <span> Err Pokemon not found :C  </span>
            </div>
        `)
    }
})

function createChart(firstPokemon, secondPokemon){
    $('.chart').remove();

    $(`
        <div class="chart">
            <canvas id="myChart" width="400" height="400"></canvas>
        </div>
    `).appendTo('.compare') 

    firstName = firstPokemon.name
    secondName = secondPokemon.name

    const ctx = document.getElementById('myChart').getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'],
            datasets: [{
                label: `${firstName[0].toUpperCase() + firstName.substring(1)}`,
                data: [
                    firstPokemon.stats['0'].base_stat, 
                    firstPokemon.stats['1'].base_stat, 
                    firstPokemon.stats['2'].base_stat, 
                    firstPokemon.stats['3'].base_stat, 
                    firstPokemon.stats['4'].base_stat, 
                    firstPokemon.stats['5'].base_stat
                ],

                backgroundColor: 'rgba(255, 99, 132, 0.2)',             
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, 

            {
                label: `${secondName[0].toUpperCase() + secondName.substring(1)}`,
                data: [
                    secondPokemon.stats['0'].base_stat, 
                    secondPokemon.stats['1'].base_stat, 
                    secondPokemon.stats['2'].base_stat, 
                    secondPokemon.stats['3'].base_stat, 
                    secondPokemon.stats['4'].base_stat, 
                    secondPokemon.stats['5'].base_stat
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

$('.buttonClose').click(function() {
    $('.notFound').remove();
    $('.chart').remove();
})