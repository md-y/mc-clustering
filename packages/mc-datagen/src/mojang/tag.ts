export class Tag {
  public readonly itemIds: string[] = [];
  public readonly tagIds: string[] = [];

  constructor(readonly id: string, entryIds: string[]) {
    if (!id.startsWith('#')) this.id = `#${id}`;

    for (const entryId of entryIds) {
      if (entryId.startsWith('#')) this.tagIds.push(entryId);
      else this.itemIds.push(entryId);
    }
  }
}
