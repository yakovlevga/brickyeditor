import { http } from "src/common/AJAXHelper";

export class EmbedService {
  public static Instagram: string = "Instagram";

  public static getEmbedAsync(embedUrl: string): Promise<any> {
    const url = `https://noembed.com/embed?url=${embedUrl}`;
    return new Promise<any>(async (resolve, reject) => {
      try {
        const data = await http.jsonp(url);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  public static processEmbed(provider: string) {
    switch (provider) {
      case EmbedService.Instagram:
        if (instgrm) {
          instgrm.Embeds.process();
        }
        break;

      default:
        break;
    }
  }

  constructor() {}
}
