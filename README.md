# Poseidon's Dock

## Introduction

Poseidon's Dock is a platform that allows people to form communiites that are DAOs. In the communities called vessels members can interact with each other in a similar way to reddit subbredits but still have the ability to vote on items like new members to join the vessel and to create polls. We created this to encourage the participation of students in communities in school and to make it easier for students to find and join school communities

## The Team

The team has 4 members: Roman Njoroge, Patrick Ojiambo, Donald Onyino and Victor Reno. We are students of the universtiy of Nairobi in Kenya and we wanted to create a solution to make it easier to create and interact in school communities

## Project Structure.
- This project is divided into four interdependant components

### 1. Dock-frontend
- This is a next.js application that serves as the frontend, enabling users to interact with our deployed blockchain.

### 2. Dock-offchain backend
- This is an offchain backend used as support for data coming from the blockchain. Though the blockchain provides a place to store data, we need the offchain backend for things like enforcing entity relationships

### 3. Dock-program 
- This is the solana program written in rust, responsible for handling instructions coming from the frontend and background service.

### 4. Dock-background service
- This component is responsible for syncing activity on the blockchain with the offchain backend

### 5. Chaos-message-service
- This service is responsible for handling all the logic behind creation and storage of messages offchain.
