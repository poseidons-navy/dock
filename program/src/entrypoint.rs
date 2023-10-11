use solana_program::{
    account_info::{AccountInfo, next_account_info},
    pubkey::Pubkey,
    entrypoint,
    entrypoint::ProgramResult
};

use crate::instruction::VesselInstruction;
use crate::processor::{
    create_vessel,
    invite_founding_member,
    invite_member,
    award_community_token,
    create_task,
    create_specialist_vote,
    vote_specialist,
    vote_member_in,
    vote_member_out,
    get_vessels,
    request_invite,
    add_member
};


entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    // Get instruction from data
    let instruction = VesselInstruction::unpack(instruction_data)?;

    // Get accounts
    let accounts_iter = &mut accounts.iter();

    let owner = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Run different functions based on type of instruction
    match instruction {
        VesselInstruction::CreateVessel { id, name, description, amount_token } => {
            create_vessel::create_vessel(id, name, description, amount_token, program_id, accounts)
        }
        VesselInstruction::InviteFoundingMember { address } => {
            invite_founding_member::invite_founding_member(program_id, accounts, address)
        },
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
        VesselInstruction::AddMember { id } => {
            add_member::add_member(program_id, accounts, id)
        }
    }
}