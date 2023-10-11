const apiKey = 'D21B2F1C42687216FD59600511DF68A7';
const htmlsteamId = document.getElementById("steamId");
const nomeDoJogo = document.getElementById("searchGame");
const useCorsPolicy = true;
let onlineGamesSteamDatabase;

//Load all necessary databases
async function load_databases(){
    useCorsPolicy ? url = `https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2` : url = `https://api.steampowered.com/ISteamApps/GetAppList/v2`;
    onlineGamesSteamDatabase = await fetch(url);
    console.log("databases loaded!")
}

this.load_databases();

function tooManyRequestsWarning(reverse = false, text = "Too Many Request. Please, wait and try again later."){
    if(reverse){
        document.getElementById("tooManyRq").textContent = "";
    }else{
        console.log("Muitas tentativas seguidas. Por favor, aguarde e tente novamente mais tarde: ");
        document.getElementById("tooManyRq").textContent = text;
    }
}

function verifyImageValid(url, callback){
    const img = new Image();
    img.onload = function(){
        callback(true);
    }
    img.onerror = function(){
        callback(false);
    }
    img.src = url;
}

async function convertUsernameToId(currentid){
    if(!Number.isNaN(Number(steamId))){
        return currentid;
    }else{
        const username = currentid;
        let url;
        useCorsPolicy ? url = `https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${username}` : url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${username}`;
        const usernameResponse = await fetch(url);
        
        if(usernameResponse.status == 429){
            tooManyRequestsWarning()
        }else{
            tooManyRequestsWarning(true)
        }

        const usernameData = await usernameResponse.json();
        if (usernameData.response.success === 1){
            currentid = usernameData.response.steamid;
            return currentid;
        }
    }
}

async function addGameToHTML(gameIconURL, game, containerElement){
    //Adicionando os jogos no html
    const divElement = document.createElement("div");
    divElement.classList.add("col-lg-6", "col-md-6", "wow", "fadeInUp");
    divElement.setAttribute("data-wow-delay", "0s");

    //Criar elemento de card
    const cardElement = document.createElement("div");
    cardElement.classList.add("rounded", "shadow", "overflow-hidden", "card-game");

    //Criar outra div
    const positionElement = document.createElement("div");
    positionElement.classList.add("position-relative");

    //Criar elemento do link da imagem
    const url = `https://store.steampowered.com/app/${game.appid}/`
    const aElement = document.createElement("a");
    aElement.setAttribute("href", url)

    //Criar elemento da imagem
    const imgElement = document.createElement("img");
    imgElement.src = gameIconURL;
    imgElement.alt = game.name;
    imgElement.classList.add("card-img-bottom", "card-game-img");

    //Adicionar para cada div
    aElement.appendChild(imgElement)
    positionElement.appendChild(aElement);
    cardElement.appendChild(positionElement);
    divElement.appendChild(cardElement);

    containerElement.appendChild(divElement);
}

async function searchGameInSteam() {
    let name = nomeDoJogo.value;

    //Apenas se um nome foi digitado
    if(name){
        //https://cors-anywhere.herokuapp.com/ << usar proxy para contornar política CORS

        //Pegando todos os jogos com a api
        let data;
        let response = onlineGamesSteamDatabase;

        try{
            if(response.status == 429){
                tooManyRequestsWarning(false, "Too many requests. Using offline database");
            }else{
                tooManyRequestsWarning(true);
            }
            data = await response.json(); //Pega o json com os dados de todos os jogos da steam
        }catch{
            //Get offline array if API fails
            response = await fetch('steam_games.json');
            data = await response.json();
        }

        //Pegar apenas os jogos dos dados
        const games = data.applist.apps;
        //Transformar nome do jogo pesquisado para lowercase
        const searchTerm = name.toLowerCase();

        //Encontrar Jogo pesquisado na lista
        const matchingGames = games.filter(game => game.name.toLowerCase().includes(searchTerm));

        //Pega elemento do html e limpa
        const containerElement = document.getElementById("games-container");
        containerElement.innerHTML = "";

        //Para cada jogo da lista de jogos filtrados na pesquisa
        for(let game of matchingGames){
            //pega id do jogo
            const gameId = game.appid;
            //pega a url da imagem do jogo
            let gameIconURL = `https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/header.jpg?t=1671485009`;
            console.log("GAME ID: " + gameId + " NOME DO ITEM: " + game.name);
            
            //Teste para não ocorrer erro 404 e parar o código
            //const test = await fetch(gameIconURL);
            //Verifica se a imagem foi recebida com êxito

            verifyImageValid(gameIconURL, isValid => {
                if(isValid){
                    addGameToHTML(gameIconURL, game, containerElement);
                }else{
                    console.log('URL de Imagem é inválido');
                }
            })
        }
    }
}

async function searchPlayerById(){
    steamId = htmlsteamId.value;
    //Steam id meu próprio para "placeholder" caso a pessoa não coloque nada
    if(!steamId){
        steamId = "76561198408735369";;
    }else{
        //Verifica se a pessoa digitou um ID ou um nome de usuário
        steamId = await convertUsernameToId(steamId);
    }

    //Pega as informações do usuário com a api da steam
    let url;
    useCorsPolicy ? url = `https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}` : url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
    const response = await fetch(url);

    if(response.status == 429){
        tooManyRequestsWarning()
    }else{
        tooManyRequestsWarning(true)
    }

    const data = await response.json();
    const playerDetails = data.response.players[0] //Pegar apenas e especificamente os valores do player
    
    //Pegar outras informações do player
    useCorsPolicy ? url = `https://cors-anywhere.herokuapp.com/http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json` : url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;
    const _response = await fetch(url);
    const _data = await _response.json();
    const game_count = _data.response.game_count;

    //Usar valores do player
    console.log("Player Details: ", playerDetails);

    //Atualizando valores do usuário na página do html
    document.getElementById("playerUsername").textContent = playerDetails.personaname;
    document.getElementById("userImage").src = playerDetails.avatarfull;
    document.getElementById("userUrlSteam").href = playerDetails.profileurl;
    document.getElementById("userUrlSteam").textContent = playerDetails.profileurl;
    document.getElementById("game-count").textContent = game_count;


    //Converter tempo de segundos para data atual da conta criada
    let timecreated = playerDetails.timecreated;
    let createdDate = new Date(timecreated * 1000);
    let formattedDate = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()} ${createdDate.getHours()}:${createdDate.getMinutes()}:${createdDate.getSeconds()}`
    document.getElementById("userTimeCreated").textContent = formattedDate;
    //Converter tempo de segundos para data atual da conta deslogada
    timecreated = playerDetails.lastlogoff;
    createdDate = new Date(timecreated * 1000);
    formattedDate = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()} ${createdDate.getHours()}:${createdDate.getMinutes()}:${createdDate.getSeconds()}`
    document.getElementById("userLastLogoff").textContent = formattedDate;
}

