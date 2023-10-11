use solana_program::{
    pubkey::Pubkey,
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    sysvar::{rent::Rent, Sysvar},
    program::{invoke_signed},
    system_instruction,
    borsh0_10::try_from_slice_unchecked,
    msg
};

use std::convert::TryInto;
use crate::state::{Vessel, Member};
use borsh::BorshSerialize;

pub fn create_vessel(
    id: u64,
    name: String,
    description: String,
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
    let account_len = 4 + 1 + (4 + name.len())  + (4 + description.len()) + 4;
    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(account_len);
    
    // Derive PDA
    msg!("Deriving PDA");
    let (pda, bump_seed) = Pubkey::find_program_address(&[owner.key.as_ref(), id.to_be_bytes().as_ref()], program_id);

    // Create account
    msg!("Creating PDA");
    invoke_signed(
        &system_instruction::create_account(
            owner.key, 
            pda_account.key, 
            rent_lamports, 
            account_len.try_into().unwrap(), 
            program_id
        ),
        &[owner.clone(), pda_account.clone(), system_program.clone()], 
        &[&[owner.key.as_ref(), id.to_be_bytes().as_ref(), &[bump_seed]]]
    )?;

    // Update data in account
    msg!("Updating PDA");
    let mut account_data = try_from_slice_unchecked::<Vessel>(&pda_account.data.borrow()).unwrap();
    account_data.amount_token = amount_token;
    account_data.description = description;
    account_data.id = id;
    account_data.is_initialized = true;
    account_data.name = name;
    account_data.members = Vec::new();

    msg!("Serializing Data to PDA");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;

    Ok(())
}

#[cfg(test)]
mod test {
    use {
        super::*,
        assert_matches::*,
        solana_program::instruction::{AccountMeta, Instruction},
        solana_program_test::*,
        solana_sdk::{signature::Signer, transaction::Transaction, signer::keypair::Keypair},
    };

    
}

fn create_vessel_token(
    name: String,
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    // Get accounts from accounts
    let accounts_iter = &mut accounts.iter();
    let owner_account = next_account_info(accounts_iter)?;
    let token_mint_account = next_account_info(accounts_iter)?;
    let token_account = next_account_info(accounts_iter)?;
    let system_program_account = next_account_info(accounts_iter);

    Ok(())
}