// Auteur : Corentin ROBIN
// Version : 12 septembre 2020
// Mini-librairie pour créer des applications temps-réel avec mise à jour automatique de l'interface

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
    toAvoid : ["selva-application", "selva-is-evented"],
    render : function()
    {
        var elements = document.body.querySelectorAll("*");

        elements.forEach(function(element)
        {
            var attributes = element.attributes;

            if((element.tagName == "INPUT" || element.tagName == "TEXTAREA" || element.tagName == "SELECT") && element.hasAttribute("selva-value"))
            {
                var selvaValue = element.getAttribute("selva-value");

                // si l'attribut value contient exactement {variable}, on lie l'input à la valeur JavaScript
                if(selvaValue[0] == "{" && selvaValue[selvaValue.length - 1] == "}")
                {
                    if(!element.hasAttribute("selva-is-evented"))
                    {
                        element.addEventListener("input", function(event)
                        {
                            var target = event.target,
                                selvaValue = target.getAttribute("selva-value");

                            var variableName = selvaValue.substring(1, selvaValue.length - 1);

                            window[variableName] = this._getContent();
                        });

                        element.setAttribute("selva-is-evented", "true");
                    }
                }
            }
            
            for(i = 0; i < attributes.length; i++)
            {
                attribute = attributes[i];

                if(attribute.name.indexOf("selva-") != -1 && Selva.toAvoid.indexOf(attribute.name) == -1)
                {
                    targetAttribute = attribute.name.split(/-/g)[1];
                    newAttributeValue = attribute.value.replace(/\{(.*?)\}/g,
                        function(string, match)
                        {
                            var result;

                            try
                            {
                                result = eval(match);
                            }

                            catch(error)
                            {
                                result = undefined;
                            }

                            return result;
                        });

                    if(attribute.name == "selva-value")
                    {
                        // on converti la chaîne en booléen pour les boîtes à cocher
                        if(element.type && element.type == "checkbox") newAttributeValue = newAttributeValue == "true";

                        // si le contenu est différent, on change la valeur
                        if(element._getContent() != newAttributeValue) element._setContent(newAttributeValue);
                    }

                    else
                    {
                        if(element.getAttribute(targetAttribute) != newAttributeValue) element.setAttribute(targetAttribute, newAttributeValue);
                    }
                }
            }
        });

        requestAnimationFrame(Selva.render);
    }
};

window.addEventListener("load", Selva.render);