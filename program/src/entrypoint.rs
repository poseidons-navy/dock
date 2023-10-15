//! Program entrypoint

#![cfg(not(feature = "no-entrypoint"))]

use solana_program::{
    account_info::AccountInfo,
    pubkey::Pubkey,
    entrypoint,
    entrypoint::ProgramResult
};

use crate::{instruction::VesselInstruction, processor::create_invitation};
use crate::processor::{
    create_vessel,
    add_member,
    create_content,
    create_poll,
    vote_on_post
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
        VesselInstruction::VoteOnPost { vessel_id, id, post_type, interaction_type } => {
            vote_on_post::vote_on_post(post_type, vessel_id, interaction_type, id, accounts, program_id)
        }
        VesselInstruction::AddMember { user_type, user_id, chaos_participant_id, vessel_id } => {
            add_member::add_member(vessel_id, user_type, user_id, chaos_participant_id, accounts, program_id)
        },
        VesselInstruction::Test {  } => {
            Ok(())
        }
    }
}