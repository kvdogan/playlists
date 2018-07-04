from django.shortcuts import render, HttpResponse

# Create your views here.


def home(request):
    return HttpResponse("""
        <div style='background: pink'>
            <h2 >Merhaba Dunya</h2>
            <h3>Merhaba sana</h3>
        </div>
    """)


def view1(request):
    return render(request, 'view1.html')


def view2(request):
    return render(request, 'view2.html')
