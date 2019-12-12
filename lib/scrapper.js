const request = require('request-promise-native');
const cheerio = require('cheerio');


class ArjenScrapper {
    async getPageHtml(uri, credentials) {
        const cookie = await this.authorize(credentials);
        if(!cookie) {
            throw new Error('Cannot authorize')
        }
        const jar = request.jar();
        jar.setCookie(cookie, 'https://arjen.com.ua');
        return request({ uri, jar })
    }

    async authorize (credentials){
        let result = null;
        const authorizationUrl = 'https://arjen.com.ua/ajax/user/login.php';
        const options = {
            method: 'post',
            uri: authorizationUrl,
            form:{
                email: credentials ? credentials.username : '',
                password: credentials ? credentials.password : ''
            },
            resolveWithFullResponse: true
        };
        const response = await request(options);
        const rawCookies = response.headers['set-cookie'];
        rawCookies.forEach(rawCookie => {
            const cookie = request.cookie(rawCookie);
            if(cookie.key === 'arjen') {
                result = cookie
            }
        });
        return result;
    }

    async getProductData(url, credentials) {
        const page = await this.getPageHtml(url, credentials);

        const $ = cheerio.load(page);

        // Use html parser
        const rightEl = $('#p_right');
        const colorsEl = $('div#select_r_list > div.r_wrap');
        const title = $('#p_title').text();
        const id = rightEl.find('meta[itemprop=productID]').attr('content');

        const price = {
            uah: $('#c_price').find('.price_kurs_change').first().data('uah'),
            usd: $('#c_price').find('.price_kurs_change').first().data('usd'),
            discount: $('#percent').text()
        };
        const originalPrice = {
            uah: $('#p_price').data('uah'),
            usd: $('#p_price').data('usd')
        };

        const images = [];
        rightEl.find('.color_carousel img').each((i, item) => {
            const color = $(item).data('color');
            const links = [];
            const itemGallery = $('#p_left .gallery').filter(function() {
                return $(this).data('color') === color;
            }).find('img');
            itemGallery.each(function() {
                links.push($(this).attr('src'))
            });
            images.push({color, links});
        });

        const sizesMap = [];
        const sizes = colorsEl.find('div.razmer');

        sizes.each((i, item) => {
            const sizeName = $(item).find('div.r_left > span.r_left0 > span.r_left1');
            const status = $(item).find('div.r_center > span');
            sizesMap.push({
                'title': sizeName.text(),
                'status': status.text().trim(),
                // 'color': colorEl.attributes['data-color']
            });
        });

        return {
            title,
            id,
            price,
            originalPrice,
            images,
            sizesMap
        };
    }
}


module.exports = new ArjenScrapper();
