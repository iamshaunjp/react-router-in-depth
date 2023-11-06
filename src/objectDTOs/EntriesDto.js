import { Entries } from "../entities/EntriesEntity";
import { GetRefGroupAsync } from "../controllers/GroupsController";
import { GetRefArenaAsync } from "../controllers/ArenasController";
import { GetRefUserAsync } from "../controllers/UserController";
import {UserDto} from "../objectDTOs/UsersDto"

export class EntriesDto extends Entries {
  constructor(id, arena, group, datetime) {
    super(id, arena, group, datetime);

    this.initUsersAndAbsence();
  }

  async initUsersAndAbsence() {
    const [arena, group] = await Promise.all([
      await GetRefArenaAsync(this.arena),
      await GetRefGroupAsync(this.group),
    ]);

    this.arena = arena;
    this.group = group;

    const promises = this.group.users.map(async (userNow) => {
      const user = await GetRefUserAsync(userNow);

      return {
        user: new UserDto({ id: user.id, ...user.data() }),
        absence: false,
      };
    });

    this.group.users = await Promise.all(promises);
  }
}
