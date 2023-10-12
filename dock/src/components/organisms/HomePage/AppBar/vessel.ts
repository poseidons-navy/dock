import * as borsh from "@project-serum/borsh";

export class Vessel {
  name: string;
  description: string;
  vesselId: string

  constructor(name: string, description: string, vesselId: string) {
    this.name = name;
    this.description = description;
    this.vesselId = vesselId
  }

  borshInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("name"),

    borsh.str("description"),
  ]);

  serialize(): Buffer {
    const buffer = Buffer.alloc(1000);
    this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer);
    return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer));
  }
}
