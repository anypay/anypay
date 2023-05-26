
interface ERC20TransferInstruction {
  data: string; // data contains both address and amount, and is ultimately required
  to: string; // address of token recipient encoded in the data hex field
  amount: number; // this is the amount to transfer in the base units (6 decimals for ERC20)
}

interface UTXOTransferInstruction {
  outputs: {
    address: string;
    amount: number;
  }[]; 
}

type Instruction = ERC20TransferInstruction | UTXOTransferInstruction | any

export default Instruction

