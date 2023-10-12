use solana_program::{
    pubkey::Pubkey,
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    sysvar::{rent::Rent, Sysvar},
    program::invoke_signed,
    system_instruction,
    instruction::Instruction,
    program_error::ProgramError,
    msg
};

pub fn get_vessel_size(vessel: &Vessel) -> usize {
    const PUBKEY_SIZE: usize = 32;
    let mut member_size = 0;

    for x in vessel.members.iter() {
        member_size += (2 * PUBKEY_SIZE) + (4 + x.user_id.len()) + (4 + x.user_type.len() + 4 + x.chaos_participant_id.len())
    }
    let is_initialized = 1;
    let amount_token = 4;
    let is_created = 1;

    let mut category_size = 0;
    for y in vessel.categories.iter() {
        category_size += 4 + y.len()
    }

    // Calculating content size
    let mut content_size = 0;
    let upvote_size = 4;
    let downvote_size = 4;
    for z in vessel.contents.iter() {
        content_size += upvote_size + downvote_size + 4 + z.id.len() + z.post_id.len()
    }

    // Calculating post size
    let mut post_size = 0;
    for w in vessel.posts.iter() {
        post_size += PUBKEY_SIZE + 4 + w.chaos_message_id.len() + 4 + w.id.len() + 4 + w.post_type.len() + 4 + w.user_id.len()
    }

    // Calculating invitation size
    let mut invitation_size = 0;
    let for_invite = 4;
    let against_invite = 4;
    for v in vessel.invites.iter() {
        invitation_size += PUBKEY_SIZE + for_invite + against_invite + 4 + v.id.len() + 4 + v.due.len() + 4 + v.post_id.len()
    }

    // Calculating poll size
    let mut poll_size = 0;
    let for_poll = 4;
    let against_poll = 4;
    for u in vessel.polls.iter() {
        poll_size += for_poll + against_poll + 4 + u.id.len() + 4 + u.post_id.len()
    }

    let size = is_initialized + (4 + vessel.name.len()) + (4 + vessel.description.len()) + amount_token + member_size + is_created + category_size + (4 + vessel.id.len()) + (4 + vessel.creator_id.len()) + PUBKEY_SIZE + (4 + vessel.chaos_channel_id.len()) + content_size + post_size + invitation_size + poll_size;
    size + 100
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
use borsh::BorshSerialize;

pub fn my_try_from_slice_unchecked<T: borsh::BorshDeserialize>(data: &[u8]) -> Result<T, ProgramError> {
    let mut data_mut = data;
    match T::deserialize(&mut data_mut) {
      Ok(result) => Ok(result),
      Err(_) => Err(ProgramError::InvalidInstructionData)
    }
  }

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
    msg!("Extracting Accounts");
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
        chaos_channel_id,
        posts: Vec::new(),
        polls: Vec::new(),
        contents: Vec::new(),
        invites: Vec::new()
    };

    msg!("Calculating Rent");
    let account_len = get_vessel_size(&default_vessel);
    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(account_len);
    
    // Derive PDA
    msg!("Deriving PDA");
    let (pda, bump_seed) = derive_program_account(owner.key, &id, program_id);

    // if pda != pda_account.key.clone() {
    //     return Err(ProgramError::InvalidArgument);
    // }

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
    // let mut account_data = try_from_slice_unchecked::<Vessel>(&pda_account.data.borrow()).unwrap();
    let mut account_data = my_try_from_slice_unchecked::<Vessel>(&pda_account.data.borrow()).unwrap();
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

#[cfg(test)]
mod tests {
    use {
        super::*,
        solana_program_test::*,
        solana_program::system_program,
        solana_program::instruction::{AccountMeta, Instruction},
        solana_sdk::{signature::Signer, transaction::Transaction, signer::keypair::Keypair},
        crate::instruction::VesselInstructionStruct,
        borsh::{BorshSerialize, BorshDeserialize},
    };


    #[tokio::test]
    async fn create_vessel_works() {
        let instruction_data = VesselInstructionStruct {
            id: String::from("VesselID"),
            name: String::from("Vessel Name"),
            description: String::from("Some Vessel"),
            amount_token: 64,
            address: String::from(""),
            title: String::from(""),
            voted_member: String::from(""),
            member: String::from(""),
            vote: true,
            vessel_address: String::from(""),
            user_type: String::from(""),
            user_id: String::from(""),
            chaos_participant_id: String::from(""),
            vessel_id: String::from(""),
            creator_id: String::from(""),
            chaos_channel_id: String::from(""),
            post_id: String::from(""),
            post_type: String::from(""),
            chaos_message_id: String::from(""),
            due: String::from(""),
            for_invite: 0,
            against_invite: 0,
            upvotes: 0,
            downvotes: 0
        };
        let mut sink = vec![0];
        instruction_data.serialize( &mut sink).unwrap();
        let program_id = Pubkey::new_unique();

        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "Poseidons Dock",
            program_id,
            processor!(crate::entrypoint::process_instruction)
        )
        .start()
        .await;

        let test_account = Keypair::new();
        
        // let (test_account_key, bump_seed) = derive_program_account(&payer.pubkey(), &instruction_data.id, &program_id);
        // let test_account = banks_client.get_account(test_account_key).await.unwrap();

        // let test_account = match banks_client.get_account(test_account_key).await.unwrap() {
        //     Some(account) => {
        //         account
        //     },
        //     None => {
        //         return;
        //     }
        // };

        // let test_account = banks_client.

        let mut transaction = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink
            }],
            Some(&payer.pubkey()),
        );

        transaction.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction).await.unwrap();

        let created_account = banks_client.get_account(test_account.pubkey()).await;

        match created_account {
            Ok(None) => assert_eq!(false, true),
            Ok(Some(account)) => {
                let vessel = Vessel::deserialize(&mut account.data.to_vec().as_ref()).unwrap();
                assert_eq!(vessel.name, instruction_data.name);
            },
            Err(_) => assert_eq!(false, true),
        }
    }
}

    
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