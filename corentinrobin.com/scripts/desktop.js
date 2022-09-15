// Auteur : Corentin Robin - corentin.robin@gmail.com
// Version : 18 septembre 2019
// Buro : environnement de bureau au sein d'un canvas

// OBJET PRINCIPAL
// ==================================================
var Buro = function(options)
{
    this.initialise(options);
};

// SPECIFICATIONS PAR DEFAUT
// ==================================================

Buro.specifications =
{
    refreshingRate : 5,
    fontFamily : "DidactGothic-Regular",
    backgroundColor : "#404041",

    pointer :
    {
        backgroundColor : "#2186d6",
        eventBackgroundColor : "#ff8900",
        shadowBlur : 15
    },

    text :
    {
        fontSize : 12,
        labelColor : "#fafafa"
    },

    button :
    {
        fontSize : 12,
        padding : 5,
        labelColor : "#fafafa",
        backgroundColor : "#666666"
    },

    checkbox :
    {
        fontSize : 9,
        radius : 10,
        trueBackgroundColor : "#53d769",
        falseBackgroundColor : "#fe3e13",
        trueLabelColor : "#666666",
        falseLabelColor : "#fafafa",
        trueLabel : "ON",
        falseLabel : "OFF"
    },

    note :
    {
        fontSize : 12,
        labelColor : "black",
        backgroundColor : "#fbe365",
        padding : 5
    },

    clock :
    {
        radius : 70,
        color : "#ffffff"
    }
};

// NOYAU
// ==================================================

Buro.prototype.initialise = function(options)
{
    this.canvas = document.querySelector(options.selector);
    this.canvas.style.cursor = "none";
    this.canvasBoundaries = this.canvas.getBoundingClientRect();
    this.context = this.canvas.getContext("2d");

    this.width = document.body.offsetWidth;
    this.height = document.body.offsetHeight;

    this.canvas.width = document.body.offsetWidth;
    this.canvas.height = document.body.offsetHeight;

    // la taille relle a l'ecran peut etre alteree par des CSS par exemple
    this.widthRadio = this.width / this.canvasBoundaries.width;
    this.heightRadio = this.height / this.canvasBoundaries.height;

    this.mouseIsDown = false;
    this.mousePosition = {x : 0, y : 0};
    this.mouseMovement = {dx : 0, dy : 0};

    this.elements = [];
    this.elementUnderMouse = null;

    var thisBuro = this; 

    this.canvas.addEventListener("mousemove", function(event)
    {
        // on tient compte de la position du canvas et du defilement de la page
        thisBuro.mousePosition.x = (event.clientX - window.scrollX - thisBuro.canvasBoundaries.x) * thisBuro.widthRadio;
        thisBuro.mousePosition.y = (event.clientY - window.scrollY - thisBuro.canvasBoundaries.y) * thisBuro.heightRadio;

        // le dernier mouvement effectue
        thisBuro.mouseMovement.dx = event.movementX * thisBuro.widthRadio;
        thisBuro.mouseMovement.dy = event.movementY * thisBuro.heightRadio;

        if(thisBuro.mouseIsDown)
        {
            if(thisBuro.elementUnderMouse != null)
            {
                var element = thisBuro.elementUnderMouse;
                
                if(element.isMovable)
                {
                    element.move(thisBuro.mouseMovement.dx, thisBuro.mouseMovement.dy);
                }
            }
        }

        else
        {
            thisBuro.findElementUnderMouse();
        }

        thisBuro.render();
    });

    // quand on clique
    this.canvas.addEventListener("mousedown", function(event)
    {
        thisBuro.mouseIsDown = true;

        if(thisBuro.elementUnderMouse != null)
        {
            var element = thisBuro.elementUnderMouse;

            if(element.type == "checkbox")
            {
                // fonctionnement bas niveau de la boite a cocher, indispensable et non effacable par l'utilisateur
                element.state = !element.state;
            }

            // l'action est prioritaire sur le deplacement
            if(element.action != undefined)
            {
                // on exectute l'action liee a l'objet
                element.action();
            }
        }

        thisBuro.render();
    });

    // quand on relache
    this.canvas.addEventListener("mouseup", function(event)
    {
        thisBuro.mouseIsDown = false;
    });

    // on fait le rendu 5 fois par seconde
    this.renderingProcess = window.setInterval(function()
    {
        if(thisBuro.render != undefined)
        {
            thisBuro.render();
        }
    }, 1 / Buro.specifications.refreshingRate * 1000);
};

