import superagent from 'superagent';
import * as cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';

enum URLMap {
    Updates = '',
    Answer = 'answer',
    Posts = 'posts',
    Pins = 'pins',
}

export class Crawler {
    private url: string;
    private filePath = path.resolve(__dirname, '../data/data.json');

    constructor (userURL: string) {
        this.url = `${userURL}/${URLMap.Updates}`;
        this.init();
    }

    async getRawHtml() {
        const agent = new superagent.agent();
        agent.set('Cookie', '');
        const result = await agent.get(this.url);
        return result.text;
    }

    getItemsInfo(html: string) {
        const $ = cheerio.load(html);
        const items = $('.ContentItem');
        items.map((index, element) => {
            const title = $(element).find('.ContentItem-title').find('a').text();
            console.log(title);
            
        });
    }

    async init () {
        const html = await this.getRawHtml();
        const courseInfo = this.getItemsInfo(html);

    }
}
