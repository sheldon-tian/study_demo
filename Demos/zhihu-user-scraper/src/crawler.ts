import superagent from 'superagent';
import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';

interface ICourse {
    title: string;
    count: number;
}

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
        this.url = userURL;
        this.init();
    }

    async getRawHtml() {
        const result = await superagent.get(this.url);
        return result.text;
    }

    getCourseInfo(html: string) {
        const $ = cheerio.load(html);
        const courseItems = $('li');
        const courseInfos: ICourse[] = [];
    }

    async init () {
        const html = await this.getRawHtml();
        // const courseInfo = this.getCourseInfo(html);

    }
}
