export class TenorImageResult {
  public id: string;
  public title: string;
  public originalUrl: string;

  constructor(data?: any) {
    if (data) {
      this.title = data.title as string;
      this.id = data.id as string;
      this.originalUrl = data.media[0].gif.url as string;
    }
  }
}
