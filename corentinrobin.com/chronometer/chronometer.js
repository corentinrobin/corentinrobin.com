// Auteur : Corentin ROBIN
// Version du 20 avril 2020

// On s'inspire du Chronomètre Bleu de FP Journe pour les aiguilles et le cadran (https://www.fpjourne.com/en/collection/classique-collection/chronometre-bleu)
var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d");

var configuration =
{
    width : 800,
    height : 800,
    subDialWidth : 0.12 * 800,
    brandFontSize : 50,
    digitFontSize : 70,
    subDigitFontSize : 15,
    fontFamily : "GlassAntiqua-Regular",
    backgroundColor : "#10377c",
    foregroundColor : "#e0e2e8",
    chronographColor : "#daaf9f",
    minuteHandColor : "#a4adbf",
    balanceColor : "#ab892e",
    balanceThinness : 7,
    balanceRadius : 0.1 * 800,
    balanceRangeAngle : 30,
    shadowBlur : 2,
    shadowColor : "black"
}

var width = configuration.width, height = configuration.height;

var now = new Date();

var H = now.getHours(), M = now.getMinutes(), S = now.getSeconds();

// compteur de temps ordinateur
var t = H * 3600 + M * 60 + S, dt = 1 / 60, t0 = performance.now();

// fréquence du balancier
var f = 21600, T = 1 / (f / 3600), dT = 0;

var k = 1;

var balanceLeftDirection = true;

canvas.width = width;
canvas.height = height;

var runChronograph = false, chronographTime = 0;

resetChronograph = function()
{
    runChronograph = false;
    chronographTime = 0;
}

