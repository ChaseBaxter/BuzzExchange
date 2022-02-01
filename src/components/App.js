import React, { Component } from 'react'
import Web3 from 'web3'
import Buzzcoin from '../abis/Buzzcoin.json'
import BuzzExchange from '../abis/BuzzExchange.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const etherBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ etherBalance })

    // Load Buzzcoin
    const networkId =  await web3.eth.net.getId()
    const buzzcoinData = Buzzcoin.networks[networkId]
    if(buzzcoinData) {
      const buzzcoin = new web3.eth.Contract(Buzzcoin.abi, buzzcoinData.address)
      this.setState({ buzzcoin })
      let buzzcoinBalance = await buzzcoin.methods.balanceOf(this.state.account).call()
      this.setState({ buzzcoinBalance: buzzcoinBalance.toString() })
    } else {
      window.alert('Buzzcoin contract not deployed to detected network.')
    }


     //Load EtherSwap
   const buzzExchangeData = BuzzExchange.networks[networkId]
    if(buzzExchangeData) {
      const buzzExchange = new web3.eth.Contract(BuzzExchange.abi, buzzExchangeData.address)
      this.setState({ buzzExchange })
    } else {
      window.alert('BuzzExchange contract not deployed to detected network.')
    }

   this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  buyBuzzcoins = (etherAmount) => {
    this.setState({ loading: true })
    this.state.buzzExchange.methods.buyBuzzcoins().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      buzzcoin: {},
      buzzExchange: {}, 
      etherBalance: '0',
      buzzcoinBalance: '0',
      loading: true
    }
  }

  render() {
    let content

    if(this.state.loading) {
     content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
        etherBalance={this.state.etherBalance}
        buzzcoinBalance={this.state.buzzcoinBalance}
        buyBuzzcoins={this.buyBuzzcoins}
        sellBuzzcoins={this.sellBuzzcoins}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row center">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://github.com/yuvan11"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
           {content}
    
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