async function searchGamesPlayed(){
    try{
        steamId = htmlsteamId.value;

        if(!steamId){
            steamId = "76561198408735369";;
        }else{
            steamId = await convertUsernameToId(steamId);
        }

        let url;
        useCorsPolicy ? url = `https://cors-anywhere.herokuapp.com/https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}` : url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}`;
        const response = await fetch(url);
        const data = await response.json();

        const games = data.response.games;
        console.log("All played games: ", games);

        const containerElement = document.getElementById("user-games-container");
        containerElement.innerHTML = "";

        for(const game of games){
            //pega Id do jogo
            const gameId = game.appid;
            const playedTimeMin = game.playtime_2weeks; //Usar depois de alguma forma

            //pega url da imagm do jogo
            let gameIconURL = `https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/header.jpg?t=1671485009`; 

            verifyImageValid(gameIconURL, isValid => {
                if(isValid){
                    addGameToHTML(gameIconURL, game, containerElement);
                }else{
                    console.log('URL de Imagem é inválido');
                }
            })
        }
    }catch (error){
        console.log("Houve um erro inesperado, tente novamente mais tarde:", error);
    }
}

console.log("Steamworks API Site Version 1.4")

document.getElementById("searchGame").addEventListener("focusout", searchGameInSteam);
document.getElementById("steamId").addEventListener("focusout", searchPlayerById);
document.getElementById("steamId").addEventListener("focusout", searchGamesPlayed);