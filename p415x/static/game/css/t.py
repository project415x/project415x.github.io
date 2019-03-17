from os import system

files = ['404', 'base', 'fonts', 'foot', 'home', 'layout', 'normalize', 'project', 'start', 'syntax-highlighting', 'typebase']

for f in files:
	filename = '_' + f + '.scss'
	url = 'https://raw.githubusercontent.com/project415x/project415x.github.io/master/_sass/' + filename
	command = 'wget -O ' + filename + ' ' + url
	system(command)

