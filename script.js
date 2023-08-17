const apiKey = 'D005C0AE66AA55F8A7A14342F0DE17D7';

async function searchGameInSteam(name) {

    const response = await fetch(`https://api.steampowered.com/ISteamApps/GetAppList/v2/`);
    console.log(response)
    const data = await response.json();
    
    const games = data.applist.apps;
    const searchTerm = name.toLowerCase();
    
    const matchingGames = games.filter(game => game.name.toLowerCase().includes(searchTerm));
    
    return matchingGames;

}

// Chamar a função para buscar jogos com o nome "Counter-Strike"
searchGameInSteam('Counter-Strike').then(result => {
    console.log('Jogos encontrados:', result);
});


// const apiKey = 'A400F13A62A8DA8A22F14B4777AC988B';
// const steamId = '76561198408735369'; // Substitua pelo Steam ID do jogador que deseja consultar

// const steamDataElement = document.getElementById('steamData');

// // Função para fazer uma solicitação à API da Steam e manipular a resposta
// async function fetchSteamProfile() {
//     const response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`, {mode:'no-cors'});
//     console.log(response)
//     const data = await response.json();
//     console.log(data)
//     const playerData = data.response.players[0];
//     steamDataElement.innerHTML = `
//         <p>Nome do jogador: ${playerData.personaname}</p>
//         <p>Status: ${playerData.personastate === 0 ? 'Offline' : 'Online'}</p>
//         <p>URL do perfil: <a href="${playerData.profileurl}" target="_blank">${playerData.profileurl}</a></p>
//         <img src="${playerData.avatarfull}" alt="Avatar do jogador">
//     `;
// }

// // Chamar a função para buscar os dados do jogador ao carregar a página
// fetchSteamProfile();
