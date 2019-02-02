import { ISlashCommandPreviewItem, SlashCommandPreviewItemType } from '@rocket.chat/apps-engine/definition/slashcommands';

export class TenorResult {
    public id: string;
    public title: string;
    public previewUrl: string;

    // Returns data we care about from the imgur endpoint
    // TODO: Allow large gif previews to be resized in the preview...
    constructor(data?: any) {
        if (data) {
            this.title = data.title as string;
            this.id = data.id as string;
            this.previewUrl = data.media[0].nanogif.url as string;
        }
    }

    public toPreviewItem(): ISlashCommandPreviewItem {
        if (!this.id || !this.previewUrl) {
            throw new Error('Invalid result');
        }
        return {
            id: this.id,
            type: SlashCommandPreviewItemType.IMAGE,
            value: this.previewUrl,
        };
    }
}
