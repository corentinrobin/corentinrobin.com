// Auteur : Corentin Robin
// Version : 30 avril
// frmwrk utilise comme espace de nom l'objet window
// Pour le lexique et la langue, frmwrk utilise $language et $lexicon

var frmwrk =
{
    clickTarget : null,
    activeElement : null,

    contentMethod : function(object)
    {
        var tagName = object.tagName.toLowerCase();

        if(object.getAttribute("type") != null)
        {
            if(object.getAttribute("type").toLowerCase() == "checkbox") return "checked";
            else return "value";
        }

        else if(tagName == "textarea" || tagName == "select" || tagName == "input") return "value";
        else return "innerHTML";
    },

    render : function()
    {
        // rendu des variables
        var variables = document.querySelectorAll("[_variable]");

        frmwrk.activeElement = document.activeElement;

        if(frmwrk.clickTarget)
        {
            if(frmwrk.clickTarget.hasAttribute("type"))
            {
                if(frmwrk.clickTarget.getAttribute("type").toLowerCase() == "checkbox") frmwrk.activeElement = frmwrk.clickTarget;
            }
        }

        variables.forEach(function(object)
        {
            var content = window[object.getAttribute("_variable")],
            contentMethod = frmwrk.contentMethod(object),
                objectContent = object[contentMethod],
                hasSameContent = objectContent == content,
                isActiveElement = object == frmwrk.activeElement;

            if(!hasSameContent && !isActiveElement) object[contentMethod] = content;

            else if(!hasSameContent && isActiveElement)
            {
                if(contentMethod == "checked") window[object.getAttribute("_variable")] = !objectContent;
                else window[object.getAttribute("_variable")] = objectContent;
            }
        });

        // rendu des objets
        var objects = document.querySelectorAll("[_object]");

        objects.forEach(function(object)
        {
            var content = window[object.getAttribute("_object")].render();

            if(object[frmwrk.contentMethod(object)] != content) object[frmwrk.contentMethod(object)] = content;
        });

        // rendu du texte
        var objects = document.querySelectorAll("[_lexicon]");

        objects.forEach(function(object)
        {
            var content = window["_lexicon"][window["_language"]][object.getAttribute("_lexicon")];

            if(object[frmwrk.contentMethod(object)] != content) object[frmwrk.contentMethod(object)] = content;
        });

        requestAnimationFrame(frmwrk.render);
    }
}

window.addEventListener("load", frmwrk.render);

window.addEventListener("mouseup", function()
{
    frmwrk.clickTarget = null;
});

window.addEventListener("mousedown", function(event)
{
    frmwrk.clickTarget = event.target;
});