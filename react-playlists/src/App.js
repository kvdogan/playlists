import React, { Component } from 'react';
import queryString from 'query-string';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { fab } from '@fortawesome/pro-light-svg-icons';
// import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import 'reset-css';
import './App.css';
// import fakeServerData from './fakeServerData';

// console.log(fakeServerData.user);
// console.log(fakeServerData.user.playlists[0].songs);

// library.add(faSpinner);

const defaultStyle = {
  margin: '5px 0 5px 0',
  color: '#fff',
  'font-family': 'Verdana',
  'font-size': '16px',

};

const counterStyle = {
  ...defaultStyle,
  width: '30%',
  display: 'inline-block',
  fontSize: '20px',
};

const PlaylistCounter = ({ playlists }) => (
  <div style={counterStyle}>
    <h2>{playlists.length} playlists</h2>
  </div>
);


const SongCounter = ({ playlists }) => {
  const allsongs = playlists
    .reduce((songs, eachplaylist) => songs.concat(eachplaylist.songs), []);
  const isTooFewSongs = allsongs.length < 10;
  const songCounterStyle = {
    ...counterStyle,
    color: isTooFewSongs ? 'red' : 'white',
  };
  return (
    <div style={songCounterStyle}>
      <h2>{allsongs.length} songs</h2>
    </div>
  );
};


const HourCounter = ({ playlists }) => {
  const allSongs = playlists
    .reduce((songs, eachPlaylist) => songs.concat(eachPlaylist.songs), []);
  const totalDuration = allSongs.reduce((sum, eachSong) => sum + eachSong.duration, 0) / 60000;
  const isTooFewMin = totalDuration < 30;
  const hourCounterStyle = {
    ...counterStyle,
    color: isTooFewMin ? 'red' : 'white',
  };
  return (
    <div style={hourCounterStyle}>
      <h2>{totalDuration.toFixed()} min</h2>
    </div>
  );
};


const Filter = ({ onTextChange }) => (
  <div style={defaultStyle}>
    <img src="" alt="" />
    <input
      style={{ ...counterStyle, background: 'khaki', color: 'black', textAlign: 'center' }}
      type="text"
      onKeyUp={event => onTextChange(event.target.value)}
      placeholder="Search Playlist or Songs"
    />
  </div>
);


const Playlist = ({ playlist, index }) => (
  <div
    style={{
      ...defaultStyle,
      width: '26%',
      padding: '10px',
      'background-color': index % 2 ? 'gray' : 'silver',
      order: '0',
      flex: '1 1 auto',
    }}
  >
    <img src="" alt="" />
    <h3>{playlist.name}</h3>
    <img src={playlist.imageUrl} alt="" style={{ height: '120px', width: '120px', padding: '2px' }} />
    <ul style={{ marginTop: '10px' }}>
      {playlist.songs.slice(0, 3).map(song => <li>{song.name}</li>)}
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
    fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
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
          songs: item.trackDatas,
        })),
      }));
  }


  render() {
    const { user, playlists, filterString } = this.state;
    const filteredPlaylist = user && playlists
      ? playlists
        .filter(
          (playlist) => {
            const playlistMatch = playlist.name.toLowerCase()
              .includes(filterString.toLowerCase());
            const songMatch = playlist.songs.find(song => song.name.toLowerCase()
              .includes(filterString.toLowerCase()));
            return playlistMatch || songMatch;
          },
        ) : [];

    return (
      <div className="App">
        {
          user ? (
            <div>
              <h1 style={{ ...defaultStyle, fontSize: '50px', marginTop: '1%' }}>
                {user.id}&rsquo;s Playlist
              </h1>
              <PlaylistCounter playlists={filteredPlaylist} />
              <SongCounter playlists={filteredPlaylist} />
              <HourCounter playlists={filteredPlaylist} />
              <Filter onTextChange={text => this.setState({ filterString: text })} />
              <div
                style={{
                  display: 'flex',
                  'flex-flow': 'row wrap',
                  'justify-content': 'center',
                  'align-items': 'stretch',
                  'align-content': 'flex-start',
                }}
              >
                {
                  filteredPlaylist.map((playlist, i) => <Playlist playlist={playlist} index={i} />)
                }
              </div>
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
