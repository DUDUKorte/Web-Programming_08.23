const apiKey = 'D21B2F1C42687216FD59600511DF68A7'; // Substitua pela sua chave API da Steam
const appId = '703'; // Substitua pelo ID do jogo que você deseja verificar as ofertas

async function checkGameOffers(appId) {
  const appListResponse = await fetch(`https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2`);
  const appListData = await appListResponse.json();

  const game = appListData.applist.apps.find(app => app.appid === appId);


  if (game) {
    const ratingsResponse = await fetch(`https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppRatingsForMedia/v2/?appid=${appId}&key=${apiKey}`);
    const ratingsData = await ratingsResponse.json();

    console.log('Ofertas e Promoções para o jogo:', game.name);
    console.log('Avaliações:', ratingsData);
  } else {
    console.log('Jogo não encontrado na lista.');
  }
}

// Chamar a função para verificar ofertas e promoções
checkGameOffers(appId);