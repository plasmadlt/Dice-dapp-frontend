import { TranslateCompiler } from '@ngx-translate/core';
import * as MessageFormat from 'messageformat';

export class TranslateMessageCompiler extends TranslateCompiler {
  private $messageFormat: MessageFormat;
  private readonly $default: string;

  constructor() {
    super();
    this.$default = 'en';
    this.$messageFormat = new MessageFormat()
      .setBiDiSupport(false)
      .setStrictNumberSign(false);
  }

  public compile(value: string, lang: string): (params: any) => string {
    try {
      return this.$messageFormat.compile(value, lang);
    } catch (e) {
      return this.$messageFormat.compile(value, this.$default);
    }
  }

  public compileTranslations(translations: any, lang: string): any {
    try {
      return this.$messageFormat.compile(translations, lang);
    } catch (e) {
      return this.$messageFormat.compile(translations, this.$default);
    }
  }
}
