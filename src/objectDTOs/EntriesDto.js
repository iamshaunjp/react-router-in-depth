import { Entries } from "../entities/EntriesEntity";

export class EntriesDto extends Entries {
  constructor(id, arena, group, datetime) {
    super(id, null, group, datetime);
  }
}
