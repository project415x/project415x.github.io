from django.shortcuts import render, get_object_or_404, render_to_response
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import loader
from django.core.urlresolvers import reverse
from django.conf import settings
import os

def index(request):
    return render(request, 'p415x/index.html')

def guide(request, index):
	data = "Sorry, under construction!"
	try:
		filepath = os.path.join(settings.BASE_DIR, "static/guide/level"+index+".md")
		guidepage = open(filepath, "r")
		data = guidepage.read()
		guidepage.close()
	except:
		pass
	return HttpResponse(data)
