module.exports = {
  setMsg(msg, addrGet, timestamp) {

    let type = ''
    let typeReadable = ''
    let color = ''
    let icon = ''
    let msgData = Object

    switch (msg['@type']) {
      case "/cosmos.bank.v1beta1.MsgSend":
        console.log(timestamp)
        if (msg.to_address === addrGet) {
          typeReadable = 'Payment Received'
        } else
          typeReadable = 'Send'
        type = msg['@type']

        color = '#00b786'
        icon = 'Send.svg'
        msgData = {
          from: msg.from_address,
          to: msg.to_address,
          amount: msg.amount[0].amount / 1000000
        }
        break;
      case "/cosmos.staking.v1beta1.MsgDelegate":
        type = msg['@type']
        typeReadable = 'Delegate'
        color = '#f0a841'
        icon = 'Stake.svg'
        msgData = {
          delegator_address: msg.delegator_address,
          validator_address: msg.validator_address,
          amount: msg.amount.amount / 1000000
        }
        break;
      case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward":
        type = msg['@type']
        typeReadable = 'Claim reward'
        color = '#6fffa3'
        icon = 'ClaimRewards.svg'
        msgData = {
          delegator_address: msg.delegator_address,
          validator_address: msg.validator_address
        }
        break;
      case "/cosmos.staking.v1beta1.MsgUndelegate":
        type = msg['@type']
        typeReadable = 'Unbound'
        color = '#f15249'
        icon = 'Unstake.svg'
        msgData = {
          delegator_address: msg.delegator_address,
          validator_address: msg.validator_address,
          amount: msg.amount.amount / 1000000
        }
        break;                
      case "/cosmos.gov.v1beta1.MsgSubmitProposal":
          type = msg['@type']
          typeReadable = 'Submit proposal'
          color = '#8555de'
          icon = 'Unknown.svg'
          /* msgData = {
            proposal_id: msg.proposal_id,
            option: msg.option
          }      */     
          console.log(msg)
        break;
        case "/cosmos.gov.v1beta1.MsgVote":
          type = msg['@type']
          typeReadable = 'Vote'
          color = '#00b786'
          icon = 'Unknown.svg'
          msgData = {
            proposal_id: msg.proposal_id,
            option: msg.option
          }          
          console.log(msg)
        break;
        case "/cosmos.gov.v1beta1.MsgDeposit":
        case "/cosmos.gov.v1.MsgDeposit":
          type = msg['@type']
          typeReadable = 'Submit Deposit'
          color = '#00b786'
          icon = 'Unknown.svg'
          msgData = {
            proposal_id: msg.proposal_id,
            amount: msg.amount[0].amount / 1000000
          }
        break;
      case "/cosmos.staking.v1beta1.MsgBeginRedelegate":
        typeReadable = 'Redelegate'
        color = '#00b786'
        icon = 'Unknown.svg'
        break;     
      case "/ibc.applications.transfer.v1.MsgTransfer":
        typeReadable = 'IBC'
        color = '#00b786'
        icon = 'Unknown.svg'
        break;
      case "/cosmos.bank.v1beta1.MsgMultiSend":
        typeReadable = 'MultiSend'
        color = '#00b786'
        icon = 'Unknown.svg'
        break;
      case "/cosmos.group.v1.MsgCreateGroupWithPolicy":
        typeReadable = 'Create Group With Policy'
        color = '#00b786'
        icon = 'Unknown.svg'
        break;
      case "/cosmos.group.v1.MsgUpdateGroupMembers":
        typeReadable = 'Update Group Members'
        color = '#00b786'
        icon = 'Unknown.svg'
        break;
      case "/cosmos.group.v1.MsgCreateGroupPolicy":
        typeReadable = 'Create Group Policy'
        color = '#00b786'
        icon = 'Unknown.svg'
        break;
      case "/cosmos.group.v1.MsgSubmitProposal":
        typeReadable = 'Submit Group Proposal'
        color = '#00b786'
        icon = 'Unknown.svg'
        break;
      case "/cosmos.group.v1.MsgVote":
        type = msg['@type']
        typeReadable = 'Group Vote'
        color = '#8555de'
        icon = 'Unknown.svg'
        msgData = {
          option: msg.option,
          proposal_id: msg.proposal_id,
          metadata: msg.metadata
        }
        break;
      case "/cosmos.group.v1.MsgExec":
        typeReadable = 'Group Execute'
        color = '#00b786'
        icon = 'Unknown.svg'
        break;

      default:
        console.log("Sorry, dont know " + msg['@type'] + ".");
    }
    return { type, typeReadable, color, icon, timestamp, msgData }
  }
}
