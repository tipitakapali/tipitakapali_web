# 0. Dev live-server

Here's a clearer and more polished version of your instructions:


1. Start the development server using `live-server`. If it's not installed, run:

   ```bash
   npm install -g live-server http-server
   ```

2. Open the project in Chrome and use the Developer Tools to inspect CSS and other elements.

3. Edit the minified CSS file directly as needed.

4. To preview on a mobile device (phone/iPad), open the server IP address in the device’s browser to see live updates.


# 1. Use cssnano to minify  CSS

https://cssnano.github.io/cssnano/docs/getting-started/

```js
module.exports = {
    plugins: [
        require('cssnano')({
            preset: 'default',
        }),
    ],
};

```

## 2. Cloudflare cache
To overcome Cloudflare cache, we will append version to the resources

[append_version_to_resources.py](append_version_to_resources.py)

## 3. CSS

The template for all script is `./web/tp_templete.css`.

Run `./min.sh` to generate other css files and do minification.







## Compression

### Cloudflare compression
It is going to deprecated soon. So need to check for alternative compression

### Dictionary API

OK, it uses fastify `gzip` compression


## Misc.

https://developers.cloudflare.com/rules/url-forwarding/single-redirects/examples/#perform-mobile-redirects