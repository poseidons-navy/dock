import * as borsh from '@project-serum/borsh'

interface VesselArguements {
    id?: string,
    name?: string,
    description?: string,
    amount_token?: number,
    interaction_type?: string,
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

export class Vote {
    id: string;
    creator_id: string;
    name: string;
    description: string;
    amount_token: number;
    due: string;
    interaction_type: string;
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
        this.amount_token = fields.amount_token ?? 0;
        this.interaction_type = fields.interaction_type ?? "";

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
        borsh.str('id'),
        borsh.str('creator_id'),

        borsh.str('name'),
        borsh.str('description'),
        borsh.str('chaos_channel_id'),

        borsh.u32('amount_token'),
        borsh.str('user_type'),
        borsh.str('user_id'),
        borsh.str('chaos_participant_id'),
        borsh.str('vessel_id'),
        borsh.str('post_id'),
        borsh.str('chaos_message_id'),
        borsh.str('due'),
        borsh.str('post_type'),

        borsh.str('interaction_type'),


    ])


    serialize(variant: number): Buffer {
        const buffer = Buffer.alloc(10000)

        let { borshInstructionSchema, serialize, ...rest } = this
        this.borshInstructionSchema.encode({
            ...rest, variant: variant
        }, buffer)
      
        return buffer.subarray(0, this.borshInstructionSchema.getSpan(buffer))

    }
}