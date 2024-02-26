import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { getContract } from "../config";
import Image from "next/image";

function Minting() {
  const [mintingWalletKey, setMintingWalletKey] = useState("");
  const [mintingAmount, setMintingAmount] = useState<number>();
  const [mintingAddress, setMintingAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [balance, setBalance] = useState<number>();

  const balanceString = balance?.toString();

  const mintCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.mint(mintingWalletKey, mintingAmount);
      await tx.wait();
      setSubmitted(true);
      setTransactionHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };

  const getBalance = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const balance = await contract.balanceOf(signer);
      const adjustedBalance = Number(balance) / 1000000000000000000;
      setBalance(adjustedBalance);
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Fetching stake failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown error occurred.");
      }
    }
  };


  const amountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setMintingAmount(Number(inputValue));
      console.log(inputValue);
    } else {
      setMintingAmount(undefined);
    }
  };

  const addressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setMintingAddress(inputValue);
    setMintingWalletKey(inputValue);
    console.log(inputValue);
  };

  return (
    <div
      className="flex grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:text-left rounded-lg p-4 bg-gradient-to-b from-amber-700 to-amber-900 h-96"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="flex justify-center items-center flex-col">
      <div className="mb-10 minting-container flex items-center">
          <p className="mt-10 flex justify-center items-center font-turds text-xl">
            Current Ebak Balance: &nbsp;{" "}
            <p className="font-sans text-3xl" style={{ marginTop: "-4px" }}>
              {balanceString}
            </p>
            <Image
              src="/images/Ebak-Icon.png"
              alt="Left Image"
              width={30}
              height={30}
              className="ml-1 mb-1"
            />
          </p>
          <button
            onClick={() => {
              getBalance();
            }}
          >
            <Image
              src="/images/refresh.svg"
              alt="Left Image"
              width={20}
              height={20}
              className="ml-4 mt-10"
              style={{ filter: "invert(1)", transition: "transform 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </button>
        </div>
        <input
          type="text"
          className="mt-1 border rounded-md p-2 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-transparent"
          value={mintingAddress}
          onChange={(e) => addressChange(e)}
          placeholder="Enter wallet address"
          style={{ color: "black" }}
        />

        <input
          type="number"
          className="mt-5 border rounded-md p-2 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-transparent"
          value={mintingAmount}
          onChange={(e) => amountChange(e)}
          placeholder="Enter amount to mint"
          style={{ color: "black" }}
        />
        <button
          className="mt-10 flex justify-center items-center font-turds text-xl rounded-lg p-4 bg-yellow-400 transition duration-200 ease-in-out hover:bg-yellow-500 hover:shadow-lg"
          onClick={mintCoin}
        >
          MINT
        </button>
        <div className="mt-5 mb-4">
          {submitted && (
            <div className="minting-container flex items-center">
              <Image
                src="/images/Ebak-Icon.png"
                alt="Left Image"
                width={40}
                height={40}
                className="mr-5"
              />
              <p className="font-turds">Minting successful!</p>
              <Image
                src="/images/Ebak-Icon.png"
                alt="Left Image"
                width={40}
                height={40}
                className="ml-5"
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          {submitted && (
            <div className="minting-container flex items-center">
              <a
                href={`https://sepolia.arbiscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-turds text-blue-500  cursor-pointer"
              >
                Click to View Transaction 
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Minting;
