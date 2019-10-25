import { bre } from "src/Types/bre";

export const defaultOptions: Partial<bre.Options> = {
  templatesUrl: "templates/bootstrap4.html",
  compactTools: false,
  compactToolsWidth: 768,
  ignoreHtml: true,
  onError: (data: any) => {
    // tslint:disable-next-line:no-console
    console.log(data.message);
  },
};
