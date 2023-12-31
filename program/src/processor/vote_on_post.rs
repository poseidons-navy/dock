use solana_program::{
    pubkey::Pubkey,
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    sysvar::{rent::Rent, Sysvar},
    program_error::ProgramError,
    system_instruction,
    msg
};

use crate::processor::create_vessel;
use crate::state::Vessel;
use borsh::BorshSerialize;
use chrono::{DateTime, Local};

pub fn vote_on_post(
    post_type: String,
    vessel_id: String,
    interaction_type: String,
    id: String,
    accounts: &[AccountInfo],
    program_id: &Pubkey,
) -> ProgramResult {
    msg!("Voting On Post...");
    if post_type != String::from("content") && post_type != String::from("invitation") && post_type != String::from("poll") {
        return Err(ProgramError::InvalidArgument);
    }

    if interaction_type != String::from("up") && interaction_type != String::from("down") {
        return Err(ProgramError::InvalidArgument);
    }

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
    let old_account_size = crate::processor::create_vessel::get_vessel_size(&account_data);

    if post_type == String::from("content") {
        msg!("{} on content", interaction_type);
        // Get content from id
        let mut found = false;
        let mut position = 0;

        msg!("Looking for content with id {}", id);
        for (i, x) in account_data.contents.iter().enumerate() {
            if x.id == id {
                found = true;
                position = i;
            }
        }

        // Throw error if content not found
        if found == false {
            msg!("Content Not Found!");
            return Err(ProgramError::InvalidArgument);
        }

        // Look for member from list of members in DAO
        found = false;
        for x in account_data.members.iter() {
            if x.key == member_account.key.to_bytes() {
                found = true;
            }
        }

        if found == false {
            msg!("Member is not part of the vessel!");
            return Err(ProgramError::InvalidAccountData);
        }

        // Edit content
        if interaction_type == String::from("up") {
            account_data.contents[position].upvotes += 1
        } else {
            account_data.contents[position].downvotes += 1
        }
    } else if post_type == String::from("poll") {
        msg!("{} on poll", interaction_type);
        // Get content from id
        let mut found = false;
        let mut position = 0;

        msg!("Looking for poll with id {}", id);
        for (i, x) in account_data.polls.iter().enumerate() {
            if x.id == id {
                found = true;
                position = i;
            }
        }

        // Throw error if content not found
        if found == false {
            msg!("Poll Not Found!");
            return Err(ProgramError::InvalidArgument);
        }

        // If result of poll has already been determined disable voting
        if account_data.polls[position].result != String::from("") {
            msg!("Poll result has already been determined");
            return Err(ProgramError::InvalidInstructionData);
        }

        // Check if member has already voted
        found = false;
        for x in account_data.polls[position].voted_members.iter() {
            if x.key == member_account.key.to_bytes() {
                found = true;
            }
        }

        if found == true {
            msg!("Member has already voted!");
            return Err(ProgramError::InvalidAccountData);
        }

        // Look for member from list of members in DAO
        found = false;
        let mut member_position = 0;
        for (i, x) in account_data.members.iter().enumerate() {
            if x.key == member_account.key.to_bytes() {
                found = true;
                member_position = i;
            }
        }

        if found == false {
            msg!("Member is not part of the vessel!");
            return Err(ProgramError::InvalidAccountData);
        }

        // Add member to list of members who voted on poll
        let member = &account_data.members[member_position];
        account_data.polls[position].voted_members.push(member.clone());

        // Edit content
        if interaction_type == String::from("up") {
            account_data.polls[position].for_invite += 1
        } else {
            account_data.polls[position].against_invite += 1
        }

        // If members who voted is greater than 60% get result
        if account_data.polls[position].voted_members.len() as f32 >= account_data.members.len() as f32 * 0.6 {
            if account_data.polls[position].for_invite > account_data.polls[position].against_invite {
                account_data.polls[position].result = String::from("for")
            } else {
                account_data.polls[position].result = String::from("against")
            }
        }
    } else {
        msg!("{} on invitation", interaction_type);
        // Get content from id
        let mut found = false;
        let mut position = 0;

        msg!("Looking for invitation with id {}", id);
        for (i, x) in account_data.invites.iter().enumerate() {
            if x.id == id {
                found = true;
                position = i;
            }
        }

        // Throw error if content not found
        if found == false {
            msg!("Invite Not Found!");
            return Err(ProgramError::InvalidArgument);
        }

        // Checking if invite has passed due date
        msg!("Checking if due date is still valid");
        let due_date = DateTime::parse_from_rfc3339(&account_data.invites[position].due).unwrap();
        let today = Local::now();

        if today > due_date {
            msg!("Invitation Has Passed Its Due Date");
            return Err(ProgramError::InvalidInstructionData);
        }

        // Look for member from list of members in DAO
        found = false;
        for x in account_data.members.iter() {
            if x.key == member_account.key.to_bytes() {
                found = true;
            }
        }

        if found == false {
            msg!("Member is not part of the vessel!");
            return Err(ProgramError::InvalidAccountData);
        }


        // Edit content
        if interaction_type == String::from("up") {
            account_data.invites[position].for_invite += 1
        } else {
            account_data.invites[position].against_invite += 1
        }
    }

    let new_account_size = crate::processor::create_vessel::get_vessel_size(&account_data);
    if new_account_size > old_account_size {
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

            // Increase size of account
            pda_account.realloc(new_account_size, false)?;
        }
    }

    // Serialize
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
    async fn upvote_content_works() {
        let instruction_data = VesselInstructionStruct {
            id: String::from("VesselID"),
            name: String::from("Vessel Name"),
            description: String::from("Some Vessel"),
            amount_token: 64,
            user_type: String::from("member"),
            user_id: String::from("user#2"),
            chaos_participant_id: String::from("chaos_participant#1"),
            vessel_id: String::from("VesselID"),
            creator_id: String::from(""),
            chaos_channel_id: String::from(""),
            post_id: String::from("post#1"),
            post_type: String::from("content"),
            chaos_message_id: String::from("sfafd"),
            due: String::from("13-10-2023"),
            interaction_type: String::from("up")
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

        // Create a member for the vessel
        let mut sink2 = vec![11];
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

        // Create a content for the vessel
        let mut sink3 = vec![12];
        instruction_data.serialize( &mut sink3).unwrap();
        let mut transaction3 = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink3
            }],
            Some(&payer.pubkey()),
        );

        transaction3.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction3).await.unwrap();

        // Upvote created content
        let mut sink4 = vec![15];
        instruction_data.serialize( &mut sink4).unwrap();
        let mut transaction4 = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink4
            }],
            Some(&payer.pubkey()),
        );

        transaction4.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction4).await.unwrap();

        // Get created account
        // Test if any of the created members has the id of the added member
        let created_account = banks_client.get_account(test_account.pubkey()).await;

        match created_account {
            Ok(None) => assert_eq!(false, true),
            Ok(Some(account)) => {
                let vessel = Vessel::deserialize(&mut account.data.to_vec().as_ref()).unwrap();
                
                // See if the content was updated
                let mut found = false;
                let mut position = 0;

                for (i, x) in vessel.contents.iter().enumerate() {
                    if x.id == instruction_data.id {
                        found = true;
                        position = i;
                    }
                }

                assert_eq!(found, true, "Content with id {} was not found", instruction_data.id);
                assert_eq!(vessel.contents[position].upvotes, 1, "Content was not upvoted, number of upvotes is {}", vessel.contents[position].upvotes);
            },
            Err(_) => assert_eq!(false, true),
        }

    }

    #[tokio::test]
    async fn downvote_poll_works() {
        let instruction_data = VesselInstructionStruct {
            id: String::from("VesselID"),
            name: String::from("Vessel Name"),
            description: String::from("Some Vessel"),
            amount_token: 64,
            user_type: String::from("member"),
            user_id: String::from("user#2"),
            chaos_participant_id: String::from("chaos_participant#1"),
            vessel_id: String::from("VesselID"),
            creator_id: String::from(""),
            chaos_channel_id: String::from(""),
            post_id: String::from("post#1"),
            post_type: String::from("poll"),
            chaos_message_id: String::from("sfafd"),
            due: String::from("13-10-2023"),
            interaction_type: String::from("down")
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

        // Create a member for the vessel
        let mut sink2 = vec![11];
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

        // Create a poll for the vessel
        let mut sink3 = vec![14];
        instruction_data.serialize( &mut sink3).unwrap();
        let mut transaction3 = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink3
            }],
            Some(&payer.pubkey()),
        );

        transaction3.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction3).await.unwrap();

        // Downvote created poll
        let mut sink4 = vec![15];
        instruction_data.serialize( &mut sink4).unwrap();
        let mut transaction4 = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink4
            }],
            Some(&payer.pubkey()),
        );

        transaction4.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction4).await.unwrap();

        // Get created account
        // Test if any of the created members has the id of the added member
        let created_account = banks_client.get_account(test_account.pubkey()).await;

        match created_account {
            Ok(None) => assert_eq!(false, true),
            Ok(Some(account)) => {
                let vessel = Vessel::deserialize(&mut account.data.to_vec().as_ref()).unwrap();
                
                // See if the content was updated
                let mut found = false;
                let mut position = 0;

                for (i, x) in vessel.polls.iter().enumerate() {
                    if x.id == instruction_data.id {
                        found = true;
                        position = i;
                    }
                }

                assert_eq!(found, true, "Poll with id {} was not found", instruction_data.id);
                assert_eq!(vessel.polls[position].against_invite, 1, "Poll was not voted against, number of against votes is {}", vessel.polls[position].against_invite);
                assert_eq!(vessel.polls[position].voted_members.len(), 1, "Member was not marked as voted, number of voted members is {}", vessel.polls[position].voted_members.len());
                assert_eq!(vessel.polls[position].result, String::from("against"), "Poll results not update well, number of against votes is {}, number of for votes is {} and result is {}", vessel.polls[position].against_invite, vessel.polls[position].for_invite, vessel.polls[position].result);
            },
            Err(_) => assert_eq!(false, true),
        }

    }

    #[tokio::test]
    async fn downvote_invite_works() {
        let instruction_data = VesselInstructionStruct {
            id: String::from("VesselID"),
            name: String::from("Vessel Name"),
            description: String::from("Some Vessel"),
            amount_token: 64,
            user_type: String::from("member"),
            user_id: String::from("user#2"),
            chaos_participant_id: String::from("chaos_participant#1"),
            vessel_id: String::from("VesselID"),
            creator_id: String::from(""),
            chaos_channel_id: String::from(""),
            post_id: String::from("post#1"),
            post_type: String::from("invitation"),
            chaos_message_id: String::from("sfafd"),
            due: String::from("2023-10-20T08:15:25.110Z"),
            interaction_type: String::from("down")
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

        // Create a member for the vessel
        let mut sink2 = vec![11];
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

        // Create a invitation for the vessel
        let mut sink3 = vec![13];
        instruction_data.serialize( &mut sink3).unwrap();
        let mut transaction3 = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink3
            }],
            Some(&payer.pubkey()),
        );

        transaction3.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction3).await.unwrap();

        // Downvote created invitation
        let mut sink4 = vec![15];
        instruction_data.serialize( &mut sink4).unwrap();
        let mut transaction4 = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink4
            }],
            Some(&payer.pubkey()),
        );

        transaction4.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction4).await.unwrap();

        // Get created account
        // Test if any of the created members has the id of the added member
        let created_account = banks_client.get_account(test_account.pubkey()).await;

        match created_account {
            Ok(None) => assert_eq!(false, true),
            Ok(Some(account)) => {
                let vessel = Vessel::deserialize(&mut account.data.to_vec().as_ref()).unwrap();
                
                // See if the invitation was updated
                let mut found = false;
                let mut position = 0;

                for (i, x) in vessel.invites.iter().enumerate() {
                    if x.id == instruction_data.id {
                        found = true;
                        position = i;
                    }
                }

                assert_eq!(found, true, "Invitation with id {} was not found", instruction_data.id);
                assert_eq!(vessel.invites[position].against_invite, 1, "Invitation was not voted against, number of against votes is {}", vessel.invites[position].against_invite);
            },
            Err(_) => assert_eq!(false, true),
        }

    }
}