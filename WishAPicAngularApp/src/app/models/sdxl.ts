export class Sdxl {
  id: number | null;
  prompt: string | null;
  imageUrl: string | null;

  constructor(id: number | null = null, prompt: string | null = null,
    imageUrl: string | null = null) {
    this.id = id;
    this.prompt = prompt;
    this.imageUrl = imageUrl;
  }
}
