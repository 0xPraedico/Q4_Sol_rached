# MetaMem v0.3  

MetaMem v0.3 is a milestone version of my Capstone Project, developed during the **Turbin3 builder cohort**.  

MetaMem is an **index token launchpad** built on Solana, designed to:  
- Enable users to create custom token indexes or portfolios in just a few clicks.  
- Track the performance of these indexes over time.  
- Share indexes with friends, allowing them to replicate and invest easily.  

---

## Deployment  
MetaMem is deployed on the **Solana Devnet**:  
[7CQL1htK4GVPRyxasMhC9g2YScUeEcCUWtC5HWT9tk1](https://solana.fm/address/7CQL1htK4GVPRyxasMhC9g2YScUeEcCUWtC5HWT9tk1?cluster=devnet-alpha)  

---

## Core Functionalities & Tests

### 1. Index Creation  
- Users can select underlying tokens to compose an index.  
- The program handles the required token swaps, deposits them into an index vault.  

### 2. Redeem Process  
- Withdraw the underlying tokens
- Reverse swaps are automatically performed to return to the original currency or token.  

### Fee Management  
- Fees are collected during the swap operations and routed to a designated wallet for project sustainability.  

---

## Notable Features  

### **1. Raydium CPI Integration**  
MetaMem uses a **Cross-Program Invocation (CPI)** with the Raydium protocol to handle swaps within the Solana ecosystem efficiently.  

### **2. Transaction Scaling with Address Lookup Tables (ALTs)**  
To manage the size of transactions during the tests, MetaMem leverages **versioned transactions** and **Address Lookup Tables**, enabling atomic execution of multiple instructions.  

---

## Roadmap and Potential Improvements  

- **User Interface**: Develop a user-friendly frontend for easier interaction with the program.  
- **Jito Bundles Integration**: Increase the number of supported underlying tokens per index by leveraging Jito bundles, overcoming the limitations of transaction size.  
