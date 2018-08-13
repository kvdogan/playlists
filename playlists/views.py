from django.shortcuts import render, redirect
# from django.http import JsonResponse
import json
import base64
import requests
import mysite.spotify_settings as spotify
# Create your views here.


def _app_Authorization(request):
    auth_query_parameters = {
        "response_type": spotify.RESPONSE_TYPE,
        "redirect_uri": spotify.REDIRECT_URI,
        "scope": spotify.SCOPE,
        "state": spotify.STATE,
        "show_dialog": spotify.SHOW_DIALOG_str,
        "client_id": spotify.CLIENT_ID
    }

    url_args = requests.get(spotify.SPOTIFY_AUTH_URL, params=auth_query_parameters).url

    return redirect(url_args)


def _user_Authorization(request):
    """Generate headers for Spotify Web API with access token"""
    auth_token = request.GET['code']
    code_payload = {
        "grant_type": "authorization_code",
        "code": str(auth_token),
        "redirect_uri": spotify.REDIRECT_URI
    }
    base64encoded = base64.b64encode(
        bytes(f"{spotify.CLIENT_ID}:{spotify.CLIENT_SECRET}", encoding='utf-8')
    )
    headers = {"Authorization": f"Basic {base64encoded.decode('utf-8')}"}
    post_request = requests.post(
        spotify.SPOTIFY_TOKEN_URL,
        data=code_payload,
        headers=headers
    )

    # Tokens are Returned to Application
    response_data = json.loads(post_request.text)
    access_token = response_data["access_token"]
    # refresh_token = response_data["refresh_token"]
    # token_type = response_data["token_type"]
    # expires_in = response_data["expires_in"]

    # Use the access token to access Spotify API
    authorization_header = {"Authorization": f"Bearer {access_token}"}

    return authorization_header


# Spotify API wrappers
def get_profile_data(auth_header):
    # Get user profile data
    user_profile_api_endpt = f"{spotify.SPOTIFY_API_URL}/me"
    profile_response = requests.get(user_profile_api_endpt, headers=auth_header)
    profile_data = json.loads(profile_response.text)
    return profile_data


def get_playlist_data(auth_header, username='me'):
    # Get user playlist name and image href
    playlist_api_endpoint = f"https://api.spotify.com/v1/{username}/playlists"
    playlists_response = requests.get(playlist_api_endpoint, headers=auth_header)
    playlist_data = json.loads(playlists_response.text)
    playlist_data = [(i['name'], i['images'][0]['url']) for i in playlist_data['items']]
    return playlist_data


def get_album_data(auth_header, username='me', limit=50, offset=0):
    # Get user albums data
    user_api = "https://api.spotify.com/v1/me"
    album_api_endpoint = f"{user_api}/albums?limit={str(limit)}&offset={str(offset)}"
    album_response = requests.get(album_api_endpoint, headers=auth_header)
    album_data = json.loads(album_response.text)

    album_tracks = [(
        j["artists"][0]['name'],    # artist name
        i['album']['name'],         # album name
        i['album']['label'],        # album production company
        i['album']['uri'],          # Album link
        j['name'],                  # track name
        j['duration_ms'],           # duration
    ) for i in album_data["items"] for j in i["album"]["tracks"]["items"]
    ]

    return album_tracks


def callback(request):
    authorization_header = _user_Authorization(request)

    # Gathering of profile data
    profile_data = get_profile_data(authorization_header)

    # Gathering of playlist data
    playlist_data = get_playlist_data(authorization_header)

    # Gathering of artist, album, track etc from album data
    album_data = get_album_data(authorization_header)

    return render(
        request, "songbank.html",
        {
            'profile_data': profile_data,
            'playlist_data': playlist_data,
            'album_data': album_data
        }
    )
