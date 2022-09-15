<!DOCTYPE html>
<html>
    <head>
        <meta content="text/html" charset="utf-8">
        <title>Corentin ROBIN - Web developer</title>
        <link rel="stylesheet" href="/styles/index.css">
        <script src="/scripts/index.js"></script>
    </head>

    <body>
        <header>
            <div>Corentin ROBIN</div>
            <div>Web developer</div>
        </header>

        <clock></clock>

        <span class="time-travel" onclick="Index.toggleVintageMode()"><img src="/images/time.svg"> <span data-label="timeTravelLabel"></span></span>

        <span class="fullscreen-button" onclick="Index.goFullScreen()">Fullscreen</span>

        <binder title="About me" sections="About,Experience,Skills,Resume" left="50" top="234"></binder>
        <binder title="Applications" sections="Map,Journal,Toolbox" left="81" top="586"></binder>
        <binder title="Canvas" sections="Desktop,Gravity" left="757" top="515"></binder>

        <img src="/images/profile.png" class="profile" onclick="Index.showAbout()">

        <div class="overlay">
            <div class="dialog">
                <div class="title"></div>
                <div class="body"></div>
                <div><span class="button" onclick="Index.hideDialog()">OK</span></div>
            </div>
        </div>

        <div class="menu">
            <div class="title"></div>
            <table>
                <tr><td>Content</td><td><textarea id="element-content" oninput="Index.updateElement()"></textarea></td></tr>
                <tr><td>Font size</td><td><input type="number" id="element-font-size" oninput="Index.updateElement()"></td></tr>
                <tr><td>Color</td><td><input type="color" id="element-color" oninput="Index.updateElement()"></td></tr>
                <tr><td>Background color</td><td><input type="color" id="element-background-color" oninput="Index.updateElement()"></td></tr>
            </table>
        </div>

        <calculator></calculator>

        <div class="note">
            <div>The purpose of this website is to be open-minded on how a website can look and how it can be built.</div>
            <p>Corentin</p>
        </div>

        <album image="rubber-soul.jpg" playlist="OLAK5uy_lvTG69VbZm3r3r9crRBvT1Tj305YEbuaM"></album>

        <img class="newspaper" src="/images/moon-landing.jpg">

        <span class="space" onclick="document.body.classList.toggle('three-dimensions')"><img src="/images/rocket.svg"> Space</span>

        <div class="mobile-panel">
            <div class="header">
                <div>
                    <div>Corentin ROBIN</div>
                    <div>Web developer</div>
                </div>
            </div>

            <div class="main">
                <div>
                    <div>This website is a windowed environment.</div>
                    <div>Open it on desktop, we can move things around!</div>
                </div>
            </div>

            <div class="footer">
                <div><a href="mailto:corentin.robin@gmail.com">corentin.robin@gmail.com</a></div>
            </div>
        </div>
    </body>
</html>