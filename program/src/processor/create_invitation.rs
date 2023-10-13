use solana_program::{
    pubkey::Pubkey,
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    sysvar::{rent::Rent, Sysvar},
    program_error::ProgramError,
    system_instruction,
    msg
};

use crate::{processor::create_vessel, state::Invitation};
use crate::state::Vessel;
use borsh::BorshSerialize;

pub fn create_invitation(
    due: String,
    post_id: String,
    user_id: String,
    vessel_id: String,
    id: String,
    chaos_message_id: String,
    accounts: &[AccountInfo],
    program_id: &Pubkey,
) -> ProgramResult {
    msg!("Creating Invitation...");

    // Some constants for the post
    let for_invite: u64 = 0;
    let against_invite: u64 = 0;
    let post_type = String::from("invitation");

    msg!("Extracting Accounts");
    // Extract accounts
    let accounts_iter = &mut accounts.iter();

    let member_account = next_account_info(accounts_iter)?;
    let owner = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program_account = next_account_info(accounts_iter)?;

    // Get PDA storing community data
    msg!("Deriving PDA");
    let (pda, bump_seed) = create_vessel::derive_program_account(owner.key, &vessel_id, program_id);

    msg!("Deserializing Account data");
    // Deserialize it
    let mut account_data = crate::processor::create_vessel::my_try_from_slice_unchecked::<Vessel>(&pda_account.data.borrow()).unwrap();

    msg!("Adding poll to account");
    account_data.add_post(&post_id, &user_id, &member_account.key.to_bytes(), &post_type, &chaos_message_id);

    msg!("Add Invitation to account");
    let new_invitation = Invitation {
        id,
        post_id,
        due,
        for_invite,
        against_invite,
        user_to_be_invited: member_account.key.to_bytes()
    };
    account_data.invites.push(new_invitation);

    // Add lamports if needed
    msg!("Calculating Rent Needed!");
    let rent = Rent::get()?;
    let new_account_size = create_vessel::get_vessel_size(&account_data);
    let new_rent_lamports = rent.minimum_balance(new_account_size);

    if pda_account.lamports() < new_rent_lamports {
        msg!("Charging Member for entry");
        // Charge member for lamports
        let lamports_to_be_paid = new_rent_lamports - pda_account.lamports();
        if member_account.lamports() < lamports_to_be_paid {
            return Err(ProgramError::InsufficientFunds);
        }

        // Fund account
        msg!("Running charge command");
        create_vessel::invoke_signed_transaction(
            &system_instruction::transfer(member_account.key, pda_account.key, lamports_to_be_paid), 
            &[owner.clone(), system_program_account.clone(), member_account.clone(), pda_account.clone()], 
            owner.key, 
            &vessel_id, 
            bump_seed
        )?;
    }

    // Increase size of account
    pda_account.realloc(new_account_size, false)?;

    // Save changes in account
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
    async fn create_poll_works() {
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
            user_type: String::from("member"),
            user_id: String::from("user#2"),
            chaos_participant_id: String::from("chaos_participant#1"),
            vessel_id: String::from("VesselID"),
            creator_id: String::from(""),
            chaos_channel_id: String::from(""),
            post_id: String::from("post#1"),
            post_type: String::from("invitation"),
            chaos_message_id: String::from("sfafd"),
            due: String::from("13-10-2023"),
            for_invite: 0,
            against_invite: 0,
            upvotes: 0,
            downvotes: 0,
            interaction_type: String::from("")
        };
        // Create vessel
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

        // Create a invitation for the vessel
        let mut sink2 = vec![13];
        instruction_data.serialize( &mut sink2).unwrap();
        let mut transaction2 = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink2
            }],
            Some(&payer.pubkey()),
        );

        transaction2.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction2).await.unwrap();

        // Test if any of the created members has the id of the added member
        let created_account = banks_client.get_account(test_account.pubkey()).await;

        match created_account {
            Ok(None) => assert_eq!(false, true),
            Ok(Some(account)) => {
                let vessel = Vessel::deserialize(&mut account.data.to_vec().as_ref()).unwrap();
                
                // See if any poll was added
                assert!(vessel.invites.len() >= 1, "No invite was created `{}`", vessel.name);

                // See if any post was added
                assert!(vessel.posts.len() >= 1, "No post was created `{}`", vessel.name);

                // See if the write member was created
                let mut found = false;
                for x in vessel.invites {
                    if x.post_id == instruction_data.post_id {
                        found = true
                    }
                }

                assert_eq!(found, true, "The wrong invite was created");
            },
            Err(_) => assert_eq!(false, true),
        }

    }
}