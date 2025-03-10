export async function searchSongs(query) {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '5f79cc60aemsh5ed870d68e2972bp163efcjsne381bba9950d',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(`https://spotify23.p.rapidapi.com/search/?type=tracks&offset=0&limit=30&numberOfTopResults=5&q=${query}`, options);
      const data = await response.json();
      const tracks = data.tracks.items.map(item => ({
        id: item.data.id,
        name: item.data.name,
        image: item.data.albumOfTrack.coverArt.sources.find(source => source.width === 300).url,
        artists: item.data.artists.items.map(artist => artist.profile.name).join(", ")
      }));
      return tracks;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
  }