// pour trouver si un element est sous la souris
Buro.prototype.findElementUnderMouse = function()
{
    var i, element, boundaries;

    this.elementUnderMouse = null;

    for(i = this.elements.length - 1; i > -1 && this.elementUnderMouse == null; i--)
    {
        element = this.elements[i];
        boundaries = element.boundaries;

        // des limites rectangulaires suffisent amplement
        if(this.mousePosition.x >= boundaries.x1 && this.mousePosition.x <= boundaries.x2 &&
           this.mousePosition.y >= boundaries.y1 && this.mousePosition.y <= boundaries.y2)
        {
            this.elementUnderMouse = element;
        }
    }
}

// on dessine meme la souris
Buro.prototype.renderPointer = function()
{
    var context = this.context,
        specifications = Buro.specifications;

    context.save();
    context.fillStyle = (this.elementUnderMouse == null ? specifications.pointer.backgroundColor : specifications.pointer.eventBackgroundColor);
    context.strokeStyle = context.fillStyle;

    context.shadowColor = context.fillStyle;
    context.shadowBlur = specifications.pointer.shadowBlur;

    context.beginPath();
    context.moveTo(this.mousePosition.x, this.mousePosition.y);
    context.lineTo(this.mousePosition.x + 20, this.mousePosition.y + 10);
    context.lineTo(this.mousePosition.x + 10, this.mousePosition.y + 20);
    context.closePath();
    context.fill();

    context.restore();
};

Buro.prototype.renderCopyright = function()
{
    // valeurs en dur, pas sensees etre parametrables
    var context = this.context,
        label = "Buro v18.09.19 - by Corentin Robin";

    context.save();
    context.font = "10px " + Buro.specifications.fontFamily;
    var labelWidth = context.measureText(label).width;
    context.fillStyle = "#fafafa";
    context.fillText(label, this.width - labelWidth - 5, this.height - 5);
    context.restore();
};

Buro.prototype.clear = function()
{
    var context = this.context,
        specifications = Buro.specifications;

    context.clearRect(0, 0, this.width, this.height);

    context.save();
    context.fillStyle = specifications.backgroundColor;
    context.fillRect(0, 0, this.width, this.height);

    // valeurs en dur, pas sensees etre parametrables
    context.fillStyle = "grey";
    context.font = "50px " + specifications.fontFamily;
    var label = "Buro",
        labelWidth = context.measureText(label).width;

    context.fillText(label, this.width / 2 - labelWidth / 2, this.height / 2);

    context.restore();
};

Buro.prototype.add = function(element)
{
    this.elements.push(element);
};

Buro.prototype.render = function()
{
    var i, element;

    this.clear();

    for(i = 0; i < this.elements.length; i++)
    {
        var element = this.elements[i];
        element.calculate(this.context);
        element.render(this.context);
    }

    this.renderPointer();
    this.renderCopyright();
};

Buro.prototype.enterFullscreen = function()
{
    // on utilise screenTop et screenY, window.fullscreen n'a pas l'air de fonctionner...
    if(window.screenTop && window.screenY)
    {
        // on sauve les anciennes dimensions
        this.cacheWidth = this.width;
        this.cacheHeight = this.height;

        this.width = screen.width;
        this.height = screen.height;

        this.canvas.width = screen.width;
        this.canvas.height = screen.height;

        // on force ces valeurs, car au passage plein ecran Chrome s'emmele les pinceaux
        this.elementUnderMouse = null;
        this.mouseIsDown = false;

        this.render();

        // https://www.w3schools.com/jsref/met_element_exitfullscreen.asp
        if (this.canvas.requestFullscreen) {
            this.canvas.requestFullscreen();
        } else if (this.canvas.mozRequestFullScreen) { /* Firefox */
            this.canvas.mozRequestFullScreen();
        } else if (this.canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            this.canvas.webkitRequestFullscreen();
        } else if (this.canvas.msRequestFullscreen) { /* IE/Edge */
            this.canvas.msRequestFullscreen();
        }
    }
}

