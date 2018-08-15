import React, { Component } from 'react';
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
    <ul>
      {playlist.songs.map(song => <li>{song.name}</li>)}
    </ul>
  </div>
);


class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: '',
    };
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({ serverData: fakeServerData });
    // }, 1000);
  }

  render() {
    const { serverData, filterString } = this.state;
    const filteredPlaylist = serverData.user
      ? serverData.user.playlists
        .filter(playlist => playlist.name.toLowerCase()
          .includes(filterString.toLowerCase()))
      : [];

    return (
      <div style={{ textAlign: 'center' }}>
        {
          serverData.user ? (
            <div>
              <h1 style={{ ...defaultStyle, fontSize: '50px' }}>
                {serverData.user.name}&rsquo;s Playlist
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
              onClick={() => { window.location = 'http://127.0.0.1:8000/authorize/'; }}
              type="button"
              style={{ padding: '20px', 'font-size': '50px', 'margin-top': '20px' }}
            >Sign in with Spotify!
            </button>
          )
        }
      </div>
    );
  }
}

export default App;
