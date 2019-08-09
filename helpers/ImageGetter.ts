import { HttpStatusCode, IHttp, ILogger, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { TenorResult } from './TenorResult';
import { TenorImageResult } from './TenorImageResult';

export class ImageGetter {
    private readonly defaultKey = 'IMA1E4Y79RUU';
    public async search(logger: ILogger, http: IHttp, phase: string, read: IRead): Promise<Array<TenorResult>> {
        let search = phase.trim();
        if (!search) {
            search = 'random';
        }
        const key = await read.getEnvironmentReader().getSettings().getValueById('tenor_apikey') || this.defaultKey;
        const limit = await read.getEnvironmentReader().getSettings().getValueById('tenor_image_limit') || '10';
        const langCode = await read.getEnvironmentReader().getSettings().getValueById('tenor_lang_code') || 'en_US';
        const rating = await read.getEnvironmentReader().getSettings().getValueById('tenor_content_filter') || 'low';
        const response = await http.get(`https://api.tenor.com/v1/search?q=${search}&key=${key}&limit=${limit}&locale=${langCode}&contentfilter=${rating}`);

        if (response.statusCode !== HttpStatusCode.OK || !response.data || !response.data.results) {
            logger.debug('Did not get a valid response', response);
            throw new Error('Unable to retrieve images.');
        } else if (!Array.isArray(response.data.results)) {
            logger.debug('The response data is not an Array:', response.data);
            throw new Error('Data is in a format we don\'t understand.');
        } 

        return response.data.results.map((r) => new TenorResult(r));
    }

    public async getOne(logger: ILogger, http: IHttp, imageId: string, read: IRead): Promise<TenorImageResult> {
        const key = await read.getEnvironmentReader().getSettings().getValueById('tenor_apikey') || this.defaultKey;
        const response = await http.get(`https://api.tenor.com/v1/gifs?key=${key}&ids=${imageId}`);

        if (response.statusCode !== HttpStatusCode.OK || !response.data || !response.data.results) {
            logger.debug('Did not get a valid response', response);
            throw new Error('Unable to retrieve the image.');
        } else if (typeof response.data.results !== 'object') {
            logger.debug('The response data is not an Object:', response.data);
            throw new Error('Data is in a format we don\'t understand.');
        }

        return new TenorImageResult(response.data.results[0]);
    }
}
