from django.shortcuts import render, redirect
from django.urls import reverse
# from django.http import JsonResponse
import json
import base64
import requests
import mysite.spotify_settings as spotify
# Create your views here.


def _app_Authorization(request, relative_redirect):
    """Redirect to spotify auth backend with Client ID to authorize application"""
    # Get "http://127.0.0.1:8000
    client_side_url_port = f"http://{requests.Request('GET', request.get_host()).prepare().url}"
    # Server-side Parameters
    redirect_uri = f"{client_side_url_port}/{relative_redirect}"
    auth_query_parameters = {
        "response_type": spotify.RESPONSE_TYPE,
        "redirect_uri": redirect_uri,
        "scope": spotify.SCOPE,
        "state": spotify.STATE,
        "show_dialog": spotify.SHOW_DIALOG_str,
        "client_id": spotify.CLIENT_ID
    }

    url_args = requests.get(spotify.SPOTIFY_AUTH_URL, params=auth_query_parameters).url

    return redirect(url_args)


def _api_Authorization(request, relative_redirect):
    """Generate headers for Spotify Web API with access token"""
    # Get code from the spotify response of _app_Authorization method
    code = request.GET['code']
    # Get "http://127.0.0.1:8000
    client_side_url_port = f"http://{requests.Request('GET', request.get_host()).prepare().url}"
    # Server-side Parameters
    redirect_uri = f"{client_side_url_port}/{relative_redirect}"
    # Build form_options and base64encoded params and finally headers that Spotify requires
    form_options = {
        "code": str(code),
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }
    base64encoded = base64.b64encode(
        bytes(f"{spotify.CLIENT_ID}:{spotify.CLIENT_SECRET}", encoding='utf-8')
    )
    headers = {"Authorization": f"Basic {base64encoded.decode('utf-8')}"}
    # Make a post request to "https://accounts.spotify.com/api/token" get required access tokens.
    post_request = requests.post(spotify.SPOTIFY_TOKEN_URL, data=form_options, headers=headers)
    # Tokens are Returned to Application as response from above request
    response_data = json.loads(post_request.text)
    access_token = response_data["access_token"]
    refresh_token = response_data["refresh_token"]
    token_type = response_data["token_type"]
    expires_in = response_data["expires_in"]
    # Use the access token to create auth_headers which is necessary to access Spotify API
    authorization_header = {"Authorization": f"Bearer {access_token}"}
    # Bundle all response data in python dict to utilize in different requests.
    api_authorization_tokens = {
        'response_data': response_data,
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': token_type,
        'expires_in': expires_in,
        'authorization_header': authorization_header
    }
    return api_authorization_tokens


# Spotify API wrappers for API calls in the backend, may have the same in the frontend react app.
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


def home(request):
    return render(request, 'home.html', {})


def react(request):
    return render(request, 'view1.html', {})


def react_auth(request):
    react_auth = _app_Authorization(request, relative_redirect='react/callback/')
    return react_auth


def react_callback(request):
    """
    Get Spotify access_token by executing _app_authorization and _api_Authorization views
    respectively and pass required token to the home view as query strings to be used with react
    frontend.
    """
    authorization_tokens = _api_Authorization(request, relative_redirect='react/callback/')
    access_token = authorization_tokens['access_token']
    refresh_token = authorization_tokens['refresh_token']

    # Get "http://127.0.0.1:8000/ and reverse returns 'react/' in this case
    redirect_url = f"http://{request.get_host()}{reverse('playlists:react')}"
    query_params = {'access_token': access_token, 'refresh_token': refresh_token}

    # http://docs.python-requests.org/en/latest/user/advanced/#prepared-requests
    prepped_request = requests.Request('GET', redirect_url, params=query_params).prepare()

    return redirect(prepped_request.url)


def songbank_auth(request):
    songbank_auth = _app_Authorization(request, relative_redirect='songbank/callback/')
    return songbank_auth


def songbank_callback(request):
    authorization_header = _api_Authorization(
        request, relative_redirect='songbank/callback/')['authorization_header']
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
