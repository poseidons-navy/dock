use solana_program::{
    account_info::AccountInfo,
    pubkey::Pubkey,
    entrypoint,
    entrypoint::ProgramResult
};

use crate::{instruction::VesselInstruction, processor::create_invitation};
use crate::processor::{
    create_vessel,
    // invite_founding_member,
    invite_member,
    award_community_token,
    create_task,
    create_specialist_vote,
    vote_specialist,
    vote_member_in,
    vote_member_out,
    get_vessels,
    request_invite,
    add_member,
    create_content,
    create_poll
};


entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    // Get instruction from data
    let instruction = VesselInstruction::unpack(instruction_data)?;

    // Get accounts
    // let accounts_iter = &mut accounts.iter();

    // let owner = next_account_info(accounts_iter)?;
    // let pda_account = next_account_info(accounts_iter)?;
    // let system_program = next_account_info(accounts_iter)?;

    // Run different functions based on type of instruction
    match instruction {
        VesselInstruction::CreateVessel { id, creator_id, name, description, chaos_channel_id, amount_token } => {
            create_vessel::create_vessel(name, id, description, chaos_channel_id, creator_id, amount_token, program_id, accounts)
        },
        VesselInstruction::CreateContent { vessel_id, id, post_id, user_id, chaos_message_id } => {
            create_content::create_content(post_id, user_id, vessel_id, id, chaos_message_id, accounts, program_id)
        },
        VesselInstruction::CreateInvitation { vessel_id, id, post_id, due, user_id, chaos_message_id } => {
            create_invitation::create_invitation(due, post_id, user_id, vessel_id, id, chaos_message_id, accounts, program_id)
        },
        VesselInstruction::CreatePoll { vessel_id, id, post_id, user_id, chaos_message_id } => {
            create_poll::create_poll(post_id, user_id, vessel_id, id, chaos_message_id, accounts, program_id)
        },
        // VesselInstruction::InviteFoundingMember { id } => {
        //     invite_founding_member::invite_founding_member(program_id, accounts, id)
        // },
        VesselInstruction::InviteMember { address } => {
            invite_member::invite_member(program_id, accounts, address)
        },
        VesselInstruction::AwardCommunityToken { address } => {
            award_community_token::award_community_token(program_id, accounts, address)
        },
        VesselInstruction::CreateTask { title, description, amount_token } => {
            create_task::create_task(program_id, accounts, title, description, amount_token)
        },
        VesselInstruction::CreateSpecialistVote { title, description } => {
            create_specialist_vote::create_specialist_vote(program_id, accounts, title, description)
        },
        VesselInstruction::VoteSpecialist { voted_member } => {
            vote_specialist::vote_specialist(program_id, accounts, voted_member)
        },
        VesselInstruction::VoteMemberIn { member, vote } => {
            vote_member_in::vote_member_in(program_id, accounts, member, vote)
        },
        VesselInstruction::VoteMemberOut { member, vote } => {
            vote_member_out::vote_member_out(program_id, accounts, member, vote)
        },
        VesselInstruction::GetVessels => {
            get_vessels::get_vessels(program_id, accounts)
        },
        VesselInstruction::RequestInvite { member, vessel_address } => {
            request_invite::request_invite(program_id, accounts, member, vessel_address)
        },
        VesselInstruction::AddMember { user_type, user_id, chaos_participant_id, vessel_id } => {
            add_member::add_member(vessel_id, user_type, user_id, chaos_participant_id, accounts, program_id)
        }
        // VesselInstruction::InviteSpecialist { id } => {
        //     invite_specialist_member::invite_specialist(program_id, accounts, id)
        // }
    }
}