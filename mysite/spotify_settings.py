# SPOTIFY AUTHORIZATION SETTINGS
# Client Keys
CLIENT_ID = "78e16189786b45e4a92eb251b13c5ce6"
CLIENT_SECRET = "d0d967c081864263934bc29867d8caa1"

# Spotify URLS
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com"
API_VERSION = "v1"
SPOTIFY_API_URL = "{}/{}".format(SPOTIFY_API_BASE_URL, API_VERSION)

# Server-side Parameters
RESPONSE_TYPE = "code"
STATE = ""
SCOPE = "user-library-read playlist-read-collaborative user-read-email user-read-private user-read-birthdate"

SHOW_DIALOG_bool = True
SHOW_DIALOG_str = str(SHOW_DIALOG_bool).lower()
