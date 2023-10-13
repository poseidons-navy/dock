import * as borsh from '@project-serum/borsh'
import BN from 'bn.js';

interface VesselArguements {
    id?: string,
    name?: string,
    description?: string,
    amount_token?: BN,
    address?: string,
    user_type?: string,
    user_id?: string,
    chaos_participant_id?: string,
    vessel_id?: string,
    creator_id?: string,
    chaos_channel_id?: string,
    post_type?: string,
    chaos_message_id?: string,
    post_id?: string,
    due?: string,
}

export class Vessel {
    id: string;
    creator_id: string;
    name: string;
    description: string;
    amount_token: BN;
    due: string;
    address: string;
    chaos_message_id: string;
    post_type: string;
    user_type: string;
    user_id: string;
    chaos_participant_id: string;
    post_id: string;
    vessel_id: string;
    chaos_channel_id: string;


    constructor(
        fields: VesselArguements
    ) {
        this.id = fields.id ?? "";
        this.name = fields.name ?? "";
        this.description = fields.description ?? "";
        this.amount_token = fields.amount_token ?? new BN(0, 10);
        this.address = fields.address ?? "";

        this.user_type = fields.user_type ?? "";
        this.user_id = fields.user_id ?? "";
        this.chaos_participant_id = fields.chaos_participant_id ?? "";
        this.vessel_id = fields.vessel_id ?? "";
        this.creator_id = fields.creator_id ?? "";
        this.chaos_channel_id = fields.chaos_channel_id ?? "";
        this.post_type = fields.post_type ?? "";
        this.chaos_message_id = fields.chaos_message_id ?? "";
        this.post_id = fields.post_id ?? "";
        this.due = fields.due ?? "";

    }
    borshInstructionSchema = borsh.struct([

        borsh.u8('variant'),
        borsh.str('name'),
        borsh.str('id'),
        borsh.str('description'),
        borsh.u64('amount_token'),
        borsh.str('address'),
        borsh.str('user_type'),
        borsh.str('user_id'),
        borsh.str('chaos_participant_id'),
        borsh.str('vessel_id'),
        borsh.str('creator_id'),
        borsh.str('chaos_channel_id'),
        borsh.str('post_type'),
        borsh.str('chaos_message_id'),
        borsh.str('post_id'),
        borsh.str('due'),


    ]) ?? ""

    serialize(): Buffer {

        const buffer = Buffer.alloc(10000)

        this.borshInstructionSchema.encode({ variant: 0, ...this }, buffer)
        console.log("this almost")
        return buffer.subarray(0, this.borshInstructionSchema.getSpan(buffer))

    }
}