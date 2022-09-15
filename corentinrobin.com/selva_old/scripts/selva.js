// Auteur : Corentin ROBIN
// Version : 10 septembre 2020
// Mini-librairie pour créer des applications temps-réel avec mise à jour automatique de l'interface

// Fonctionnement : on a un processus permanent qui vérifie que les objects du DOM ou leurs variables attachées sont à jour
// oninput paraît prioritaire sur le script client ; la variable de l'élément sera donc changée avant la fonction de rendu, ce qui évite les conflits

// on étend le prototype des objets HTML pour faciliter la gestion du contenu
HTMLElement.prototype._contentType = function()
{
    if(this.tagName == "INPUT" || this.tagName == "TEXTAREA" || this.tagName == "SELECT")
    {
        if(this.type && (this.type == "checkbox" || this.type == "radio")) return "checked";
        else if(this.type && this.type == "file") return "files";
        else return "value";
    }

    else if(this.tagName == "IFRAME" || this.tagName == "IMG" || this.tagName == "SCRIPT") return "src";

    else if(this.tagName == "LINK" || this.tagName == "A") return "href";

    else return "innerHTML";
}

HTMLElement.prototype._setContent = function(content)
{
    this[this._contentType()] = content;
}

HTMLElement.prototype._getContent = function()
{
    // seule exception : le bouton radio ; pour cocher un bouton radio, on utilise checked ; pour récupérer sa valeur, on utilise value
    if(this.type && this.type == "radio") return this.value;
    else return this[this._contentType()];
}

var Selva =
{
    attribute : "data-value",
    fastRendering : true,

    render : function()
    {
        document.querySelectorAll("input[" + Selva.attribute + "][type=radio]").forEach(function(e){e.checked = false});

        var objects = document.querySelectorAll("[" + Selva.attribute + "]"), object, variable, i;

        for(i = 0; i < objects.length; i++)
        {
            object = objects[i];
            variableName = object.getAttribute(Selva.attribute);

            // on met un listener sur chaque élément attaché à une variable
            if((object.tagName == "INPUT" || object.tagName == "TEXTAREA" || object.tagName == "SELECT") && object.getAttribute("data-has-listener") != "true")
            {
                object.addEventListener("input", function(event) { window[event.target.getAttribute("data-value")] = event.target._getContent() });
                object.setAttribute("data-has-listener", "true");
            }

            try
            {
                variable = eval(variableName);
            }

            catch(error)
            {
                // si l'évaluation échoue, on met le message d'erreur comme valeur
                variable = error;
            }

            // si la variable est un tableau et qu'elle contient des objets avec une méthode de rendu, on fait le rendu de toute la liste
            if(variable.constructor.name == "Array")
            {
                if(variable.length > 0)
                {
                    if(typeof variable[0].toDOM != "undefined")
                    {
                        var sourceCode = "", j;

                        for(j = 0; j < variable.length; j++) sourceCode += variable[j].toDOM();

                        if(object.innerHTML != sourceCode) object.innerHTML = sourceCode;
                    }
                }

                else
                {
                    object.innerHTML = "";
                }
            }

            else
            {
                if(typeof variable.toDOM !== "undefined")
                {
                    var sourceCode = variable.toDOM();

                    if(object.innerHTML != sourceCode) object.innerHTML = sourceCode;
                }

                else
                {
                    // gestion spécifique pour les boutons radio : ne pas confondre checked et value
                    if(object.type && object.type == "radio")
                    {
                        if(object.value == variable) object.checked = true;
                        else object.checked = false;
                    }
                    
                    else if(object.type != "file" && object._getContent() !== variable) object._setContent(variable);
                }
            }

        }

        // styles en ligne

        var objects = document.querySelectorAll("[data-style]"), object, style, i;

        for(i = 0; i < objects.length; i++)
        {
            object = objects[i];
            style = object.getAttribute("data-style");

            style = style.replace(/\$\{(.*?)\}/g, function(string, match) { return window[match] } );

            if(object.style != style) object.style = style;
        }

        // classes

        var objects = document.querySelectorAll("[data-class]"), object, _className, i;

        for(i = 0; i < objects.length; i++)
        {
            object = objects[i];
            _className = object.getAttribute("data-class");

            if(object.getAttribute("class") != _className) object.setAttribute("class", window[_className]);
        }

       if(Selva.fastRendering) window.requestAnimationFrame(Selva.render);
       else window.setTimeout(Selva.render, 500);
    },

    initialise : function()
    {
        Selva.render();
    }
};

window.addEventListener("load", Selva.initialise);