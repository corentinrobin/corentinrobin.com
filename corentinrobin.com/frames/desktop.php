<canvas style="width : 100% ; height : 100%"></canvas>

<style>
@font-face
{
    font-family : DidactGothic-Regular;
    src : url(/fonts/DidactGothic-Regular.ttf);
}
</style>

<script src="/scripts/desktop.js"></script>

<script>
    rand = function(a, b)
    {
        return Math.round(Math.random() * (b - a)) + a;
    }

    var desktop = new Buro({selector : "canvas"});

    var note = new Buro.note(
    {
        position : {x : 20, y : 80},
        label : "A new note containing not much yet."
    });

    desktop.add(new Buro.checkbox(
    {
        position : {x : 30, y : 30},
        state : false,
        action : function() { if(this.state) desktop.enterFullscreen() ; else desktop.exitFullscreen() }
    }));

    desktop.add(new Buro.text(
    {
        position : {x : 45, y : 33},
        label : "fullscreen mode",
        fontSize : 10
    }));

    desktop.add(new Buro.button(
    {
        position : {x : 20, y : 50},
        label : "Click me !",
        action : function() { note.label = "This is the new content." ; note.position.y = 300 ; note.fontSize = 40 ; }
    }));

    desktop.add(new Buro.button(
    {
        position : {x : 90, y : 50},
        label : "Add a random clock",
        action : function()
        { 
            desktop.add(new Buro.clock(
            {
                position : {x : rand(0, desktop.width), y : rand(0, desktop.height)},
                radius : rand(20, 80),
                color : "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")"
            }));
        }
    }));

    desktop.add(note);

    desktop.add(new Buro.note(
    {
        position : {x : 20, y : 110},
        label : "An other note with a bigger font.",
        fontSize : 20
    }));

    desktop.add(new Buro.clock(
    {
        position : {x : desktop.width - 100, y : 100}
    }));

    desktop.add(new Buro.image(
    {
        position : {x : desktop.width - 520, y : 200},
        source : "/images/rio.jpg"
    }));

    window.addEventListener("resize", function()
    {
        desktop.width = document.body.offsetWidth;
        desktop.height = document.body.offsetHeight;

        desktop.canvas.width = document.body.offsetWidth;
        desktop.canvas.height = document.body.offsetHeight;
    });
</script>