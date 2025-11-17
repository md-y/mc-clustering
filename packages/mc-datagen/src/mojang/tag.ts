export class Tag {
  constructor(readonly id: string, readonly items: string[]) {
    if (!id.startsWith('#')) this.id = `#${id}`;
  }
}
