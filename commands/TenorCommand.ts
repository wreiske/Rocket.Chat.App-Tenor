import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, ISlashCommandPreview, ISlashCommandPreviewItem, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { TenorApp } from '../Tenor';
import { TenorResult } from '../helpers/TenorResult';

export class TenorCommand implements ISlashCommand {
    public command = 'tenor';
    public i18nParamsExample = 'Tenor_Search_Term';
    public i18nDescription = 'Tenor_Command_Description';
    public providesPreview = true;

    constructor(private readonly app: TenorApp) { }

    public executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        // if there are no args or args[0] === 'random'
        // then get a single one

        // otherwise, fetch the results and get a random one
        // as the max amount returned will be ten
        throw new Error('Method not implemented.');
    }

    public async previewer(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<ISlashCommandPreview> {
        let images: Array<TenorResult>;
        let items: Array<ISlashCommandPreviewItem>;

        try {
            images = await this.app.getImageGetter().search(this.app.getLogger(), http, context.getArguments().join(' '), read);
            items = images.map((gif) => gif.toPreviewItem());
        } catch (e) {
            this.app.getLogger().error('Failed on something:', e);
            return {
                i18nTitle: 'ERROR',
                items: new Array(),
            };
        }

        return {
            i18nTitle: 'Results for',
            items,
        };
    }

    public async executePreviewItem(item: ISlashCommandPreviewItem, context: SlashCommandContext, read: IRead,
        modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const builder = modify.getCreator().startMessage().setSender(context.getSender()).setRoom(context.getRoom());

        try {
            const image = await this.app.getImageGetter().getOne(this.app.getLogger(), http, item.id, read);
            const showTitle = await read.getEnvironmentReader().getSettings().getValueById('tenor_show_title');
            const showLink = (await read.getEnvironmentReader().getSettings().getById('tenor_show_link')).value;

            const trigger = context.getArguments().join(' ').trim();

            builder.addAttachment({
                title: {
                    value: ((showTitle) ? image.title.trim() : ''),
                },
                author: {
                    icon: 'https://raw.githubusercontent.com/wreiske/Rocket.Chat.App-Tenor/master/images/Tenor-256.png',
                    name: (showLink ? `/tenor ${trigger.trim()} ${showLink}` : ''),
                    link: (showLink ? `https://tenor.com/search/${trigger.trim()}` : ''),
                },
                imageUrl: image.originalUrl
            });

            await modify.getCreator().finish(builder);
        } catch (e) {
            this.app.getLogger().error('Failed getting an image', e);
            builder.setText('An error occurred when trying to send the image :disappointed_relieved:');

            modify.getNotifier().notifyUser(context.getSender(), builder.getMessage());
        }
    }
}
