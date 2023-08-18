const apiKey = 'D21B2F1C42687216FD59600511DF68A7';
const steamData = document.getElementById("steamData");

async function searchGameInSteam(name) {
    //https://cors-anywhere.herokuapp.com/ << usar proxy para contornar política CORS

    //Utilização da API SteamWorks
    const url = `https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2`;
    const response = await fetch(url);
    const data = await response.json();

    console.log(data)
    
    //Pegar apenas os jogos dos dados
    const games = data.applist.apps;
    //Transformar nome do jogo pesquisado para lowercase
    const searchTerm = name.toLowerCase();

    //Encontrar Jogo pesquisado na lista
    const matchingGames = games.filter(game => game.name.toLowerCase().includes(searchTerm));

    return matchingGames;

}

async function searchPlayerById(){
    const steamId = "76561198408735369";
    const url = `https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
    const response = await fetch(url);
    console.log(response)
    const data = await response.json();
    console.log(data);
}

async function searchGamesPlayed(){
    try{
        const steamId = "76561198408735369";
        const url = `https://cors-anywhere.herokuapp.com/https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}`
        const response = await fetch(url);
        const data = await response.json();

        const games = data.response.games;
        console.log(games);

        for(const game of games){
            const appId = game.appid;
            const playedTimeMin = game.playtime_2weeks;

            console.log(playedTimeMin, ' : ', game);
        }
    }catch (error){
        console.log("Houve um erro inesperado, tente novamente mais tarde:", error);
    }
}

const nomeDoJogo = 'Call of duty'
// Chamar a função para buscar jogos com o nome procurado
searchGameInSteam(nomeDoJogo).then(result => {
    console.log('Jogos encontrados:', result);
});

searchPlayerById();
searchGamesPlayed();