import * as borsh from "@project-serum/borsh";

export const postSchema = borsh.struct([
    borsh.str('id'),
    borsh.str('user_id'),
    borsh.array( borsh.u8(), 32, 'creator_key'),
    borsh.str('post_type'),
    borsh.str('chaos_message_id')
]);

export const invitationSchema = borsh.struct([
    borsh.str('id'),
    borsh.str('post_id'),
    borsh.str('due'),
    borsh.u64('for_invite'),
    borsh.u64('against_invite'),
    borsh.array( borsh.u8(), 32, 'user_to_be_invited')
]);

export const contentSchema = borsh.struct([
    borsh.str('id'),
    borsh.str('post_id'),
    borsh.u64('upvotes'),
    borsh.u64('downvotes')
]);

export const memberSchema = borsh.struct([
    borsh.array( borsh.u8(), 32, "key"),
    borsh.array( borsh.u8(), 32, "owner_key"),
    borsh.str('user_type'),
    borsh.str('user_id'),
    borsh.str('chaos_participant_id')
]);

export const pollSchema = borsh.struct([
    borsh.str('id'),
    borsh.str('post_id'),
    borsh.u64('for_invite'),
    borsh.u64('against_invite'),
    borsh.str('result'),
    borsh.vec(memberSchema, "voted_members")
]);



export const vesselSchema = borsh.struct([
    borsh.bool('is_initialized'),
    borsh.str('name'),
    borsh.str('description'),
    borsh.u32('amount_token'),
    borsh.vec(memberSchema, "members"),
    borsh.bool('is_created'),
    borsh.vec( borsh.str(), "categories"),
    borsh.str('id'),
    borsh.str('creator_id'),
    borsh.array( borsh.u8(), 32, 'owner_key'),
    borsh.str('chaos_channel_id'),
    borsh.vec(postSchema, "posts"),
    borsh.vec(invitationSchema, "invites"),
    borsh.vec(contentSchema, "contents"),
    borsh.vec(pollSchema, "polls")
]);



export interface Post {
    id: string;
    user_id: string;
    creator_key: Uint8Array; // 32 bytes
    post_type: string;
    chaos_message_id: string;
}

export interface Invitation {
    id: string;
    post_id: string;
    due: string;
    for_invite: number;
    against_invite: number;
    user_to_be_invited: Uint8Array; // 32 bytes
}

export interface Content {
    id: string;
    post_id: string;
    upvotes: number;
    downvotes: number;
}

export interface Member {
    key: Uint8Array; // 32 bytes
    owner_key: Uint8Array; // 32 bytes
    user_type: string;
    user_id: string;
    chaos_participant_id: string;
}

export interface Poll {
    id: string;
    post_id: string;
    for_invite: number;
    against_invite: number;
    result: string;
    voted_members: Member[];
}

export interface Vessel {
    is_initialized: boolean;
    name: string;
    description: string;
    amount_token: number;
    members: Member[];
    is_created: boolean;
    categories: string[];
    id: string;
    creator_id: string;
    owner_key: Uint8Array; // 32 bytes
    chaos_channel_id: string;
    posts: Post[];
    invites: Invitation[];
    contents: Content[];
    polls: Poll[];
}



