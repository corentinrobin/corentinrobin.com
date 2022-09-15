<!DOCTYPE html>
<html>
    <head>
        <meta content="text/html" charset="utf-8">
        <title>Corentin ROBIN - Web developer</title>

        <style>
            /* Concept et réalisation : Corentin ROBIN */

            @font-face
            {
                font-family : DidactGothic-Regular;
                src : url(/fonts/DidactGothic-Regular.ttf);
            }

            div.card
            {
                font-family : DidactGothic-Regular;
                color : white;
                width : 85mm;
                height : 55mm;
                background-image: linear-gradient(to top right, #003116, #62af34);
                margin : 10px;
                border-radius : 3mm;
                position : relative;
            }

            div.card > div.header
            {
                font-size: 1.2em;
                padding: 4mm 6mm;
                font-weight: bold;
            }

            div.card > div.digits
            {
                font-family: Courier;
                font-size: 1.4em;
                color: #d7d7d7;
            }

            div.card > div:not(.header)
            {
                padding-left : 9mm;
            }

            div.card span.chip
            {
                width: 11mm;
                height: 8mm;
                background-color: #d7d7d7;
                display: block;
                border-radius: 1mm;
                margin: 4mm 0;
                position : relative;
            }

            div.card span.chip > span
            {
                position: absolute;
                width: 11mm;
                height: 3mm;
                left: 0mm;
                top: 2.3mm;
                border-top: solid 1px #424242;
                border-bottom: solid 1px #424242;
            }

            div.card img.signal
            {
                transform: rotate(90deg);
                width: 7mm;
                float: right;
                margin: -16mm 4mm;
            }

            div.card > div.footer
            {
                position : relative;
            }

            div.card span.from,div.card span.to
            {
                position : relative;
                font-family: Courier;
                color: #d7d7d7;
            }

            div.card span.from
            {
                margin: 0mm 8mm;
                vertical-align: -2mm;
            }

            div.card span.from:before
            {
                content: 'FREE FROM';
                font-family: Arial;
                color:white;
                position: absolute;
                font-size: 0.6em;
                left: -7mm;
                width: 20mm;
                top: -2mm;
            }

            div.card span.to
            {
                margin: 0mm 5mm;
                vertical-align: -2mm;
            }

            div.card span.to:before
            {
                content: 'UNTIL';
                font-family: Arial;
                color:white;
                position: absolute;
                font-size: 0.6em;
                left: -7mm;
                width: 20mm;
                top: -2mm;
            }

            div.card span.web
            {
                position: absolute;
                right: 4mm;
                top: -6.5mm;
                font-size: 2em;
                font-weight: bold;
                font-style: italic;
            }

            div.card span.developer
            {
                position: absolute;
                right: 4mm;
                top: 2mm;
            }

            div.card div.band
            {
                position: absolute;
                left: 0;
                top: 4mm;
                width: 76mm;
                height: 12mm;
                background: black;
            }

            div.card div.cryptogram
            {
                position: absolute;
                left: 3mm;
                top: 20mm;
                width: 51mm;
                height: 8mm;
                background-color: white;
                color: #5a5d66;
                font-style: italic;
            }

            div.card div.hologram
            {
                position: absolute;
                top: 31mm;
                left: 3mm;
                width: 16mm;
                height: 12mm;
                background-color: #dfdfdf;
                border-radius: 3mm;
                padding: 0;
            }

            div.card div.skills
            {
                position: absolute;
                left: 5mm;
                top: 28mm;
                font-size: 0.7em;
            }

            div.card div.skills li,div.card div.languages li
            {
                line-height: 1em;
            }

            div.card div.languages
            {
                position: absolute;
                left: 49mm;
                top: 18mm;
                font-size: 0.7em;
            }

            div.card div.website
            {
                position: absolute;
                left: 3mm;
                top: 47mm;
                padding: 0;
                font-size: 0.8em;
            }
        </style>
    </head>

    <body>

        <div class="card">
            <div class="header">CORENTIN ROBIN</div>
            <div>
                <span class="chip">
                    <span></span>
                </span>
                <img class="signal" src="/images/signal.svg">
            </div>
            <div class="digits">2311 1995 3141 5926</div>
            <div>
                <span class="from">now</span>
                <span class="to">after</span>
            </div>
            <div class="footer">
                <span class="web">WEB</span>
                <span class="developer">Developer</span>
            </div>
        </div>

        <div class="card">
            <div class="band"></div>
            <div class="cryptogram">corentin.robin@gmail.com</div>
            <div class="hologram"></div>
            <div class="languages">
                <ul>
                    <li>French</li>
                    <li>English</li>
                </ul>
            </div>
            <div class="skills">
                <ul>
                    <li>HTML, CSS, JS</li>
                    <li>&lt;canvas&gt;</li>
                    <li>PHP, MySQL</li>
                    <li>Git, Jira</li>
                </ul>
            </div>
            <div class="website">
                corentinrobin.com
            </div>
        </div>

    </body>
</html>