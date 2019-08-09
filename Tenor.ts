import {
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';

import { TenorCommand } from './commands/TenorCommand';
import { ImageGetter } from './helpers/ImageGetter';

export class TenorApp extends App {
    private imageGetter: ImageGetter;

    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);

        this.imageGetter = new ImageGetter();
    }

    public getImageGetter(): ImageGetter {
        return this.imageGetter;
    }

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await configuration.settings.provideSetting({
            id: 'tenor_apikey',
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'Customize_Tenor_APIKey',
            i18nDescription: 'Customize_Tenor_APIKey_Description',
        });
        await configuration.settings.provideSetting({
            id: 'tenor_lang_code',
            type: SettingType.STRING,
            packageValue: 'en_US',
            required: true,
            public: false,
            i18nLabel: 'Customize_Tenor_Language',
            i18nDescription: 'Customize_Tenor_Language_Description',
        });
        await configuration.settings.provideSetting({
            id: 'tenor_content_filter',
            type: SettingType.STRING,
            packageValue: 'low',
            required: true,
            public: false,
            i18nLabel: 'Customize_Tenor_ContentFilter',
            i18nDescription: 'Customize_Tenor_ContentFilter_Description',
        });
        await configuration.settings.provideSetting({
            id: 'tenor_show_title',
            type: SettingType.BOOLEAN,
            packageValue: true,
            required: true,
            public: false,
            i18nLabel: 'Customize_Tenor_Show_Title',
            i18nDescription: 'Customize_Tenor_Show_Title_Description',
        });
        wait configuration.settings.provideSetting({
            id: 'tenor_image_limit',
            type: SettingType.STRING,
            packageValue: '10',
            required: false,
            public: false,
            i18nLabel: 'Customize_Tenor_Image_Limit',
            i18nDescription: 'Customize_Tenor_Image_Limit_Description',
        });
        await configuration.slashCommands.provideSlashCommand(new TenorCommand(this));
    }
}