render = function()
{
    t += dt * k;

    if(runChronograph) chronographTime += dt * k;

    // on simule une trotteuse de montre mécanique
    if(dT * k > T)
    {
        balanceLeftDirection = !balanceLeftDirection;

        dT = 0;
        context.clearRect(0, 0, width, height);

        // CADRAN

        // cercles
    
        context.fillStyle = configuration.backgroundColor;
        context.strokeStyle = configuration.foregroundColor;

        context.beginPath();
        context.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
        context.stroke();
        context.fill();

        context.beginPath();
        context.arc(width / 2, height / 2, width / 2 - 15, 0, 2 * Math.PI);
        context.stroke();

        context.beginPath();
        context.arc(width / 2, height / 2, width / 2 - 80, 0, 2 * Math.PI);
        context.stroke();

        // texte

        context.save();

        context.fillStyle = configuration.foregroundColor;
        context.font = configuration.brandFontSize + "px " + configuration.fontFamily;

        label = "C. ROBIN";
        labelWidth = context.measureText(label).width;

        context.translate(width / 2, height / 2);

        context.fillText(label, 0 - labelWidth / 2, - height / 4 + 50);

        context.restore();

        // graduations

        context.save();

        context.translate(width / 2, height / 2);

        for(i = 1; i < 60 + 1; i++)
        {
            context.lineWidth = (i % 5 == 0 ? 4 : 1);

            context.rotate(6 * Math.PI / 180);

            context.beginPath();
            context.moveTo(0, width / 2 - 15);
            context.lineTo(0, width / 2);
            context.stroke();
        }

        context.restore();

        // chiffres

        context.save();

        context.fillStyle = configuration.foregroundColor;

        context.font = configuration.digitFontSize + "px " + configuration.fontFamily;

        context.translate(width / 2, height / 2);
        context.rotate(30 * Math.PI / 180);

        for(i = 0; i < 12; i++)
        {
            label = i + 1;
            labelWidth = context.measureText(label).width;

            context.fillText(label, 0 - labelWidth / 2, - width / 2 + 70);
            context.rotate(30 * Math.PI / 180);
        }

        context.restore();

        // SECONDES

        // cadran

        context.beginPath();
        context.arc(width / 4, height - height / 2, configuration.subDialWidth, 0, 2 * Math.PI);
        context.stroke();

        context.beginPath();
        context.arc(width / 4, height - height / 2, configuration.subDialWidth - 8, 0, 2 * Math.PI);
        context.stroke();

        // aiguille

        context.save();

        context.shadowBlur = configuration.shadowBlur;
        context.shadowColor = configuration.shadowColor;

        context.fillStyle = configuration.foregroundColor;
        context.lineWidth = 2;
        
        context.translate(width / 4, height - height / 2);
        context.rotate((0 - 180 + 6 * t) * (Math.PI / 180));

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, 0.9 * configuration.subDialWidth);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, - 0.4 * configuration.subDialWidth);
        context.stroke();

        context.beginPath();
        context.arc(0, - 0.4 * configuration.subDialWidth - 10, 10, 0, 2 * Math.PI);
        context.stroke();

        context.beginPath();
        context.arc(0, 0, 10, 0, 2 * Math.PI);
        context.fill();

        context.restore();

        // graduations

        context.save();

        context.translate(width / 4, height - height / 2);

        for(i = 1; i < 60 + 1; i++)
        {
            context.lineWidth = (i % 5 == 0 ? 2 : 1);

            context.rotate(6 * Math.PI / 180);

            context.beginPath();
            context.moveTo(0, configuration.subDialWidth - 8);
            context.lineTo(0, configuration.subDialWidth);
            context.stroke();
        }

        context.restore();

        // CHRONOGRAPHE MINUTES

        // cadran

        context.beginPath();
        context.arc(width / 2 + width / 4, height - height / 2, configuration.subDialWidth, 0, 2 * Math.PI);
        context.stroke();

        context.beginPath();
        context.arc(width / 2 + width / 4, height - height / 2, configuration.subDialWidth - 8, 0, 2 * Math.PI);
        context.stroke();

        // aiguille

        context.save();

        context.shadowBlur = configuration.shadowBlur;
        context.shadowColor = configuration.shadowColor;

        context.fillStyle = configuration.foregroundColor;
        context.lineWidth = 2;
        
        context.translate(width / 2 + width / 4, height - height / 2);
        context.rotate((0 - 180 + 6 * chronographTime / 30) * (Math.PI / 180));

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, 0.9 * configuration.subDialWidth);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, - 0.4 * configuration.subDialWidth);
        context.stroke();

        context.beginPath();
        context.arc(0, - 0.4 * configuration.subDialWidth - 10, 10, 0, 2 * Math.PI);
        context.stroke();

        context.beginPath();
        context.arc(0, 0, 10, 0, 2 * Math.PI);
        context.fill();

        context.restore();

        // graduations

        context.save();

        context.translate(width / 2 + width / 4, height - height / 2);

        context.fillStyle = configuration.foregroundColor;
        context.font = configuration.subDigitFontSize + "px " + configuration.fontFamily;

        for(i = 1; i < 30 + 1; i++)
        {
            context.rotate(12 * Math.PI / 180);

            if(i % 5 == 0)
            {
                label = i;
                labelWidth = context.measureText(label).width;
    
                context.fillText(label, 0 - labelWidth / 2, - configuration.subDialWidth + 25);

                context.lineWidth = 4;
            }

            else
            {
                context.lineWidth = 1;
            }

            context.beginPath();
            context.moveTo(0, configuration.subDialWidth - 8);
            context.lineTo(0, configuration.subDialWidth);
            context.stroke();
        }

        context.restore();

        // BALANCIER

        context.save();

        context.translate(width / 2, height - height / 4);
        context.rotate(balanceLeftDirection ? - configuration.balanceRangeAngle * Math.PI / 180 : + configuration.balanceRangeAngle * Math.PI / 180);

        context.fillStyle = "white";

        context.beginPath();
        context.arc(0, 0, configuration.balanceRadius + 2, 0, 2 * Math.PI);
        context.fill();

        context.fillStyle = configuration.balanceColor;

        context.beginPath();
        context.arc(0, 0, configuration.balanceRadius, 0, 2 * Math.PI);
        context.fill();

        context.fillStyle = "white";

        context.beginPath();
        context.arc(0, 0, configuration.balanceRadius - configuration.balanceThinness, 0, 2 * Math.PI);
        context.fill();

        context.fillStyle = configuration.balanceColor;

        // barre horizontale
        context.fillRect(- configuration.balanceRadius, - configuration.balanceThinness / 2, 2 * configuration.balanceRadius, configuration.balanceThinness);

        // barre verticale
        context.fillRect(- configuration.balanceThinness / 2, - configuration.balanceRadius, configuration.balanceThinness, 2 * configuration.balanceRadius);

        // ressort spirale (https://stackoverflow.com/questions/6824391/drawing-a-spiral-on-an-html-canvas-using-javascript, http://jsfiddle.net/jingshaochen/xJc7M/)

        var a = 1, b = 1, angle;

        context.beginPath();
        for (i = 0; i < 680; i++)
        {
            angle = 0.1 * i;
            x = 0 + (a + b * angle) * Math.cos(angle);
            y = 0 + (a + b * angle) * Math.sin(angle);
    
            context.lineTo(x, y);
        }
        context.strokeStyle = "black";
        context.stroke();

        context.fillStyle = "black";

        context.beginPath();
        context.arc(0, 0, 2, 0, 2 * Math.PI);
        context.fill();

        context.restore();

        // HEURES

        context.save();

        context.shadowBlur = configuration.shadowBlur;
        context.shadowColor = configuration.shadowColor;

        context.fillStyle = configuration.foregroundColor;

        context.translate(width / 2, height / 2);
        context.rotate((0 - 180 + 30 * t / 3600) * (Math.PI / 180));

        // gros bricolage...
        context.translate(0, - 5);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(15, 0);
        context.lineTo(0, 0.6 * width / 2);
        context.lineTo(-15, 0);
        context.quadraticCurveTo(0, -25, 15, 0);
        context.fill();

        context.restore();

        // MINUTES

        context.save();

        context.shadowBlur = configuration.shadowBlur;
        context.shadowColor = configuration.shadowColor;

        context.fillStyle = configuration.minuteHandColor;

        context.translate(width / 2, height / 2);
        context.rotate((0 - 180 + 6 * t / 60) * (Math.PI / 180));

        // gros bricolage...
        context.translate(0, - 5);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(15, 0);
        context.lineTo(0, 0.95 * width / 2);
        context.lineTo(-15, 0);
        context.quadraticCurveTo(0, -25, 15, 0);
        context.fill();

        context.restore();

        // CHRONOGRAPHE SECONDES

        // Aiguille des secondes
        context.save();

        context.shadowBlur = configuration.shadowBlur;
        context.shadowColor = configuration.shadowColor;

        context.strokeStyle = configuration.chronographColor;
        context.fillStyle = configuration.chronographColor;
        context.lineWidth = 3;

        context.translate(width / 2, height / 2);
        context.rotate((0 - 180 + 6 * chronographTime) * (Math.PI / 180));

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(2, 0);
        context.lineTo(2, 0.95 * width / 2 - 20);
        context.lineTo(6, 0.95 * width / 2 - 20);
        context.lineTo(0, 0.95 * width / 2);
        context.lineTo(-6, 0.95 * width / 2 - 20);
        context.lineTo(-2, 0.95 * width / 2 - 20);
        context.lineTo(-2, 0);
        context.lineTo(0, 0);
        context.fill();

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(2, 0);
        context.lineTo(2, - 0.1 * width / 2);
        context.lineTo(-2, - 0.1 * width / 2);
        context.lineTo(-2, 0);
        context.fill();

        context.beginPath();
        context.arc(0, 0, 7, 0, 2 * Math.PI);
        context.fill();

        context.restore();
    }

    else
    {
        dT += dt;
    }

    requestAnimationFrame(render);

    dt = (performance.now() - t0) / 1000;

    t0 = performance.now();
}

render();