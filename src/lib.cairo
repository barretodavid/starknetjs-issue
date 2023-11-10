#[starknet::interface]
trait ISimple<T> {
    fn value(self: @T) -> felt252;
}

#[starknet::contract]
mod Simple {
    use super::ISimple;

    #[storage]
    struct Storage {
        value: felt252
    }

    #[constructor]
    fn constructor(ref self: ContractState, value: felt252) {
        self.value.write(value);
    }

    #[external(v0)]
    impl SimpleImpl of ISimple<ContractState> {
        fn value(self: @ContractState) -> felt252 {
            self.value.read()
        }
    }
}