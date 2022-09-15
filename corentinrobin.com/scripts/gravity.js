// Auteur : Corentin Robin
// Version : 22 septembre 2019

var unit = 80; // pixels par metre
var gravity = -9.8; // m/s^2

var width, height; // unite de la simulation

var t0 = null, t1;
var dt = 1/60;
var t0, t1;
var count = 0;
var fps = 60;

var square = false,
    fill = false,
    neon = false;

var canvas, context, boundaries;

var objects = [];

var helpText = "Maintain left-click to create particles, right-click to remove particles, and wheel-click to decelerate particles.";

mousePosition = {x : 0, y : 0};

leftClick = false;
wheelClick = false;
rightClick = false;

var initialise = function()
{
    canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    boundaries = canvas.getBoundingClientRect();

    width = document.body.offsetWidth / unit;
    height = document.body.offsetHeight / unit;

    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;

    canvas.addEventListener("mousemove", function(event)
    {
        mousePosition.x = (event.clientX - boundaries.x + window.scrollX) / unit;
        mousePosition.y = height - (event.clientY - boundaries.y + window.scrollY) / unit;
    });
    
    canvas.addEventListener("mousedown", function(event)
    {
        if(event.button == 0) leftClick = true;
        else if(event.button == 1) wheelClick = true;
        else if(event.button == 2) rightClick = true;
    });
    
    canvas.addEventListener("mouseup", function(event)
    {
        leftClick = false;
        wheelClick = false;
        rightClick = false;
    });
    
    canvas.addEventListener("contextmenu", function(event)
    {
        event.preventDefault();
    });
    
    canvas.addEventListener("wheel", function(event)
    {
        event.preventDefault();
        event.stopPropagation();
    });

    render();
}

randomFloat = function(a, b)
{
    return Math.random() * (b - a) + a;
}

distance = function(a, b)
{
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

checkCollision = function(object)
{
    var i, target = null;

    for(i = 0; i < objects.length && target == null; i++)
    {
        if(object != objects[i])
        {
            if(distance(object, objects[i]) < object.radius + objects[i].radius)
            {
                target = objects[i];
            }
        }
    }

    return target;
}

Marble = function(options)
{
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.cv = options.cv;
    this.radius = options.radius;
}

Marble.prototype.calculate = function()
{
    this.vy += gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if(this.y + this.radius > height)
    {
        this.vy = - this.cv * this.vy
        this.y = height - this.radius;
    }

    if(this.y - this.radius < 0)
    {
        this.vy = - this.cv * this.vy
        this.y = this.radius;
    }

    if(this.x - this.radius < 0)
    {
        this.vx = - this.cv * this.vx
        this.x = this.radius;
    }

    if(this.x + this.radius > width)
    {
        this.vx = - this.cv * this.vx
        this.x = width - this.radius;
    }
}

Marble.prototype.render = function()
{
    context.beginPath();

    if(square) context.rect((this.x - this.radius) * unit, (height - (this.y + this.radius)) * unit, 2 * this.radius * unit, 2 * this.radius * unit);
    else context.arc(this.x * unit, (height - this.y) * unit, this.radius * unit, 0, 2 * Math.PI);

    if(fill) context.fill();
    else context.stroke();
}

renderBackground = function()
{
    context.save();
    context.clearRect(0, 0, width * unit, height * unit);
    context.fillStyle = "black";
    context.fillRect(0, 0, width * unit, height * unit);

    context.fillStyle = "grey";
    context.font = "12px 'Open Sans'";
    var textWidth = context.measureText(helpText).width;
    context.fillText(helpText, width / 2 * unit - textWidth / 2, height / 2 * unit);
    context.restore();
}

renderAxis = function()
{
    context.save();
    context.strokeStyle = "white";
    context.fillStyle = "white";
    context.beginPath();
    context.moveTo(20, height * unit - 20);
    context.lineTo(20 + unit, height * unit - 20);
    context.stroke();

    if(count % 30 == 0) fps = Math.round(1 / ((t1 - t0) / 1000));

    context.font = "10px DidactGothic-Regular";
    var objectsText = objects.length + " object(s)",
        fpsText = fps + " FPS";

    context.fillText(objects.length + " object(s)", width * unit - context.measureText(objectsText).width - 10, 20);
    context.fillText(fps + " FPS", width * unit - context.measureText(fpsText).width - 10, 40);

    context.fillText("1m", 10 + 1 / 2 * unit, height * unit - 7);

    var copyright = "© 2019 Corentin Robin";

    context.fillText(copyright, width * unit - context.measureText(copyright).width - 7, height * unit - 7)
    context.restore();
}

render = function(timestamp)
{
    if(t0 == null) t0 = timestamp;

    count++;

    if(leftClick)
    {
        for(i = 0; i < 3; i++)
        {
            objects.push(new Marble({
                x : mousePosition.x,
                y : mousePosition.y,
                vx : randomFloat(-4, 4),
                vy : randomFloat(-4, 4),
                cv : randomFloat(0.2, 0.7),
                radius : randomFloat(0.05, 0.15)
            }));
        }
    }

    else if(wheelClick)
    {
        var i;

        for(i = 0; i < objects.length; i++)
        {
            if(distance(mousePosition, objects[i]) < 2)
            {
                objects[i].vx *= 0.8;
                objects[i].vy *= 0.8;
            }
        }
    }

    else if(rightClick)
    {
        var i;

        for(i = 0; i < objects.length; i++)
        {
            if(distance(mousePosition, objects[i]) < 2)
            {
                objects.splice(i, 1);
                i--;
            }
        }
    }

    t1 = timestamp;

    renderBackground();

    context.save();
    context.fillStyle = "#f99d0c";
    context.strokeStyle = "#f99d0c";
    context.shadowColor = "#f99d0c";

    if(neon) context.shadowBlur = 10;
    else context.shadowBlur = 0;

    for(i = 0; i < objects.length; i++)
    {
        objects[i].calculate();
        objects[i].render();
    }

    context.restore();

    renderAxis();

    t0 = t1;

    requestAnimationFrame(render);
}

initialise();

window.addEventListener("resize", function()
{
    width = document.body.offsetWidth / unit;
    height = document.body.offsetHeight / unit;

    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
});