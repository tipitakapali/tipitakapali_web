import subprocess

# cmd = 'pandoc -f markdown -t html5 info.md'
# html_output = subprocess.getoutput(cmd)

print("Using pandoc to generate info.html")
cmd = 'pandoc -f markdown -t html5 index_html_not_min/info.md'

process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
stdout, _ = process.communicate()

# Decode the output using utf-8 encoding
html_output = stdout.decode('utf-8')


text = '''<!DOCTYPE html>
<html lang="pi">
  <head>
    <meta charset=utf-8>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
    <meta name=apple-mobile-web-app-capable content=yes>
    <meta name=apple-mobile-web-app-title content=Tipitakapali.org>
    <meta name=mobile-web-app-capable content=yes>
    <meta name=robots content="index, follow">
    <title>TipitakaPali.Org - Attributions and Downloads</title>
    <meta name="theme-color" content="#ffffff">
    <meta name=description
        content="Explore and learn Tipiṭaka Pāḷi in the Chaṭṭha Saṅgāyana Tipiṭaka with tipitakapali.org. Discover the complete Buddhist canon, enhanced with dictionaries, various Pali scripts, and resources for pali study and practice.">
    <meta property=og:title content="Explore and learn Tipiṭaka Pāḷi in the Chaṭṭha Saṅgāyana Tipiṭaka with tipitakapali.org">
    <meta property=og:description
        content="Explore and learn Tipiṭaka Pāḷi in the Chaṭṭha Saṅgāyana Tipiṭaka with tipitakapali.org. Discover the complete Buddhist canon, enhanced with dictionaries, various Pali scripts, and resources for pali study and practice.">
    <meta property=og:image content=https://tipitakapali.org/web/icons/favico.ico>
    <meta property=og:url content=https://tipitakapali.org/info>
    <link rel=apple-touch-icon sizes=180x180 href=web/icons/apple-touch-icon.png>
    <link rel=icon type=image/png sizes=32x32 href=web/icons/favicon-32x32.png>
    <link rel=icon type=image/png sizes=16x16 href=web/icons/favicon-16x16.png>
    <link rel=manifest href=web/icons/site.webmanifest>
    <link rel=mask-icon href=web/icons/safari-pinned-tab.svg color=#5bbad5>
    <meta name=msapplication-TileColor content=#da532c>

    <style>
      :root {
      --safe-area-inset-top: env(safe-area-inset-top, 25px);
      --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
      --safe-area-inset-left: env(safe-area-inset-left, 0px);
      --safe-area-inset-right: env(safe-area-inset-right, 0px);
      }

      body {
        font-family: "Noto Serif", "Times Ext Roman", "DejaVu Sans", "Indic Times", "Doulos SIL", Tahoma, "Arial Unicode MS", Gentium;
        width: 80%;
        margin: 0 auto;
        padding: calc(var(--safe-area-inset-top) + 20px) calc(var(--safe-area-inset-right) + 10px) calc(var(--safe-area-inset-bottom) + 10px) calc(var(--safe-area-inset-left) + 10px);
        -webkit-tap-highlight-color: transparent;

        cursor: default;
        overflow-wrap: break-word;
        word-break: break-word;
        text-align: justify;
        -webkit-font-smoothing: antialiased;
      }

      .tableContainer {
        margin: 0 1%;
        text-align: left;
      }

      a {
        text-decoration: none;
      }

      h2 {
        color: midnightblue;
        background: #ddd;
      }

      h3 {
        background: #ddd;
        color: midnightblue;
      }

      #velthuis td {
        border-bottom: solid grey 1px;
      }
      .namo {
          text-align: center;
          color: #DAA520;
          font-size: large;
          font-weight: bold;
      }
      
      blockquote {
          padding-left: 5px;
          border-left: solid grey 2px;
          font-size: small;
      }
      
      table {
          text-align: center;
      }
      
      table th, table tr, table td {
          border: solid 1px grey;
      }
      
      .header {
          color: midnightblue;
      }
      
      table .even {
          background: #eee;
      }
      .loader-container {
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loader {
    /* adapted from https://css-loaders.com/spinner */
    width: 50px;
    aspect-ratio: 1;
    color: #854f1d;
    border-radius: 50%;
    display: grid;
    background: 
      conic-gradient(from 90deg at 4px 4px,#0000 90deg,currentColor 0)
      -4px -4px/calc(50% + 2px) calc(50% + 2px),
      radial-gradient(farthest-side,currentColor 6px,#0000 7px calc(100% - 6px),currentColor calc(100% - 5px)) no-repeat;
    animation: l10 2s infinite linear;
    position: relative;
  }
  .loader:before {
    content: "";
    border-radius: inherit;
    background: inherit;
    transform: rotate(45deg);
  }
  @keyframes l10 {to{transform: rotate(.5turn)}}
   img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }

  figure {
    margin: 1em 0;
    text-align: center;
  }

  figcaption {
    font-style: italic;
    margin-top: 0.5em;
  }

  .download-section {
    font-family: Arial, sans-serif;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    }

    .download-section .platform-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    }

    .download-section .platform {
    margin: 20px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 20px;
    }

    .download-section .platform-content {
    display: flex;
    flex-direction: column;
    }

    .download-section .download-button {
    display: inline-block;
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 10px;
    text-align: center;
    }

    .download-section .download-button:hover {
    background-color: #0056b3;
    }

    .download-section img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    }

    .download-badges {
      display: flex; /* Use flexbox for horizontal layout */
      align-items: center; /* Vertically center the images */
    }

    .download-badges a {
      margin-right: 10px; /* Add some spacing between the badges */
    }

    .download-badges img {
      height: 50px; /* Adjust the height as needed */
    }

    #gobackFromSearch {
      position: absolute;
      top: 0;
      left: max(calc(var(--safe-area-inset-left) + 30px), 0);
      /* Prevents the button from overflowing the 80% body width */
      max-width: 100%;
      padding-top: calc(var(--safe-area-inset-top) + 30px);
      z-index: 1000;
    }

  
    </style>
  </head>
 
<body>
<a class="aNoHover" href="index.html"><div class="loader-container"><div class="loader"></div></div></a>
<div id="gobackFromSearch" style="position: absolute;">
  <button class="smallButton" id="goBackButton" onclick="window.history.back()">
    <img width="16" height="16" src="web/icons/toplogo.webp" alt="Go back" /> Go back
  </button>
</div>

''' + html_output + '''

<div>
  <button class="smallButton" id="goBackButtonBottom" onclick="window.history.back()">
    <img width="16" height="16" src="web/icons/toplogo.webp" alt="Go back" /> Go back
  </button>
</div>

</body>
</html>
'''


with open('index_html_not_min/info.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("Wrote: ./index_html_not_min/info.html")

with open('index_html_not_min/download.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("Wrote: ./index_html_not_min/download.html")
