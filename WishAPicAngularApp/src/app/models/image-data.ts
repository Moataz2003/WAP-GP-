export class ImgData {
    id: number | null;
    userId: string | null;
    prompt: string | null;
    public image: string | null;
    isFavorite: boolean | null;

    constructor(id: number | null = null, userId: string | null = null,
         prompt: string | null = null, image: string | null = null, isFavorite: boolean | null = null) {
      this.id = id;
      this.userId = userId;
      this.prompt = prompt;
      this.image = image;
      this.isFavorite = isFavorite;
    }
}
