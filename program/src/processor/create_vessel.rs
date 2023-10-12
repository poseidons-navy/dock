use solana_program::{
    pubkey::Pubkey,
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    sysvar::{rent::Rent, Sysvar},
    program::invoke_signed,
    program_error::ProgramError,
    system_instruction,
    instruction::Instruction,
    borsh0_10::try_from_slice_unchecked,
    msg,
};

pub fn get_vessel_size(vessel: &Vessel) -> usize {
    let PUBKEY_SIZE = 32;
    let mut member_size = 0;

    for x in vessel.members.iter() {
        member_size += (2 * PUBKEY_SIZE) + (4 + x.user_id.len()) + (4 + x.user_type.len() + 4 + x.chaos_participant_id.len())
    }
    let is_initialized = 1;
    let amount_token = 4;
    let is_created = 1;

    let mut category_size = 0;
    for y in vessel.categories.iter() {
        category_size += (4 + y.len())
    }

    let size = is_initialized + (4 + vessel.name.len()) + (4 + vessel.description.len()) + amount_token + member_size + is_created + category_size + (4 + vessel.id.len()) + (4 + vessel.creator_id.len()) + PUBKEY_SIZE + (4 + vessel.chaos_channel_id.len());
    size
}

pub fn derive_program_account(
    owner_key: &Pubkey,
    id: &String,
    program_id: &Pubkey
) -> (Pubkey, u8) {
    let (pda, bump_seed) = Pubkey::find_program_address(&[owner_key.as_ref(), id.as_bytes().as_ref()], program_id);
    (pda, bump_seed)
}

pub fn invoke_signed_transaction(
    instruction: &Instruction,
    account_info: &[AccountInfo],
    owner_key: &Pubkey,
    id: &String,
    bump_seed: u8
) -> ProgramResult {
    invoke_signed(
        instruction,
        account_info, 
        &[&[owner_key.as_ref(), id.as_bytes().as_ref(), &[bump_seed]]]
    )?;

    Ok(())
}

use std::convert::TryInto;
use crate::state::Vessel;
use borsh::{BorshSerialize, BorshDeserialize};

pub fn create_vessel(
    name: String,
    id: String,
    description: String,
    chaos_channel_id: String,
    creator_id: String,
    amount_token: u64,
    program_id: &Pubkey,
    accounts: &[AccountInfo]
) -> ProgramResult {
    msg!("Creating A Vessel...");
    // Get accounts
    let accounts_iter = &mut accounts.iter();

    let owner = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Get amount of space needed
    msg!("Getting Amount Of Space Needed");
    let default_vessel = Vessel {
        is_initialized: true,
        name,
        description,
        amount_token,
        members: Vec::new(),
        is_created: false,
        categories: Vec::new(),
        id: id.clone(),
        creator_id,
        owner_key: owner.key.clone().to_bytes(),
        chaos_channel_id
    };
    let account_len = get_vessel_size(&default_vessel);
    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(account_len);
    
    // Derive PDA
    msg!("Deriving PDA");
    let (pda, bump_seed) = derive_program_account(owner.key, &id, program_id);

    if pda != pda_account.key.clone() {
        return Err(ProgramError::InvalidArgument);
    }

    // Create account
    msg!("Creating PDA");
    invoke_signed_transaction(
        &system_instruction::create_account(
            owner.key, 
            pda_account.key, 
            rent_lamports, 
            account_len.try_into().unwrap(), 
            program_id
        ), 
        &[owner.clone(), pda_account.clone(), system_program.clone()], 
        owner.key, 
        &id, 
        bump_seed
    )?;

    // Update data in account
    msg!("Updating PDA");
    let mut account_data = Vessel::try_from_slice(&pda_account.data.borrow()).unwrap();
    account_data.amount_token = default_vessel.amount_token;
    account_data.categories = default_vessel.categories;
    account_data.chaos_channel_id = default_vessel.chaos_channel_id;
    account_data.creator_id = default_vessel.creator_id;
    account_data.description = default_vessel.description;
    account_data.id = default_vessel.id;
    account_data.is_created = default_vessel.is_created;
    account_data.is_initialized = default_vessel.is_initialized;
    account_data.members = default_vessel.members;
    account_data.name = default_vessel.name;
    account_data.owner_key = default_vessel.owner_key;

    msg!("Serializing Data to PDA");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;

    Ok(())
}

// #[cfg(test)]
// mod test {
//     use {
//         super::*,
//         assert_matches::*,
//         solana_program::instruction::{AccountMeta, Instruction},
//         solana_program_test::*,
//         solana_sdk::{signature::Signer, transaction::Transaction, signer::keypair::Keypair},
//     };

    
// }

// fn create_vessel_token(
//     name: String,
//     program_id: &Pubkey,
//     accounts: &[AccountInfo],
// ) -> ProgramResult {
//     // Get accounts from accounts
//     let accounts_iter = &mut accounts.iter();
//     let owner_account = next_account_info(accounts_iter)?;
//     let token_mint_account = next_account_info(accounts_iter)?;
//     let token_account = next_account_info(accounts_iter)?;
//     let system_program_account = next_account_info(accounts_iter);

//     Ok(())
// }