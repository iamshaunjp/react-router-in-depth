import { Group } from "../entities/GroupEntity";

export class GroupDto extends Group{
  
  constructor({ id, name, users}) {
  super(id, name, null);

    this.id = id;
    this.name = name;
    
  }
}
