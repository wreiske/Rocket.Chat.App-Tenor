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
            packageValue: 'IMA1E4Y79RUU',
            required: true,
            public: false,
            i18nLabel: 'Customize_Tenor_APIKey',
            i18nDescription: 'Customize_Tenor_APIKey_Description',
        });
        await configuration.slashCommands.provideSlashCommand(new TenorCommand(this));
    }
}