// Auteur : Corentin ROBIN
// Version : 27 novembre 2019

// quelques methodes en plus pour aider
Number.prototype.withLeadingZero = function()
{
    if(this < 10) return "0" + String(this);
    else return String(this);
}

// rgb(23, 355, 21) vers #XXXXXX
String.prototype.toHexadecimalColor = function()
{
    var components = this.match(/[0-9]+/g),
        r = Number(components[0]).toString(16),
        g = Number(components[1]).toString(16),
        b = Number(components[2]).toString(16);

    return "#" + (r.length == 1 ? "0" : "") + r + (g.length == 1 ? "0" : "") + g + (b.length == 1 ? "0" : "") + b + "";
}

HTMLElement.prototype.fillingMethod = function(content)
{
    var name = this.tagName;

    if(name == "INPUT" || name == "SELECT" || name == "TEXTAREA") return "value";
    else return "innerHTML";
}

HTMLElement.prototype.getContent = function()
{
    return this[this.fillingMethod()];
}

HTMLElement.prototype.setContent = function(content)
{
    this[this.fillingMethod()] = content;
}

// fonctions de la calculatrice
var Calculator =
{
    defaultText : "No result.",

    write : function(button)
    {
        var calculator = button.parentElement.parentElement.parentElement;

        calculator.querySelector(".expression").value += button.innerHTML;
    },

    calculate : function(button)
    {
        var calculator = button.parentElement.parentElement;

        calculator.querySelector("div.result").innerHTML = calculator.querySelector(".expression").value + " = <b>" + eval(calculator.querySelector(".expression").value) + "</b>";
    },

    clear : function(button)
    {
        var calculator = button.parentElement.parentElement;

        calculator.querySelector(".expression").value = "";
        calculator.querySelector("div.result").innerHTML = Calculator.defaultText;
    }
}

