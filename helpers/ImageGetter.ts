import { HttpStatusCode, IHttp, ILogger, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { TenorResult } from './TenorResult';
import { TenorImageResult } from './TenorImageResult';

export class ImageGetter {
    public async search(logger: ILogger, http: IHttp, phase: string, read: IRead): Promise<Array<TenorResult>> {
        let search = phase.trim();
        if (!search) {
            search = 'random';
        }
        const key = await read.getEnvironmentReader().getSettings().getValueById('tenor_apikey');

        const response = await http.get(`https://api.tenor.com/v1/search?q=${search}&key=${key}&limit=15`);


        if (response.statusCode !== HttpStatusCode.OK || !response.data || !response.data.results) {
            logger.debug('Did not get a valid response', response);
            throw new Error('Unable to retrieve images.');
        } else if (!Array.isArray(response.data.results)) {
            logger.debug('The response data is not an Array:', response.data);
            throw new Error('Data is in a format we don\'t understand.');
        } 
        logger.debug('We got this many results: ', response.data.results.length);
        return response.data.results.map((r) => new TenorResult(r));
    }

    public async getOne(logger: ILogger, http: IHttp, imageId: string, read: IRead): Promise<TenorImageResult> {
        const key = await read.getEnvironmentReader().getSettings().getValueById('tenor_apikey');
        const response = await http.get(`https://api.tenor.com/v1/gifs?key=${key}&ids=${imageId}`);

        logger.debug('LE RESPONSE', response);
        if (response.statusCode !== HttpStatusCode.OK || !response.data || !response.data.results) {
            logger.debug('Did not get a valid response', response);
            throw new Error('Unable to retrieve the image.');
        } else if (typeof response.data.results !== 'object') {
            logger.debug('The response data is not an Object:', response.data);
            throw new Error('Data is in a format we don\'t understand.');
        }

        logger.debug('The returned data:', response.data);
        return new TenorImageResult(response.data.results[0]);
    }
}
