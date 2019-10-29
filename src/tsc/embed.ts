import { jsonp } from "src/httpTransport";

type WindowWithInstgrm = {
  instgrm?: {
    Embeds: {
      process: () => void;
    };
  };
};

type EmbedServiceName = "Instagram";

type NoembedResponse = {
  provider_name: EmbedServiceName;
  html: string;
};

export const postProcessEmbed = (provider: EmbedServiceName) => {
  switch (provider) {
    case "Instagram":
      const { instgrm } = window as WindowWithInstgrm;
      if (instgrm !== undefined) {
        instgrm.Embeds.process();
      }
      break;

    default:
      break;
  }
};

export const getEmbedAsync = (embedUrl: string): Promise<NoembedResponse> => {
  const url = `https://noembed.com/embed?url=${embedUrl}`;
  return new Promise<NoembedResponse>(async (resolve, reject) => {
    try {
      const data = await jsonp<NoembedResponse>(url);
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};
