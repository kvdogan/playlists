from django.shortcuts import render, HttpResponse
import json
# Create your views here.


def home(request):
    return HttpResponse("""
        <div style='background: pink'>
            <h2 >Merhaba Dunya</h2>
            <h3>Merhaba sana</h3>
        </div>
    """)


def view1(request):
    fakeServerData = '''
        {
        "user": {
            "name": "Dogan",
            "playlists": [
                {
                    "name": "My favorites",
                    "songs": [
                        {
                            "name": "Beat It",
                            "duration": 240000
                        },
                        {
                            "name": "Cannelloni Makaroni",
                            "duration": 280000
                        },
                        {
                            "name": "Rosa helikopter",
                            "duration": 300000
                        }
                    ]
                },
                {
                    "name": "Discover Weekly",
                    "songs": [
                        {
                            "name": "Beat It",
                            "duration": 240000
                        },
                        {
                            "name": "Cannelloni Makaroni",
                            "duration": 240000
                        },
                        {
                            "name": "Rosa helikopter",
                            "duration": 240000
                        }
                    ]
                },
                {
                    "name": "Bana Ozel",
                    "songs": [
                        {
                            "name": "Naz Bari",
                            "duration": 320000
                        },
                        {
                            "name": "Azeri Oyun Havasi",
                            "duration": 300000
                        },
                        {
                            "name": "Acil Ey Omrumun Vari",
                            "duration": 360000
                        },
                        {
                            "name": "Yakalarsam",
                            "duration": 360000
                        }
                    ]
                },
                {
                    "name": "Another playlist - the best!",
                    "songs": [
                        {
                            "name": "Beat It",
                            "duration": 240000
                        },
                        {
                            "name": "Cannelloni Makaroni",
                            "duration": 240000
                        },
                        {
                            "name": "Rosa helikopter",
                            "duration": 240000
                        }
                    ]
                },
                {
                    "name": "MyPlaylist",
                    "songs": [
                        {
                            "name": "Beat It",
                            "duration": 240000
                        },
                        {
                            "name": "Cannelloni Makaroni",
                            "duration": 240000
                        },
                        {
                            "name": "Rosa helikopter",
                            "duration": 240000
                        }
                    ]
                }
            ]
        }
    }
    '''
    fakeServerData = json.loads(fakeServerData)
    print(fakeServerData['user'])
    return render(request, 'view1.html', {"fakeServerData": fakeServerData})


def view2(request):
    return render(request, 'view2.html')
