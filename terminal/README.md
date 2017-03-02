Welcome, from the /wg/ sticky. To add a function to the terminal, it's probably best to put it in bin.js because term.js is where all the terminal-handling code and the most basic functions are. It's also pretty gross.

If you do add a function, you also have to put its name in the hookCommands list. A few of them are weird and should be in term.js (like reddit and 4chan) because they intercept the text entry earlier, and those commands just print their usage.

Why put them in the list, you ask? Autocompletion and function calling from a string without using `eval()`. I could have made each function its own object with a name and everything, but the original version of this terminal was made in a day for a coding challenge, and I haven't gotten around to fixing it yet.

###muh scalability
**If you can, please get your own OpenWeatherMap API key and put it in `weather()`.**
The free OpenWeatherMap plan is limited to 60 API calls per minute for each key. This page won't send a new request if the current cached weather data is less than 20 minutes old, but if more people start using this startpage eventually the number of requests will become a problem.