Buro.prototype.exitFullscreen = function()
{
    if(!window.screenTop && !window.screenY)
    {
        document.exitFullscreen();

        // on remet les nouvelles dimensions
        this.width = this.cacheWidth;
        this.height = this.cacheHeight;

        this.canvas.width = this.cacheWidth;
        this.canvas.height = this.cacheHeight;

        this.elementUnderMouse = null;
        this.mouseIsDown = false;

        // https://www.w3schools.com/jsref/met_element_exitfullscreen.asp
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}

// DIFFERENTS ELEMENTS DE L'IHM
// ==================================================

// TEXTE
// --------------------------------------------------
Buro.text = function(options)
{
    this.type = "text";
    this.position = options.position;
    this.label = options.label;
    this.labelColor = options.labelColor || Buro.specifications.text.labelColor;
    this.fontSize = options.fontSize || Buro.specifications.text.fontSize;
};

Buro.text.prototype.calculate = function(context)
{
    this.boundaries =
    {
        x1 : -1e+6,
        y1 : -1e+6,
        x2 : -1e+6,
        y2 : -1e+6
    };
};

Buro.text.prototype.render = function(context)
{
    context.save();
    context.font = this.fontSize + "px " + Buro.specifications.fontFamily;
    context.fillStyle = this.labelColor;
    context.fillText(this.label, this.position.x, this.position.y);
    context.restore();
};

// BOUTON
// --------------------------------------------------
Buro.button = function(options)
{
    this.type = "button";
    this.position = options.position;
    this.label = options.label;
    this.action = options.action;
};

Buro.button.prototype.calculate = function(context)
{
    var specifications = Buro.specifications;

    // on a besoin du contexte pour connaitre la largeur du texte
    context.save();
    context.font = specifications.button.fontSize + "px " + specifications.fontFamily;
    var labelWidth = context.measureText(this.label).width,
        buttonWidth = 2 * specifications.button.padding + labelWidth,
        buttonHeight = 2 * specifications.button.padding + specifications.button.fontSize;

    this.labelWidth = labelWidth;
    this.width = buttonWidth;
    this.height = buttonHeight;
    context.restore();

    this.boundaries =
    {
        x1 : this.position.x,
        y1 : this.position.y,
        x2 : this.position.x + this.width,
        y2 : this.position.y + this.height
    };
};

Buro.button.prototype.render = function(context)
{
    var specifications = Buro.specifications;

    context.save();
    context.font = specifications.button.fontSize + "px " + specifications.fontFamily;
    context.fillStyle = specifications.button.backgroundColor;
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
    context.fillStyle = specifications.button.labelColor;
    context.fillText(this.label, this.position.x + this.width / 2 - this.labelWidth / 2, this.position.y + specifications.button.fontSize + specifications.button.padding / 2);
    context.restore();
};

// BOITE A COCHER
// --------------------------------------------------

Buro.checkbox = function(options)
{
    this.type = "checkbox";
    this.position = options.position;
    this.state = options.state;
    this.action = options.action || undefined;
};

Buro.checkbox.prototype.calculate = function()
{
    var specifications = Buro.specifications;

    this.label = (this.state ? specifications.checkbox.trueLabel : specifications.checkbox.falseLabel);

    this.boundaries =
    {
        x1 : this.position.x - specifications.checkbox.radius,
        y1 : this.position.y - specifications.checkbox.radius,
        x2 : this.position.x + specifications.checkbox.radius,
        y2 : this.position.y + specifications.checkbox.radius
    };
};

Buro.checkbox.prototype.render = function(context)
{
    var specifications = Buro.specifications;

    context.save();
    // fond
    context.fillStyle = (this.state ? specifications.checkbox.trueBackgroundColor : specifications.checkbox.falseBackgroundColor);
    context.beginPath();
    context.arc(this.position.x, this.position.y, specifications.checkbox.radius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();

    // texte
    context.font = specifications.checkbox.fontSize + "px " + specifications.fontFamily;
    var labelWidth = context.measureText(this.label).width;
    context.fillStyle = (this.state ? specifications.checkbox.trueLabelColor : specifications.checkbox.falseLabelColor);
    context.fillText(this.label, this.position.x - labelWidth / 2, this.position.y + 0.3 * specifications.checkbox.fontSize);
    context.restore();
};

// NOTE
// --------------------------------------------------

Buro.note = function(options)
{
    this.type = "note";
    this.position = options.position;
    this.label = options.label;
    this.isMovable = options.isMovable || true;

    this.fontSize = options.fontSize;
};

Buro.note.prototype.calculate = function(context)
{
    var specifications = Buro.specifications;

    this.fontSize = this.fontSize || specifications.note.fontSize;

    context.save();
    context.font = this.fontSize + "px " + specifications.fontFamily;
    this.width = 2 * specifications.note.padding + context.measureText(this.label).width;
    this.height = 2 * specifications.note.padding + this.fontSize; // approximatif
    context.restore();

    this.boundaries =
    {
        x1 : this.position.x,
        y1 : this.position.y,
        x2 : this.position.x + this.width,
        y2 : this.position.y + this.height
    };
};

Buro.note.prototype.move = function(dx, dy)
{
    this.position.x += dx;
    this.position.y += dy;

    this.boundaries.x1 += dx;
    this.boundaries.y1 += dy;
    this.boundaries.x2 += dx;
    this.boundaries.y2 += dy;
};

Buro.note.prototype.render = function(context)
{
    var specifications = Buro.specifications;

    context.save();
    // fond
    context.fillStyle = specifications.note.backgroundColor;
    context.fillRect(this.position.x, this.position.y, this.width, this.height);

    // texte
    context.font = this.fontSize + "px " + specifications.fontFamily;
    context.fillStyle = specifications.note.labelColor;
    context.fillText(this.label, this.position.x + specifications.note.padding, this.position.y + specifications.note.padding + 0.8 * this.fontSize);
    context.restore();
};

// IMAGE
// --------------------------------------------------

Buro.image = function(options)
{
    this.type = "image";
    this.position = options.position;
    this.source = options.source;
    this.isMovable = options.isMovable || true;

    // pas besoin de callback onload ici, etant donne que tout est rafraichi 5 fois par seconde
    this.data = new Image();
    this.data.src = this.source;
};

Buro.image.prototype.calculate = function(context)
{
    this.width = this.data.width;
    this.height = this.data.height;

    this.boundaries =
    {
        x1 : this.position.x,
        y1 : this.position.y,
        x2 : this.position.x + this.width,
        y2 : this.position.y + this.height
    };
};

Buro.image.prototype.move = function(dx, dy)
{
    this.position.x += dx;
    this.position.y += dy;

    this.boundaries.x1 += dx;
    this.boundaries.y1 += dy;
    this.boundaries.x2 += dx;
    this.boundaries.y2 += dy;
};

Buro.image.prototype.render = function(context)
{
    context.save();
    context.drawImage(this.data, this.position.x, this.position.y);
    context.restore();
};

// HORLOGE
// --------------------------------------------------

Buro.clock = function(options)
{
    this.type = "clock";
    this.position = options.position;
    this.radius = options.radius || Buro.specifications.clock.radius;
    this.color = options.color || Buro.specifications.clock.color;
    this.isMovable = options.isMovable || true;
};

Buro.clock.prototype.calculate = function()
{
    this.value = new Date();

    this.boundaries =
    {
        x1 : this.position.x - this.radius,
        y1 : this.position.y - this.radius,
        x2 : this.position.x + this.radius,
        y2 : this.position.y + this.radius
    };
};

Buro.clock.prototype.move = function(dx, dy)
{
    this.position.x += dx;
    this.position.y += dy;

    this.boundaries.x1 += dx;
    this.boundaries.y1 += dy;
    this.boundaries.x2 += dx;
    this.boundaries.y2 += dy;
};

Buro.clock.prototype.render = function(context)
{
    var H = this.value.getHours(), M = this.value.getMinutes(), S = this.value.getSeconds();

    var secondHandLength = this.radius * 0.9,
        minuteHandLength = this.radius * 0.7,
        hourHandLength = this.radius * 0.4;

    context.save();
    context.strokeStyle = this.color;
    context.fillStyle = this.color;

    context.lineWidth = 1;

    // contour
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.closePath();
    context.stroke();

    context.shadowBlur = 0;

    // secondes
    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(this.position.x + secondHandLength * Math.cos(S / 60 * (2 * Math.PI) - Math.PI / 2),
                   this.position.y + secondHandLength * Math.sin(S / 60 * (2 * Math.PI) - Math.PI / 2));
    context.closePath();
    context.stroke();

    // minutes
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(this.position.x + minuteHandLength * Math.cos(M / 60 * (2 * Math.PI) - Math.PI / 2),
                   this.position.y + minuteHandLength * Math.sin(M / 60 * (2 * Math.PI) - Math.PI / 2));
    context.closePath();
    context.stroke();

    // heures
    context.lineWidth = 3;

    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(this.position.x + hourHandLength * Math.cos(H % 12 / 12 * (2 * Math.PI) - Math.PI / 2),
                   this.position.y + hourHandLength * Math.sin(H % 12 / 12 * (2 * Math.PI) - Math.PI / 2));
    context.closePath();
    context.stroke();

    // point central
    context.beginPath();
    context.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI);
    context.closePath();
    context.fill();

    context.restore();
};