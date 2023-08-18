const apiKey = 'D21B2F1C42687216FD59600511DF68A7';
const steamData = document.getElementById("steamData");
const list = document.getElementById("games-content");

async function searchGameInSteam(name) {
    //https://cors-anywhere.herokuapp.com/ << usar proxy para contornar política CORS

    //Utilização da API SteamWorks
    const url = `https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2`;
    const response = await fetch(url);
    const data = await response.json();
    
    //Pegar apenas os jogos dos dados
    const games = data.applist.apps;
    //Transformar nome do jogo pesquisado para lowercase
    const searchTerm = name.toLowerCase();

    //Encontrar Jogo pesquisado na lista
    const matchingGames = games.filter(game => game.name.toLowerCase().includes(searchTerm));

    return matchingGames;

}

async function searchPlayerById(steamId){
    try{
        if(!steamId){
            steamId = "76561198408735369";;
        }

        const url = `https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
        const response = await fetch(url);
        const data = await response.json();
        console.log("Player Details: ", data);
    }catch(error){
        console.log("Muitas tentativas seguidas. Por favor, aguarde e tente novamente mais tarde: ", error)
    }
}

async function searchGamesPlayed(steamId, debug){
    try{
        if(debug){
            games = [
                {
                    "appid": 1174180,
                    "name": "Red Dead Redemption 2",
                    "playtime_2weeks": 1595,
                    "playtime_forever": 9202,
                    "img_icon_url": "5106abd9c1187a97f23295a0ba9470c94804ec6c",
                    "playtime_windows_forever": 9202,
                    "playtime_mac_forever": 0,
                    "playtime_linux_forever": 0
                },
                {
                    "appid": 1938090,
                    "name": "Call of Duty®",
                    "playtime_2weeks": 51,
                    "playtime_forever": 4960,
                    "img_icon_url": "8eaf32220060344996cbf11f697a4f4be943e5f3",
                    "playtime_windows_forever": 4960,
                    "playtime_mac_forever": 0,
                    "playtime_linux_forever": 0
                },
                {
                    "appid": 292030,
                    "name": "The Witcher 3: Wild Hunt",
                    "playtime_2weeks": 44,
                    "playtime_forever": 3032,
                    "img_icon_url": "6e43cb881e60712c3cccdd7f871baa56acf15328",
                    "playtime_windows_forever": 3032,
                    "playtime_mac_forever": 0,
                    "playtime_linux_forever": 0
                },
                {
                    "appid": 1670460,
                    "name": "GameMaker",
                    "playtime_2weeks": 29,
                    "playtime_forever": 70,
                    "img_icon_url": "7e1c283eaa531a6ede26c507ef146a5bb735a2a0",
                    "playtime_windows_forever": 70,
                    "playtime_mac_forever": 0,
                    "playtime_linux_forever": 0
                },
                {
                    "appid": 646910,
                    "name": "The Crew 2",
                    "playtime_2weeks": 18,
                    "playtime_forever": 1331,
                    "img_icon_url": "c627b2fa24d61b4042afbd2b183f49b9ca59bc45",
                    "playtime_windows_forever": 1331,
                    "playtime_mac_forever": 0,
                    "playtime_linux_forever": 0
                },
                {
                    "appid": 10180,
                    "name": "Call of Duty: Modern Warfare 2 (2009)",
                    "playtime_2weeks": 9,
                    "playtime_forever": 1607,
                    "img_icon_url": "ad502494f1658220f9166c7e17ac90422bf6a479",
                    "playtime_windows_forever": 1607,
                    "playtime_mac_forever": 0,
                    "playtime_linux_forever": 0
                },
                {
                    "appid": 311210,
                    "name": "Call of Duty: Black Ops III",
                    "playtime_2weeks": 2,
                    "playtime_forever": 5229,
                    "img_icon_url": "bd3e3a9516b480164df25d16e49ae4ce4a063cb4",
                    "playtime_windows_forever": 5229,
                    "playtime_mac_forever": 0,
                    "playtime_linux_forever": 0
                },
                {
                    "appid": 42690,
                    "name": "Call of Duty®: Modern Warfare® 3 (2011) - Multiplayer",
                    "playtime_2weeks": 2,
                    "playtime_forever": 116,
                    "img_icon_url": "c3330a875925437d8216949b6571f6e941ba0679",
                    "playtime_windows_forever": 116,
                    "playtime_mac_forever": 0,
                    "playtime_linux_forever": 0
                }
            ]

            if(!steamId){
                steamId = "76561198408735369";;
            }

            console.log("All played games: ", games);
    
            //list.innerHTML = "";
    
            // for(const game of games){
            //     const gameId = game.appid;
            //     const playedTimeMin = game.playtime_2weeks;
    
            //     console.log(playedTimeMin, ' : ', game.name);
    
    
            //     //Atualiza lista de jogos recentemente jogados no site
            //     let listItems = document.createElement("img");



            //     //Colocar ícone de um jogo
            //     let gameIconURL = `https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/header.jpg?t=1671485009`;
            //     //https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg?t=1671485009
    
            //     //Colocar classe para estilizar
            //     listItems.className = "list-games";
            //     listItems.src = gameIconURL;
            //     list.appendChild(listItems);
            // }

        }else{
            if(!steamId){
                steamId = "76561198408735369";;
            }
    
            const url = `https://cors-anywhere.herokuapp.com/https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}`
            const response = await fetch(url);
            const data = await response.json();
    
            const games = data.response.games;
            console.log("All played games: ", games);
    
            list.innerHTML = "";
    
            for(const game of games){
                const gameId = game.appid;
                const playedTimeMin = game.playtime_2weeks;
    
                console.log(playedTimeMin, ' : ', game.name);
    
    
                //Atualiza lista de jogos recentemente jogados no site
                let listItems = document.createElement("div");
                //Colocar ícone de um jogo
                let gameIconURL = `https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/header.jpg?t=1671485009`;
                //https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg?t=1671485009
    
                //Colocar classe para estilizar
                //listItems.className = "list-games";
                listItems.src = gameIconURL;
                list.appendChild(listItems);
            }
        }
    }catch (error){
        console.log("Houve um erro inesperado, tente novamente mais tarde:", error);
    }
}

function executar_main(){
    console.clear();
    
    //const nomeDoJogo = 'Call of duty'
    const nomeDoJogo = document.getElementById("searchGame").value;
    // Chamar a função para buscar jogos com o nome procurado
    searchGameInSteam(nomeDoJogo).then(result => {
        console.log('Jogos encontrados:', result);
    });

    const steamId = document.getElementById("steamId").value;
    searchPlayerById(steamId);
    searchGamesPlayed(steamId);
}

document.getElementById("button").addEventListener("click", executar_main);

searchGamesPlayed(null, true);