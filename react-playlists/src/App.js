import React, { Component } from 'react';
import queryString from 'query-string';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { fab } from '@fortawesome/pro-light-svg-icons';
// import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import './App.css';

// library.add(faSpinner);

// const fakeServerData = {
//   user: {
//     name: 'Dogan',
//     playlists: [
//       {
//         name: 'My favorites123',
//         songs: [
//           { name: 'Beat It', duration: 240000 },
//           { name: 'Cannelloni Makaroni', duration: 280000 },
//           { name: 'Rosa helikopter', duration: 300000 },
//         ],
//       },
//       {
//         name: 'Discover Weekly',
//         songs: [
//           { name: 'Beat It', duration: 240000 },
//           { name: 'Cannelloni Makaroni', duration: 240000 },
//           { name: 'Rosa helikopter', duration: 240000 },
//         ],
//       },
//       {
//         name: 'Bana Ozel',
//         songs: [
//           { name: 'Naz Bari', duration: 320000 },
//           { name: 'Azeri Oyun Havasi', duration: 300000 },
//           { name: 'Acil Ey Omrumun Vari', duration: 360000 },
//           { name: 'Yakalarsam', duration: 360000 },
//         ],
//       },
//       {
//         name: 'Another playlist - the best!',
//         songs: [
//           { name: 'Beat It', duration: 240000 },
//           { name: 'Cannelloni Makaroni', duration: 240000 },
//           { name: 'Rosa helikopter', duration: 240000 },
//         ],
//       },
//       {
//         name: 'MyPlaylist',
//         songs: [
//           { name: 'Beat It', duration: 240000 },
//           { name: 'Cannelloni Makaroni', duration: 240000 },
//           { name: 'Rosa helikopter', duration: 240000 },
//         ],
//       },
//     ],
//   },
// };

const defaultStyle = {
  color: '#fff',
};


const PlaylistCounter = ({ playlists }) => (
  <div style={{ ...defaultStyle, width: '30%', display: 'inline-block' }}>
    <h2>{playlists.length} playlists</h2>
  </div>
);


const SongCounter = ({ playlists }) => {
  const allsongs = playlists
    .reduce((songs, eachplaylist) => songs.concat(eachplaylist.songs), []);
  return (
    <div style={{ ...defaultStyle, width: '30%', display: 'inline-block' }}>
      <h2>{allsongs.length} songs</h2>
    </div>
  );
};


const HourCounter = ({ playlists }) => {
  const allSongs = playlists
    .reduce((songs, eachPlaylist) => songs.concat(eachPlaylist.songs), []);
  const totalDuration = allSongs.reduce((sum, eachSong) => sum + eachSong.duration, 0);
  return (
    <div style={{ ...defaultStyle, width: '30%', display: 'inline-block' }}>
      <h2>{totalDuration / 60000} minutes</h2>
    </div>
  );
};


const Filter = ({ onTextChange }) => (
  <div style={defaultStyle}>
    <img src="" alt="" />
    <input type="text" onKeyUp={event => onTextChange(event.target.value)} />
    Filter
  </div>
);


const Playlist = ({ playlist }) => (
  <div style={{ ...defaultStyle, width: '20%', display: 'inline-block' }}>
    <img src="" alt="" />
    <h3>{playlist.name}</h3>
    <img src={playlist.imageUrl} alt="" style={{ height: '120px', width: '120px' }} />
    <ul>
      {playlist.songs.map(song => <li>{song.name}</li>)}
    </ul>
  </div>
);


class App extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      playlists: [],
      filterString: '',
    };
  }

  componentDidMount() {
    const parsed = queryString.parse(window.location.search);
    const accessToken = parsed.access_token;

    // Creating user objects from spotify api to be used in our app.
    fetch('https://api.spotify.com/v1/me/', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then(response => response.json())
      .then(userData => this.setState({ user: { id: userData.id } }));

    // Creating playlist arrays of playlist objects.
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then(response => response.json())
      .then((playlistData) => {
        const playlistsArray = playlistData.items;

        // Get List/Array of promises for track lists in the playlistsArray
        const playlistTracksPromises = playlistsArray.map(playlist => (
          fetch(playlist.tracks.href, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }).then(response => response.json())
        ));

        // Bundles all promises and wait for all of them to be resolved.
        const allTracksDataPromises = Promise.all(playlistTracksPromises);

        const playlistsPromise = allTracksDataPromises.then((trackDatas) => {
          trackDatas.forEach((trackData, i) => {
            playlistsArray[i].trackDatas = trackData.items
              .map(item => item.track)
              .map(singleTrack => ({
                name: singleTrack.name,
                duration: singleTrack.duration_ms,
              }));
          });
          return playlistsArray;
        });
        return playlistsPromise;
      })
      .then(playlistsArray => this.setState({
        playlists: playlistsArray.map(item => ({
          name: item.name,
          imageUrl: item.images[0].url,
          songs: item.trackDatas.slice(0, 3),
        })),
      }));
  }


  render() {
    const { user, playlists, filterString } = this.state;
    const filteredPlaylist = user && playlists
      ? playlists
        .filter(playlist => playlist.name.toLowerCase()
          .includes(filterString.toLowerCase()))
      : [];

    return (
      <div style={{ textAlign: 'center' }}>
        {
          user ? (
            <div>
              <h1 style={{ ...defaultStyle, fontSize: '50px' }}>
                {user.id}&rsquo;s Playlist
              </h1>
              <PlaylistCounter playlists={filteredPlaylist} />
              <SongCounter playlists={filteredPlaylist} />
              <HourCounter playlists={filteredPlaylist} />
              <Filter onTextChange={text => this.setState({ filterString: text })} />

              {
                filteredPlaylist.map(playlist => <Playlist playlist={playlist} />)
              }
            </div>
          ) : (
            // <div style={{ ...defaultStyle, margin: '25%' }}>
            //   <FontAwesomeIcon icon="spinner" size="3x" spin />
            //   <br /><br />
            //   Loading!
            // </div>
            <button
              onClick={() => { window.location = 'http://127.0.0.1:8000/react_auth/'; }}
              type="button"
              style={{
                padding: '20px', fontSize: '50px', marginTop: '20px', background: 'tomato',
              }}
            >Sign in with Spotify!
            </button>
          )
        }
      </div>
    );
  }
}

export default App;
