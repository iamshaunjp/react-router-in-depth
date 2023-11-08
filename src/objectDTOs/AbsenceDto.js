import { Absence } from "../entities/AbsenceEntity";

export class AbsenceDto extends Absence {
  constructor(id, array) {
    super(id, array);    
  }


}

