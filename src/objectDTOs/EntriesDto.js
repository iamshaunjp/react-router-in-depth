import { Entries } from "../entities/EntriesEntity";
import { GetRefGroupAsync } from "../controllers/GroupsController";
import { GetRefArenaAsync } from "../controllers/ArenasController";
import { GetRefUserAsync } from "../controllers/UserController";
import { GetRefAbsenceAsync } from "../controllers/AbsenceController";

import { UserDto } from "../objectDTOs/UsersDto";
import { GroupDto } from "./GroupDto";
import { AbsenceDto } from "./AbsenceDto";

export class EntriesDto extends Entries {
  constructor(id, arena, group, datetime) {
    super(id, arena, group, datetime);

    this.formatData();
  }

  async formatData() {
    const [group, arena, absence] = await Promise.all([
      await GetRefGroupAsync(this.group.group),
      await GetRefArenaAsync(this.arena),
      await GetRefAbsenceAsync(this.group.absence),
    ]);

    this.arena = arena;
    this.group.group = new GroupDto({ id: group.id, name: group.name });
    this.group.absence = absence;

    const promises = this.group.absence.array.map(async (user) => {
      const userRef = await GetRefUserAsync(user.user);

      return {
        user: new UserDto({ id: userRef.id, ...userRef.data() }),
        absence: user.absence,
      };
    });

    const arr = await Promise.all(promises);

    const absenceData = new AbsenceDto({ id: absence.id, array: arr });

    this.group.absence = absenceData;
  }
}
