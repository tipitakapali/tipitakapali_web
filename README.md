
# Use cssnano to minify  CSS

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

## Cloudflare cache
To overcome Cloudflare cache, we will append version to the resources

[append_version_to_resources.py](append_version_to_resources.py)

## CSS

The template for all script is `./web/tp_templete.css`.

Run `./min.sh` to generate other css files and do minification.

## Compression

### Cloudflare compression
It is going to deprecated soon. So need to check for alternative compression

### Dictionary API

OK, it uses fastify `gzip` compression


## Misc.

https://developers.cloudflare.com/rules/url-forwarding/single-redirects/examples/#perform-mobile-redirects