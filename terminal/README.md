Welcome, from the /wg/ sticky. Or just startpages.github.io.

To add your own function to the terminal, put it in `bin.js`. Specifically, put its name in terminalFunctions, and then make your definition follow the form of the rest of the functions. 

To define your own bookmarks, `edit .bookmarks`. A sample file would look like:
```
google https://www.google.com/
el_feis https://www.facebook.com/
```

You can also define your own high-level color scheme in `.config`, as well as edit your `userName` and `userMachine`. Run `terminal` in your browser's dev console to see the properties you can override.

If you want to be a real nerd, put some ASCII art in `.art` and it will be displayed with `screenfetch` instead of the default.

**weather** probably won't work unless you:
* have an OpenWeatherMap API key (they're free and easy to get)
* have location services enabled
* are running the page locally, because OpenWeatherMap uses http while GitHub uses https, and the two go together like things that don't go well together