var Index =
{
    timeTravelLabel : "Travel to July 1969",

    vintageModeIsActive : false,
    mouseIsDown : false,
    lastObjectPosition : {x : 300, y : 100},
    objectMoving : undefined,
    menuTarget : undefined,

    randomInteger : function(a, b)
    {
        return Math.round(Math.random() * (b - a) + a);
    },

    generateComponents : function()
    {
        // on genere les trieurs
        var binders = document.querySelectorAll("binder"), i;

        for(i = 0; i < binders.length; i++)
        {
            binder = binders[i];
            tabs = binder.getAttribute("sections").split(/,/g);
            tabsHTML = ``;

            tabs.forEach(function(e){tabsHTML += `<span>${ e }</span>`});

            var element = document.createElement("div");
            element.classList.add("binder");
            var innerHTML = `<div>${ tabsHTML }</div><div></div><b class="title">${ binder.getAttribute("title") }</b><img class="fullscreen-button" src="/images/resize.svg" onclick="Index.resizeBinder(this)">`;
            element.innerHTML = innerHTML;
            element.querySelector("div:first-child > span:first-child").classList.add("selected");
            element.querySelectorAll("div:first-child > span").forEach(function(e){e.addEventListener("click", function() { Index.selectTab(this) })});

            document.body.replaceChild(element, binder);

            Index.makeObjectMovable({handle : element.querySelector(":scope > div:first-child"), target : element, initialPosition : {x : Number(binder.getAttribute("left")), y : Number(binder.getAttribute("top"))}});

            Index.selectTab(element.querySelector("div:first-child > span:first-child"));
        }

        // on genere les horloges
        var clocks = document.querySelectorAll("clock");

        for(i = 0; i < clocks.length; i++)
        {
            clock = clocks[i];

            var element = document.createElement("div");
            element.classList.add("clock");
            var innerHTML = `<div class="time"></div><div class="date"></div>`;
            element.innerHTML = innerHTML;

            document.body.replaceChild(element, clock);

            Index.makeObjectMovable({handle : element, initialPosition : {x : 632, y : 16}});
        }

        // on genere les calculatrices
        var calculators = document.querySelectorAll("calculator");

        for(i = 0; i < calculators.length; i++)
        {
            calculator = calculators[i];

            var element = document.createElement("div");
            element.classList.add("calculator");
            var innerHTML =
            `<div class="result">${ Calculator.defaultText }</div>

            <input type="text" class="expression">
    
            <div class="keys">
                <div><span>1</span><span>2</span><span>3</span><span>+</span></div>
                <div><span>4</span><span>5</span><span>6</span><span>-</span></div>
                <div><span>7</span><span>8</span><span>9</span><span>*</span></div>
                <div><span>0</span><span>(</span><span>)</span><span>/</span></div>
            </div>
    
            <div class="controls"><span onclick="Calculator.calculate(this)">Calculate</span><span onclick="Calculator.clear(this)">Clear</span></div>`;

            element.innerHTML = innerHTML;

            // on attribut un listener a chacun des touches du clavier
            element.querySelectorAll("div.keys span").forEach(function(button) { button.addEventListener("click", function() { Calculator.write(this) } ) } );

            document.body.replaceChild(element, calculator);

            Index.makeObjectMovable({handle : element.querySelector("div.result"), target : element, initialPosition : {x : 1200, y : 130}});
        }

        // on genere les albums
        var albums = document.querySelectorAll("album");

        for(i = 0; i < albums.length; i++)
        {
            album = albums[i];

            var element = document.createElement("div");
            element.classList.add("album");
            var innerHTML =
            `<div style="background-image : url(/images/${ album.getAttribute("image") }"></div>
             <iframe src="https://www.youtube.com/embed/videoseries?list=${ album.getAttribute("playlist") }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

            element.innerHTML = innerHTML;

            element.addEventListener("click", function()
            {
                element.querySelector("iframe").classList.toggle("visible");
            });

            document.body.replaceChild(element, album);

            Index.makeObjectMovable({handle : element, initialPosition : {x : 740, y : 180}});
        }
    },

    initialise : function()
    {
        // on genere tous les composants
        Index.generateComponents();

        // evenements souris
        window.addEventListener("mousedown", function() { Index.mouseIsDown = true });
        window.addEventListener("mousemove", Index.moveElement);
        window.addEventListener("mouseup", function() { Index.mouseIsDown = false ; if(Index.objectMoving != undefined) { Index.objectMoving.style.zIndex = ""; Index.objectMoving.style.boxShadow = "rgb(121, 121, 121) 0px 0px 3px 1px" } ; Index.objectMoving = undefined ; document.body.classList.remove("frozen") });

        window.addEventListener("contextmenu", Index.showContextMenu);
        window.addEventListener("mousedown", Index.hideContextMenu);

        // on met a jour l'interface 10 fois par seconde
        window.setInterval(Index.refreshInterface, 100);

        // le titre et le menu sont deplacables aussi
        Index.makeObjectMovable({handle : document.querySelector("header"), initialPosition : {x : 37, y : 43}});

        var menu = document.querySelector("div.menu");
        Index.makeObjectMovable({handle : menu.querySelector("div.title"), target : menu, initialPosition : {x : 0, y : 0}});

        Index.makeObjectMovable({handle : document.querySelector("div.note"), initialPosition : {x : 1420, y : 502}});

        var card = document.querySelector('.card');
        card.addEventListener( 'click', function() {
            card.classList.toggle('is-flipped');
        });
    },

    refreshLabels : function()
    {
        var labels = document.querySelectorAll("[data-label]"), i;

        for(i = 0; i < labels.length; i++)
        {
            label = labels[i];

            if(label.innerHTML != Index[label.getAttribute("data-label")])
                label.innerHTML = Index[label.getAttribute("data-label")];
        }
    },

    refreshClocks : function()
    {
        var clocks = document.querySelectorAll("div.clock"), clock, i;
        var today = new Date();

        if(Index.vintageModeIsActive)
        {
            // 21 juillet 1969
            today.setHours(14) ; today.setMinutes(30) ;
            today.setDate(21) ; today.setMonth(6) ; today.setFullYear(1969)
        }

        var hours = today.getHours(), minutes = today.getMinutes(), seconds = today.getSeconds(),
            date = today.getDate(), month = (today.getMonth() + 1), year = today.getFullYear();

        for(i = 0; i < clocks.length; i++)
        {
            clock = clocks[i];

            clock.querySelector("div.time").innerHTML = hours.withLeadingZero() + ":" + minutes.withLeadingZero() + ":" + seconds.withLeadingZero();
            clock.querySelector("div.date").innerHTML = date.withLeadingZero() + "/" + month.withLeadingZero() + "/" + year;
        }
    },

    refreshInterface : function()
    {
        Index.refreshLabels();
        Index.refreshClocks();

        // ici les balises seront remplacees par des div, donc au prochain rafraichissement les composants deja construits ne seront pas re-selectionnes
        Index.generateComponents();
    },

    loadFile : function(tab)
    {
        var request = new XMLHttpRequest();

        request.onload = function()
        {
            var target = tab.parentElement.nextElementSibling;
            target.innerHTML = request.responseText;
        }

        request.open("GET", "/pages/" + tab.innerHTML.toLowerCase() + ".php", true);
        request.send();
    },

    selectTab : function(tab)
    {
        tab.parentElement.querySelectorAll("span").forEach(function(e){e.classList.remove("selected")});
        tab.classList.add("selected");
        Index.loadFile(tab);
    },

    resizeBinder : function(button)
    {
        button.parentElement.classList.toggle("fullscreen");
    },

    moveElement : function(event)
    {
        if(Index.mouseIsDown && Index.objectMoving != undefined)
        {
            document.body.classList.add("frozen");

            Index.objectMoving.style.zIndex = "1000";

            var px = Number(Index.objectMoving.style.left.replace("px", "")),
                py = Number(Index.objectMoving.style.top.replace("px", ""));

            // on ajoute tout simplement le deplacement de la souris a la position de l'element !
            Index.objectMoving.style.left = (px + event.movementX) + "px";
            Index.objectMoving.style.top = (py + event.movementY) + "px";

            Index.objectMoving.style.boxShadow = "rgb(121, 121, 121) 0px 0px 5px 3px";
        }
    },

    showContextMenu : function(event)
    {
        event.preventDefault();

        var menu = document.querySelector("div.menu"),
            target = event.target, style = getComputedStyle(target);

        Index.menuTarget = target;

        menu.querySelector("div.title").innerHTML = "Menu for this <b>" + target.tagName.toLowerCase() + "</b>";

        if(target.tagName == "BODY")
        {
            menu.querySelector("#element-content").setAttribute("readonly", "true");
            menu.querySelector("#element-content").style.opacity = "0.6";
        }

        else
        {
            menu.querySelector("#element-content").removeAttribute("readonly");
            menu.querySelector("#element-content").style.opacity = "1";
        }

        menu.querySelector("#element-content").value = target.getContent();
        menu.querySelector("#element-font-size").value = Number(style.fontSize.replace(/[a-z]*/g, ""));
        menu.querySelector("#element-color").value = style.color.toHexadecimalColor();
        menu.querySelector("#element-background-color").value = style.backgroundColor.toHexadecimalColor();

        menu.style.left = event.clientX + "px";
        menu.style.top = event.clientY + "px";
        menu.classList.add("visible");
    },

    hideContextMenu : function(event)
    {
        var menu = document.querySelector("div.menu");
    
        if(event.target != menu && !menu.contains(event.target))
        {
            menu.classList.remove("visible");
            Index.menuTarget = undefined;
        }
    },

    updateElement : function()
    {
        var menu = document.querySelector("div.menu");

        if(Index.menuTarget.tagName != "BODY") Index.menuTarget.setContent(menu.querySelector("#element-content").value);
        Index.menuTarget.style.fontSize = menu.querySelector("#element-font-size").value + "px";
        Index.menuTarget.style.color = menu.querySelector("#element-color").value;
        Index.menuTarget.style.backgroundColor = menu.querySelector("#element-background-color").value;
    },

    showDialog : function(options)
    {
        document.querySelector("div.overlay").classList.add("visible");
        document.querySelector("div.overlay div.title").innerHTML = options.title;
        document.querySelector("div.overlay div.body").innerHTML = options.body;
    },

    hideDialog : function()
    {
        document.querySelector("div.overlay").classList.remove("visible");
    },

    showAbout : function()
    {
        Index.showDialog({title : "About me", body : "<dib>I'm Corentin, I'm French.</div><div>I wanted to show on this website a glimpse of what can be achieved with HTML5, CSS3 and JS."});
    },

    makeObjectMovable : function(options)
    {
        var handle = options.handle,
            target = options.target ? options.target : options.handle,
            initialPosition = options.initialPosition;

        handle.style.cursor = "move";
        target.style.position = "absolute";
        target.style.boxShadow = "rgb(121, 121, 121) 0px 0px 3px 1px";

        if(initialPosition != undefined)
        {
            target.style.left = initialPosition.x + "px";
            target.style.top = initialPosition.y + "px";
        }

        else
        {
            Index.lastObjectPosition.x += 70;
            Index.lastObjectPosition.y += 70;

            target.style.left = Index.lastObjectPosition.x + "px";
            target.style.top = Index.lastObjectPosition.y + "px";
        }

        handle.addEventListener("mousedown", function() { Index.objectMoving = target; });
    },

    // https://stackoverflow.com/questions/36672561/how-to-exit-fullscreen-onclick-using-javascript
    goFullScreen : function()
    {
        var isInFullScreen = 
            (document.fullscreenElement && document.fullscreenElement !== null) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
            (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
            (document.msFullscreenElement && document.msFullscreenElement !== null);
    
        var element = document.documentElement;

        if(!isInFullScreen)
        {
            if(element.requestFullscreen) element.requestFullscreen();
            else if(element.mozRequestFullScreen) element.mozRequestFullScreen();
            else if(element.webkitRequestFullScreen) element.webkitRequestFullScreen();
            else if(element.msRequestFullscreen) element.msRequestFullscreen();
        }
        
        else
        {
            if(document.exitFullscreen) document.exitFullscreen();
            else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if(document.mozCancelFullScreen) document.mozCancelFullScreen();
            else if(document.msExitFullscreen) document.msExitFullscreen();
        }
    },

    toggleVintageMode : function()
    {
        Index.vintageModeIsActive = !Index.vintageModeIsActive;
        document.body.classList.toggle("vintage");
        Index.timeTravelLabel = Index.vintageModeIsActive ? "Back to " + new Date().getFullYear() : "Travel to July 1969";

        document.querySelector("img.newspaper").style.opacity = Index.vintageModeIsActive ? "1" : "0";
        document.querySelector("div.note").style.transition = "opacity 500ms";
        document.querySelector("div.note").style.opacity = Index.vintageModeIsActive ? "0" : "1";
        document.querySelector("div.note").style.visibility = Index.vintageModeIsActive ? "hidden" : "visible";
    }
};

window.addEventListener("load", Index.initialise);