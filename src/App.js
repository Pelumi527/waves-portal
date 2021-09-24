import './App.css';

function App() {

  // just a start variable that stores our user's public //wallet address
  const [currAccount,setCurrentAccount] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [allWaves, setAllWaves] = useState([]);

  const[message, setMessage] = useState("")

  const handleChange = (e) => {
    setMessage(e.target.value)
  } 
  const contractAddress = "0xc356911491C72220416BBDfD15FFa24a019c5352";
  const contractABI = abi.abi;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const waveportalContract = new ethers.Contract(contractAddress,contractABI, signer);
  

  async function getAllWaves() {
    let waves = await waveportalContract.getAllWaves();
    let wavesCleaned = []
      waves.forEach(wave => {
        wavesCleaned.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
      })
    })
    setAllWaves(wavesCleaned)

    waveportalContract.on("NewWave", (from, timestamp, message) => {
      alert("NewWave", from, timestamp, message)
      setAllWaves(oldArray => [...oldArray, {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message
      }])
    })
  }

  const checkIfWalletIsConnected = () => {
    const {ethereum} = window;
    if(!ethereum){
      console.log("make sure you have metamask")
      return
    } else{
      console.log("we have ethereum object", ethereum)
    }

    ethereum.request({method: "eth_accounts"})
    .then(accounts => {
      if(accounts !== 0) {
        const account = accounts[0];
        console.log("found an authorized account: ", account)
        setCurrentAccount(account);
        getAllWaves();
      } else{
        console.log("No authorized account found")
      }
    })    
}

  const connectWallet = () => {
    const {ethereum} = window;
    if(!ethereum){
      alert("Get MetaMask");
    }

    ethereum.request({ method: 'eth_requestAccounts'})
    .then(accounts => {
      console.log('connected', accounts[0])
      setCurrentAccount(accounts[0])
    })
    .catch(err => console.log(err));
  }

  React.useEffect(() => {
    checkIfWalletIsConnected()
  }, [])



  const wave = async () => {
    setIsLoading(true);
    const waveTxn = await waveportalContract.wave(message);
    console.log(message)
    console.log('Mining...', waveTxn.hash)
    await waveTxn.wait()
    console.log('Mined--', waveTxn.hash)
    setIsLoading(false);
    await getAllWaves()
  }

  const getTotalWave = async () => {
    const count = await waveportalContract.TotalWaves();
    let result = count.toNumber();
    console.log(result)
    return result
  }

  

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>
        <div className="bio">
          <h4>
            Hi, My name is Pelumi, you got a message for me send it here. Right, you got to connect to the Rinkeby network to drop a message.
          </h4>
        </div>
        <label className="label">
          <textarea onChange=   {handleChange} placeholder="Send your message here">
          </textarea>
        </label>
        <button className="waveButton" onClick={wave} disabled={isLoading}>
          {isLoading && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden ="true"
            />
          )}
          Wave At Me
        </button>

        {currAccount ? null : (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={wave.timestamp} className="board">
              <div> Address: {wave.address}</div>
              <div> Time: {wave.timestamp.toString()}</div>
              <div> Message: {wave.message}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
