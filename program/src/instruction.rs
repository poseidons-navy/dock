use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;

// Define the instructions that I'll be processing
pub enum VesselInstruction {
    CreateVessel {
        id: String,
        creator_id: String,
        name: String,
        description: String,
        chaos_channel_id: String,
        amount_token: u32,
    },
    // InviteFoundingMember {
    //     id: u64,
    // },
    // InviteMember {
    //     address: String
    // },
    // AwardCommunityToken {
    //     address: String
    // },
    // CreateTask {
    //     title: String,
    //     description: String,
    //     amount_token: u64
    // },
    // CreateSpecialistVote {
    //     title: String,
    //     description: String
    // },
    // VoteSpecialist {
    //     voted_member: String
    // },
    // VoteMemberIn{
    //     member: String,
    //     vote: bool
    // },
    // VoteMemberOut {
    //     member: String,
    //     vote: bool
    // },
    // GetVessels,
    // RequestInvite {
    //     member: String,
    //     vessel_address: String
    // },
    AddMember {
        user_type: String,
        user_id: String,
        chaos_participant_id: String,
        vessel_id: String
    },
    CreateContent {
        vessel_id: String,
        id: String,
        post_id: String,
        user_id: String,
        chaos_message_id: String
    },
    CreateInvitation {
        vessel_id: String,
        id: String,
        post_id: String,
        due: String,
        user_id: String,
        chaos_message_id: String
    },
    CreatePoll {
        vessel_id: String,
        id: String,
        post_id: String,
        user_id: String,
        chaos_message_id: String
    },
    VoteOnPost{
        vessel_id: String,
        id: String,
        post_type: String,
        interaction_type: String
    },
    Test{

    }
    // InviteSpecialist {
    //     id: u64,
    //     role: String
    // }
}

// Define data in instruction
// #[derive(BorshDeserialize, BorshSerialize)]
// pub struct VesselInstructionStruct {
//     pub id: String,
//     pub name: String,
//     pub description: String,
//     pub amount_token: u64,
//     pub address: String,
//     pub title: String,
//     pub voted_member: String,
//     pub member: String,
//     pub vote: bool,
//     pub vessel_address: String,
//     pub user_type: String,
//     pub user_id: String,
//     pub chaos_participant_id: String,
//     pub vessel_id: String,
//     pub creator_id: String,
//     pub chaos_channel_id: String,
//     pub post_type: String,
//     pub chaos_message_id: String,
//     pub post_id: String,
//     pub due: String,
//     pub for_invite: u64,
//     pub against_invite: u64,
//     pub upvotes: u64,
//     pub downvotes: u64,
//     pub interaction_type: String
// }

#[derive(BorshDeserialize, BorshSerialize)]
pub struct VesselInstructionStruct {
    pub id: String,
    pub creator_id: String,
    pub name: String,
    pub description: String,
    pub chaos_channel_id: String,
    pub amount_token: u32,
    pub user_type: String,
    pub user_id: String,
    pub chaos_participant_id: String,
    pub vessel_id: String,
    pub post_id: String,
    pub chaos_message_id: String,
    pub due: String,
    pub post_type: String,
    pub interaction_type: String
}

impl VesselInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // Remove first byte from instruction
        let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;

        // Extract payload from rest of data
        let payload = VesselInstructionStruct::try_from_slice(rest).unwrap();

        // Match based on variant
        Ok(match variant {
            0 => Self::CreateVessel { id: payload.id, creator_id: payload.creator_id, name: payload.name, description: payload.description, chaos_channel_id: payload.chaos_channel_id, amount_token: payload.amount_token },
            // 1 => Self::InviteFoundingMember { address: payload.address },
            // 2 => Self::InviteMember { address: payload.address },
            // 3 => Self::AwardCommunityToken { address: payload.address },
            // 4 => Self::CreateTask { title: payload.title, description: payload.description, amount_token: payload.amount_token },
            // 5 => Self::CreateSpecialistVote { title: payload.title, description: payload.description },
            // 6 => Self::VoteSpecialist { voted_member: payload.voted_member },
            // 7 => Self::VoteMemberIn { member: payload.member, vote: payload.vote },
            // 8 => Self::VoteMemberOut { member: payload.member, vote: payload.vote },
            // 9 => Self::GetVessels,
            // 10 => Self::RequestInvite { member: payload.member, vessel_address: payload.vessel_address },
            11 => Self::AddMember { user_type: payload.user_type, user_id: payload.user_id, chaos_participant_id: payload.chaos_participant_id, vessel_id: payload.vessel_id },
            12 => Self::CreateContent { vessel_id: payload.vessel_id, id: payload.id, post_id: payload.post_id, user_id: payload.user_id, chaos_message_id: payload.chaos_message_id },
            13 => Self::CreateInvitation { vessel_id: payload.vessel_id, id: payload.id, post_id: payload.post_id, due: payload.due, user_id: payload.user_id, chaos_message_id: payload.chaos_message_id },
            14 => Self::CreatePoll { vessel_id: payload.vessel_id, id: payload.id, post_id: payload.post_id, user_id: payload.user_id, chaos_message_id: payload.chaos_message_id },
            15 => Self::VoteOnPost { vessel_id: payload.vessel_id, id: payload.id, post_type: payload.post_type, interaction_type: payload.interaction_type },
            _ => Self::Test {  }
        })
    }
}