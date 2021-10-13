var RLP = require("eth-lib/lib/rlp")
var Bytes = require("eth-lib/lib/bytes")
var utils = require('../../../../caver-utils')
var helpers = require('../../../../caver-core-helpers')
const {
  ACCOUNT_CREATION_TYPE_TAG,
  ACCOUNT_UPDATE_TYPE_TAG,

  ACCOUNT_KEY_NIL_TAG,
  ACCOUNT_KEY_PUBLIC_TAG,
  ACCOUNT_KEY_FAIL_TAG,

  FEE_DELEGATED_VALUE_TRANSFER_WITH_RATIO_TYPE_TAG,
  FEE_DELEGATED_ACCOUNT_UPDATE_TYPE_TAG,
  FEE_DELEGATED_ACCOUNT_UPDATE_WITH_RATIO_TYPE_TAG,
} = helpers.constants

function rlpEncodeForAccountCreation(transaction) {
  let accountKey

  const xyPoints = transaction.publicKey && utils.xyPointFromPublicKey(transaction.publicKey)

  // 1. Check Account key type
  if (xyPoints !== undefined && xyPoints.length) { // ACCOUNT_KEY_PUBLIC_TAG
    const [pubX, pubY] = xyPoints
    accountKey = ACCOUNT_KEY_PUBLIC_TAG + RLP.encode([pubX, pubY]).slice(2)
  } else { // ACCOUNT_KEY_NIL_TAG
    accountKey = ACCOUNT_KEY_NIL_TAG
  }

  return RLP.encode([
      RLP.encode([
        ACCOUNT_CREATION_TYPE_TAG,
        Bytes.fromNat(transaction.nonce),
        Bytes.fromNat(transaction.gasPrice),
        Bytes.fromNat(transaction.gas),
        transaction.to.toLowerCase(),
        Bytes.fromNat(transaction.value),
        transaction.from.toLowerCase(),
        Bytes.fromNat(transaction.humanReadable === true ? '0x1' : '0x0'),
        accountKey,
      ]),
      Bytes.fromNat(transaction.chainId || "0x1"),
      "0x",
      "0x",
    ])
}

function rlpEncodeForAccountUpdate(transaction) {
  let accountKey

  const xyPoints = transaction.publicKey && utils.xyPointFromPublicKey(transaction.publicKey)

  // 1. Check Account key type
  if (xyPoints !== undefined && xyPoints.length) { // ACCOUNT_KEY_PUBLIC_TAG
    const [pubX, pubY] = xyPoints
    accountKey = ACCOUNT_KEY_PUBLIC_TAG + RLP.encode([pubX, pubY]).slice(2)
  } else { // ACCOUNT_KEY_NIL_TAG
    accountKey = ACCOUNT_KEY_NIL_TAG
  }

  return RLP.encode([
      RLP.encode([
        ACCOUNT_UPDATE_TYPE_TAG,
        Bytes.fromNat(transaction.nonce),
        Bytes.fromNat(transaction.gasPrice),
        Bytes.fromNat(transaction.gas),
        transaction.from.toLowerCase(),
        accountKey,
      ]),
      Bytes.fromNat(transaction.chainId || "0x1"),
      "0x",
      "0x",
    ])
}

function rlpEncodeForFeeDelegatedAccountUpdate(transaction) {
  
  if (transaction.feePayer) {
    const typeDetacehdRawTransaction = '0x' + transaction.senderRawTransaction.slice(4)

    const [ nonce, gasPrice, gas, from, accountKey, [ [ v, r, s ] ] ] = utils.rlpDecode(typeDetacehdRawTransaction)

    return RLP.encode([
      RLP.encode([
        FEE_DELEGATED_ACCOUNT_UPDATE_TYPE_TAG,
        Bytes.fromNat(nonce),
        Bytes.fromNat(gasPrice),
        Bytes.fromNat(gas),
        from.toLowerCase(),
        accountKey,
      ]),
      transaction.feePayer.toLowerCase(),
      Bytes.fromNat(transaction.chainId || "0x1"),
      "0x",
      "0x"
    ])
    
  } else {
    let accountKey

    const xyPoints = transaction.publicKey && utils.xyPointFromPublicKey(transaction.publicKey)

    // 1. Check Account key type
    if (xyPoints !== undefined && xyPoints.length) { // ACCOUNT_KEY_PUBLIC_TAG
      const [pubX, pubY] = xyPoints
      accountKey = ACCOUNT_KEY_PUBLIC_TAG + RLP.encode([pubX, pubY]).slice(2)
    } else { // ACCOUNT_KEY_NIL_TAG
      accountKey = ACCOUNT_KEY_NIL_TAG
    }

    return RLP.encode([
        RLP.encode([
          FEE_DELEGATED_ACCOUNT_UPDATE_TYPE_TAG,
          Bytes.fromNat(transaction.nonce),
          Bytes.fromNat(transaction.gasPrice),
          Bytes.fromNat(transaction.gas),
          transaction.from.toLowerCase(),
          accountKey,
        ]),
        Bytes.fromNat(transaction.chainId || "0x1"),
        "0x",
        "0x",
      ])
  }
}

function rlpEncodeForFeeDelegatedAccountUpdateWithRatio(transaction) {
  
  if (transaction.feePayer) {
    const typeDetacehdRawTransaction = '0x' + transaction.senderRawTransaction.slice(4)

    const [ nonce, gasPrice, gas, from, accountKey, feeRatio, [ [ v, r, s ] ] ] = utils.rlpDecode(typeDetacehdRawTransaction)

    return RLP.encode([
      RLP.encode([
        FEE_DELEGATED_ACCOUNT_UPDATE_WITH_RATIO_TYPE_TAG,
        Bytes.fromNat(nonce),
        Bytes.fromNat(gasPrice),
        Bytes.fromNat(gas),
        from.toLowerCase(),
        accountKey,
        Bytes.fromNat(feeRatio),
      ]),
      transaction.feePayer.toLowerCase(),
      Bytes.fromNat(transaction.chainId || "0x1"),
      "0x",
      "0x"
    ])
    
  } else {
    let accountKey

    const xyPoints = transaction.publicKey && utils.xyPointFromPublicKey(transaction.publicKey)

    // 1. Check Account key type
    if (xyPoints !== undefined && xyPoints.length) { // ACCOUNT_KEY_PUBLIC_TAG
      const [pubX, pubY] = xyPoints
      accountKey = ACCOUNT_KEY_PUBLIC_TAG + RLP.encode([pubX, pubY]).slice(2)
    } else { // ACCOUNT_KEY_NIL_TAG
      accountKey = ACCOUNT_KEY_NIL_TAG
    }

    return RLP.encode([
        RLP.encode([
          FEE_DELEGATED_ACCOUNT_UPDATE_WITH_RATIO_TYPE_TAG,
          Bytes.fromNat(transaction.nonce),
          Bytes.fromNat(transaction.gasPrice),
          Bytes.fromNat(transaction.gas),
          transaction.from.toLowerCase(),
          accountKey,
          Bytes.fromNat(transaction.feeRatio),
        ]),
        Bytes.fromNat(transaction.chainId || "0x1"),
        "0x",
        "0x",
      ])
  }
}

module.exports = {
  rlpEncodeForAccountCreation,
  rlpEncodeForAccountUpdate,
  rlpEncodeForFeeDelegatedAccountUpdate,
  rlpEncodeForFeeDelegatedAccountUpdateWithRatio,
}