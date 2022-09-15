<!DOCTYPE html>
<html>
    <head>
        <title>Tailwind or CSS?</title>

        <style>
            @import url('https://fonts.googleapis.com/css?family=Inconsolata|Playfair+Display&display=swap');

            @media only screen and (max-width : 1199px)
            {
                body
                {
                    width : auto !important;
                    margin : 0 20px !important;
                }

                div.header
                {
                    margin : 0 !important;
                }
            }

            div.header
            {
                text-align : center;
                margin-bottom : 2cm;
            }

            body
            {
                font-family : "Playfair Display";
                width : 1200px;
                margin : 2cm auto;
            }

            pre
            {
                font-family : "Inconsolata";
                background-color : #babae1;
                color : #38426c;
                padding : 10px;
                border-radius : 4px;
                overflow : auto;
            }

            h3
            {
                border-left : solid 3px #c8bba2;
                padding-left : 10px;
            }

            a,a:visited
            {
                color : #596375;
            }
        </style>
    </head>

    <body>
        <div class="header">
            <h1>Tailwind or CSS?</h1>

            <i>version: 17/12/2019 ; author: Corentin ROBIN</i>
        </div>

        <h2>Introduction</h2>

        <p><a href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a> being more and more used in the web development world, we will do a comparison with standard CSS.</p>

        <h2>Utility-First</h2>

        <h3>Tailwind</h3>
        
        <pre>class="bg-blue-600 text-white p-1 rounded cursor-pointer"</pre>
        
        <h3>CSS</h3>
        
        <pre>style="background-color: var(--blue-600); color: white; padding: 0.25rem; border-radius: 4px; cursor: pointer"</pre>
        
        <h2>Extracting Components</h2>
        
        <h3>Tailwind</h3>
        
        <pre>.button
{
    @apply bg-blue-600 text-white p-1 rounded cursor-pointer;
}</pre>
        
        <h3>CSS</h3>
        
        <pre>.button
{
    background-color: var(--blue-600); color: white; padding: 0.25rem; border-radius: 4px; cursor: pointer;
}</pre>
        
        <h2>Customisation</h2>
        
        <h3>Tailwind</h3>
        
        <pre>module.exports =
{
    [...]
    fontSize:
    {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px'
    }
    [...]
};</pre>
        
        
        <h3>CSS</h3>
        
        <pre>:root
{
    --xs: 12px;
    --sm: 14px;
    --base: 16px;
    --lg: 18px;
    --xl: 20px;
}</pre>
        
        <h2>Conclusion</h2>

        <p>Tailwind doesn't give much of an advantage over CSS, and it requires <a href="https://tailwindcss.com/course/setting-up-tailwind-and-postcss/" target="_blank">installation and configuration</a> to make it work.</p>

        <p>In addition, everything can be done in CSS as follows:</p>

        <ul>
            <li>pre-defined values can be done with variables</li>
            <li>utility-first use can be done with inline style, built-in utilities can be done with custom classes</li>
            <li>@apply can be done with normal classes</li>
            <li>configuration file can be done with CSS file containing variables</li>
        </ul>
    </body>
</html>
