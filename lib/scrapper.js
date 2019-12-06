const request = require('request-promise-native'),
    cheerio = require('cheerio');

class ArjenScrapper {
    getPageHtml(url = url) {
        return request.get(url)
    }

    async getProductData(url) {
        const page = await this.getPageHtml(url);

        const $ = cheerio.load(page);

        // Use html parser
        const rightEl = $('#p_right');
        const colorsEl = $('div#select_r_list > div.r_wrap');
        const title = $('#p_title').text();
        const id = rightEl.find('meta[itemprop=productID]').attr('content');
        const price = $('#p_price').data('uah');
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
        console.log(sizes);

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
            images,
            sizesMap
        };
    }
}


module.exports = new ArjenScrapper();
