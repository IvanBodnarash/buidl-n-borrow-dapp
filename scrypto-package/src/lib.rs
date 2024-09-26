use scrypto::prelude::*;

#[blueprint]
mod lending_platform {
    struct LendingPlatform {
        interest_rate: Decimal,
        collateral_ratio: Decimal,
        loan_vault: Vault,
        collateral_vault: Vault,
        loan_token: ResourceAddress,
        collateral_token: ResourceAddress,
    }

    impl LendingPlatform {
        // Function to initialize the lending platform
        pub fn instantiate_lending_platform(interest_rate: Decimal, collateral_ratio: Decimal) -> Global<LendingPlatform> {
            // Token creation
            let loan_bucket: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata! {
                    init {
                        "name" => "Loan Token", locked;
                        "symbol" => "LNT", locked;
                    }
                })
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1000)
                .into(); // Casting to the Bucket type

            let collateral_bucket: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata! {
                    init {
                        "name" => "Collateral Token", locked;
                        "symbol" => "CLT", locked;
                    }
                })
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1000)
                .into(); // Casting to the Bucket type

            // Creation of the vaults for the loan and collateral
            let loan_vault = Vault::with_bucket(loan_bucket);
            let collateral_vault = Vault::with_bucket(collateral_bucket);

            // Getting the resource addresses
            let loan_token = loan_vault.resource_address();
            let collateral_token = collateral_vault.resource_address();

            let component = Self {
                interest_rate,
                collateral_ratio,
                loan_vault,
                collateral_vault,
                loan_token,
                collateral_token,
            }
            .instantiate();

            component
                .prepare_to_globalize(OwnerRole::None)
                .globalize()
        }

        pub fn withdraw_collateral_token(&mut self, amount: Decimal, token_address: ResourceAddress) -> Bucket {
            assert!(token_address == self.collateral_token, "Invalid token address");
            self.collateral_vault.take(amount)
        }

        pub fn withdraw_loan_token(&mut self, amount: Decimal, token_address: ResourceAddress) -> Bucket {
            assert!(token_address == self.loan_token, "Invalid token address");
            self.loan_vault.take(amount)
        }

        // Method to get the collateral ratio
        pub fn get_collateral_ratio(&self) -> Decimal {
            self.collateral_ratio
        }

        // Method to get the interest rate
        pub fn get_interest_rate(&self) -> Decimal {
            self.interest_rate
        }

        // Method to deposit tokens
        pub fn deposit(&mut self, bucket: Bucket) {
            self.collateral_vault.put(bucket);
        }

        // Method of issuing loans
        pub fn borrow(&mut self, loan_amount: Decimal, mut collateral: Bucket) -> (Bucket, Bucket) {
            let collateral_required = loan_amount * self.collateral_ratio;
            assert!(collateral.amount() >= collateral_required, "Insufficient collateral");

            // Moving the collateral to the collateral vault
            self.collateral_vault.put(collateral.take(collateral_required));

            // Issuance of the loan
            let loan_bucket = self.loan_vault.take(loan_amount);

            // Return the remaining collateral to the user
            (loan_bucket, collateral)
        }

        // Method of repaying loans
        pub fn repay(&mut self, loan_repayment: Bucket, collateral_amount: Decimal) -> Bucket {
            // Returning the loan to the loan vault
            self.loan_vault.put(loan_repayment);

            // Returning the collateral to the user
            self.collateral_vault.take(collateral_amount)
        }
    }
}









