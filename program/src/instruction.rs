use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

// Define the instructions that I'll be processing
pub enum VesselInstruction {
    CreateVessel {
        id: String,
        creator_id: String,
        name: String,
        description: String,
        chaos_channel_id: String,
        amount_token: u64,
    },
    // InviteFoundingMember {
    //     id: u64,
    // },
    InviteMember {
        address: String
    },
    AwardCommunityToken {
        address: String
    },
    CreateTask {
        title: String,
        description: String,
        amount_token: u64
    },
    CreateSpecialistVote {
        title: String,
        description: String
    },
    VoteSpecialist {
        voted_member: String
    },
    VoteMemberIn{
        member: String,
        vote: bool
    },
    VoteMemberOut {
        member: String,
        vote: bool
    },
    GetVessels,
    RequestInvite {
        member: String,
        vessel_address: String
    },
    AddMember {
        user_type: String,
        user_id: String,
        chaos_participant_id: String,
        vessel_id: String
    },
    // InviteSpecialist {
    //     id: u64,
    //     role: String
    // }
}

// Define data in instruction
#[derive(BorshDeserialize)]
struct VesselInstructionStruct {
    id: String,
    name: String,
    description: String,
    amount_token: u64,
    address: String,
    title: String,
    voted_member: String,
    member: String,
    vote: bool,
    vessel_address: String,
    user_type: String,
    user_id: String,
    chaos_participant_id: String,
    vessel_id: String,
    creator_id: String,
    chaos_channel_id: String,
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
            2 => Self::InviteMember { address: payload.address },
            3 => Self::AwardCommunityToken { address: payload.address },
            4 => Self::CreateTask { title: payload.title, description: payload.description, amount_token: payload.amount_token },
            5 => Self::CreateSpecialistVote { title: payload.title, description: payload.description },
            6 => Self::VoteSpecialist { voted_member: payload.voted_member },
            7 => Self::VoteMemberIn { member: payload.member, vote: payload.vote },
            8 => Self::VoteMemberOut { member: payload.member, vote: payload.vote },
            9 => Self::GetVessels,
            10 => Self::RequestInvite { member: payload.member, vessel_address: payload.vessel_address },
            11 => Self::AddMember { user_type: payload.user_type, user_id: payload.user_id, chaos_participant_id: payload.chaos_participant_id, vessel_id: payload.vessel_id },
            _ => return Err(ProgramError::InvalidInstructionData)
        })
    }
}